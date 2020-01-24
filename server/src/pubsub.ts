import mqtt from 'mqtt';

import Config from './configuration';
import Action from './models/Action';
import HacklandEvents from './HacklandEvents';
import { DeviceModel } from './models/Device';
import { ServerStatus } from './mqttMessage';

export default class PubSub {
    private mqttClient: mqtt.Client | undefined;
    private hacklandEvent: HacklandEvents;

    constructor(hacklandEvent: HacklandEvents) {
        this.hacklandEvent = hacklandEvent;
    }

    public async connect(): Promise<mqtt.Client> {
        console.log(`Connect to ${Config.mqttConnectString}`);
        const mqttClient = mqtt.connect(Config.mqttConnectString);

        mqttClient.on('connect', () => {
            console.log(`Mqtt Connected`);
            if (mqttClient) {
                let s: ServerStatus = { IpAddress: Config.localIpAddress, Status: 'Online' };
                mqttClient.publish('/server', JSON.stringify(s), { retain: true, qos: 0 });
                mqttClient.subscribe('/device/#');
            }
        });

        mqttClient.on('message', (topic: any, message: any) => {
            console.log(`Got mqtt topic: ${topic} message: ${message.toString()}`);
            const topicArr = topic.split('/');
            const name = topicArr[1];

            if (name === 'device' && topicArr.length >= 3) {
                const deviceId = topicArr[2];
                const eventStr = topicArr[3];
                this.hacklandEvent.triggerEventFromDevice(
                    eventStr,
                    deviceId,
                    message.toString(),
                    async (action: Action, device: DeviceModel) => {
                        const mqttTopic = `/device/${device.uid}/${action.actionType}`;
                        const mqttMessage = action.actionMessage.toString();
                        console.log(mqttTopic, mqttMessage);
                        if (mqttClient) {
                            mqttClient.publish(mqttTopic, mqttMessage);
                        }
                    }
                );
            }
        });

        return mqttClient;
    }
}
