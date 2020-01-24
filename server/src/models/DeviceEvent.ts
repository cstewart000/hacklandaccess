/**
 * Events can be triggered by devices or the system.  When an event is triggered, there may Actions which occur
 * based on the event.
 *
 * For example it can be read like "On DeviceEvent.type do all the actions in DeviceEvent.actions".
 */

import mongoose from '../mongo';
import Action from './Action';

export interface IDeviceEvent extends mongoose.Document {
    type: string; // The type of event.  E.g. 'card'
    location: string; // The location of the event e.g. 'hl_door'
    actions: Action[]; // The list of actions triggered by this event
}

export const deviceEventSchema = new mongoose.Schema({
    type: { type: String, required: true },
    location: { type: String, required: false },
    actions: { type: [], required: false }
});

// This is executed when we pull a document out of the DB.  We need to modify the "actions"
// array to make it a list of `new Action()` objects.
deviceEventSchema.post('findOne', function(result: any) {
    result.actions = result.actions.map(Action.fromObj);
});

export class DeviceEventModel extends mongoose.Model {
    equals(that: DeviceEventModel): boolean {
        return this.type === that.type && this.location === that.location;
    }

    public getActions(): Array<Action> {
        return this.actions;
    }

    //
    // Static functions that work on the whole User Data model
    //

    public static async get(type: string, location: string): Promise<DeviceEventModel> {
        return await this.findOne({ type, location });
    }
}

deviceEventSchema.loadClass(DeviceEventModel);
const DeviceEvent = <any>mongoose.model<IDeviceEvent>('DeviceEvent', deviceEventSchema);
export default DeviceEvent;
