import mqtt from 'mqtt'
import {Subject} from 'rxjs'
import {mqttDoorOpenReq, ServerStatus} from './mqttMessage'
import {Params} from './configuration'

class PubSub {
    private mqttClinet: mqtt.Client | undefined;
    private mqttServerAddress: String;
    private DoorOpenRequest = new Subject<mqttDoorOpenReq>(); 
    private localIpAddress = '';
    public ConnectParams: Params;
    constructor(connectParams: Params) {
        this.ConnectParams = connectParams;
        this.mqttServerAddress =  connectParams.mqttConnectString;

    }

    public Connect (doorOpenRequest: Subject<mqttDoorOpenReq>): void {
        
        this.DoorOpenRequest = doorOpenRequest;
        console.log(`Connect to ${this.mqttServerAddress}`);
        this.mqttClinet = mqtt.connect(this.ConnectParams.mqttConnectString);
        this.mqttClinet.on('connect', () => {
            console.log(`Connected to ${this.mqttServerAddress}`);
            if (this.mqttClinet) {
                let s: ServerStatus = {IpAddress: this.ConnectParams.localIpAddress, Status: 'Online'};    
                this.mqttClinet.publish('server', JSON.stringify(s), {retain: true, qos: 0});
                
                this.mqttClinet.subscribe('door');
            }
        });

        this.mqttClinet.on('message', (topic: any, message: any) => {
            console.log(`Got mqtt topc:${topic} message:${message}`);
            if (topic === 'door') {
                this.DoorOpenRequest.next(JSON.parse(message));
            }
        })
    }

    public OpenDoor(request: mqttDoorOpenReq): boolean {
        if (!this.mqttClinet) {
            return false;
        }
        this.mqttClinet.publish('door', JSON.stringify(request));
        return true;
    }

    
}

export default PubSub;