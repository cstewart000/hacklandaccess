import mqtt from 'mqtt';
import { Subject } from 'rxjs';
import { mqttDoorOpenReq, ServerStatus } from './mqttMessage';
import { Params } from './configuration';
import DeviceManager from './DeviceManager';
import { DeviceType } from './Device';
import { EventHandler, Event } from './EventHandler';
import Action from './Action';

function UserIsAuthorised(rfid: String): Boolean {
    return rfid === 'DD6F9E29';
}

export default class PubSub {
    private mqttClient: mqtt.Client | undefined;
    private mqttServerAddress: String;
    private DoorOpenRequest = new Subject<mqttDoorOpenReq>();
    private localIpAddress = '';
    private deviceMgr: DeviceManager;
    private eventHandler: EventHandler;
    public ConnectParams: Params;
    constructor(connectParams: Params) {
        this.ConnectParams = connectParams;
        this.mqttServerAddress = connectParams.mqttConnectString;
        this.deviceMgr = new DeviceManager();
        this.eventHandler = new EventHandler();
    }

    public Connect(doorOpenRequest: Subject<mqttDoorOpenReq>): void {
        this.DoorOpenRequest = doorOpenRequest;
        console.log(`Connect to ${this.mqttServerAddress}`);
        this.mqttClient = mqtt.connect(this.ConnectParams.mqttConnectString);
        this.mqttClient.on('connect', () => {
            console.log(`Connected to ${this.mqttServerAddress}`);
            if (this.mqttClient) {
                let s: ServerStatus = { IpAddress: this.ConnectParams.localIpAddress, Status: 'Online' };
                this.mqttClient.publish('/server', JSON.stringify(s), { retain: true, qos: 0 });

                this.mqttClient.subscribe('/device/#');
            }
        });

        this.mqttClient.on('message', (topic: any, message: any) => {
            console.log(`Got mqtt topic: ${topic} message: ${message.toString()}`);
            const topicArr = topic.split('/');
            const name = topicArr[1];

            if (name === 'device' && topicArr.length >= 3) {
                const deviceId = topicArr[2];
                const eventStr = topicArr[3];
                this.handleDeviceMessage(eventStr, deviceId, message.toString());
            }
        });
    }

    public OpenDoor(request: mqttDoorOpenReq): boolean {
        console.log(JSON.stringify(request));
        if (!this.mqttClient) {
            return false;
        }
        this.mqttClient.publish('door', JSON.stringify(request));
        return true;
    }

    async handleDeviceMessage(eventStr: String, deviceId: String, message: String) {
        console.log(`handleDeviceMessage: deviceId: ${deviceId}, action: ${eventStr}, message: ${message}`);

        if (eventStr === 'register') {
            this.deviceMgr.registerDevice(deviceId, message);
            return;
        }

        const uid = deviceId;
        const rfid = message;

        const device = this.deviceMgr.getDevice(uid);
        if (device === undefined) {
            console.error(`Unable to find device with id: ${deviceId}`);
            return;
        }
        // Authenticate user
        if (!UserIsAuthorised(rfid)) {
            console.error(`User not authorised: ${rfid}`);
            return;
        }

        const event = new Event(eventStr, device.location);

        await this.eventHandler.executeAll(event, (action: Action) => {
            const devices = this.deviceMgr.getDevicesByTypeAndLocation(DeviceType.Lock, action.location);
            devices.forEach(device => {
                const mqttTopic = `/device/${device.uid}/unlock`;
                const mqttMessage = '3';
                console.log(mqttTopic, mqttMessage);
                if (this.mqttClient) {
                    this.mqttClient.publish(mqttTopic, mqttMessage);
                }
            });
        });
    }
}
