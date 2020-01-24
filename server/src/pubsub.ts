import mqtt from 'mqtt';
import { EventHandler, Event } from './EventHandler';
import Config from './configuration';
import { ServerStatus } from './mqttMessage';

export default class PubSub {
    private mqttClient: mqtt.Client | undefined;
    private eventHandler: EventHandler;
    constructor() {
        this.eventHandler = new EventHandler();
    }

    public Connect(): void {
        console.log(`Connect to ${Config.mqttConnectString}`);
        this.mqttClient = mqtt.connect(Config.mqttConnectString);
        this.mqttClient.on('connect', () => {
            console.log(`Connected to ${Config.mqttConnectString}`);
            if (this.mqttClient) {
                let s: ServerStatus = { IpAddress: Config.localIpAddress, Status: 'Online' };
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
                this.eventHandler.triggerEventFromDevice(eventStr, deviceId, message.toString());
            }
        });
    }
}
