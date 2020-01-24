import { DeviceType, DeviceModel } from './Device';

function resolvesTo(actionType: String): DeviceType {
    switch (actionType) {
        case 'unlock':
            return DeviceType.Lock;
        default:
            throw new Error('resolvesTo: ERROR: Unknown action type: ' + actionType);
    }
}

export type ActionExecuter = (action: Action, device: DeviceModel) => Promise<void>;

/**
 * An action occurs on a device
 */
export default class Action {
    readonly actionType: String; // The type of action to perform when the action occurs. e.g. 'unlock'
    readonly actionMessage: String; // The parameters of the action
    readonly location: String; // The location where the action occurs.
    readonly appliesToDevice: DeviceType; // The type of device this action applis to.

    constructor(actionType: String, location: String) {
        this.actionType = actionType;
        this.actionMessage = actionType === 'unlock' ? '3' : ''; // For a lock, unlock for 3 seconds
        this.location = location;
        this.appliesToDevice = resolvesTo(actionType);
    }

    /**
     * Compare this Action against the other action. If they are the same, return true.
     */
    equals(that: Action): boolean {
        return this.actionType === that.actionType && this.location === that.location;
    }

    exec(devices: Array<DeviceModel>, callback: ActionExecuter) {
        devices.forEach(device => callback(this, device));
    }

    toObj(): any {
        return {
            actionType: this.actionType,
            location: this.location
        };
    }

    static fromObj(obj: any) {
        return new Action(obj.actionType, obj.location);
    }
}
