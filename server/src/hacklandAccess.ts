import { Subject } from "rxjs";
import { mqttDoorOpenReq, mqttDoorOpenCmd } from "./mqttMessage";
import { MongoHelper } from './mongo.helper';


export class HacklandAccess {
    public DoorOpenRequest = new Subject<mqttDoorOpenReq>();
    public DoorOpenCommand = new Subject<mqttDoorOpenCmd>();

    constructor () {
        this.initialise();
    }

    private initialise(): void {
        this.DoorOpenRequest.subscribe((d) => {
            console.dir(`door open req on ${d}`);
            const collection = MongoHelper.client.db('AccessControl').collection('tokens');
            var resullt = collection.findOne({"tokenId": d.RequestId }, (err, items) => {
                if (err) {
                    console.error(`Caught error:${err}`);
                } else {
                    // blah
                    let door:mqttDoorOpenCmd = {SoureceReader: d.SoureceReader, RequestId: d.RequestId};
                    this.DoorOpenCommand.next(door);
                }
            });

        })

    }

}

export default HacklandAccess