import { ActionExecuter } from './models/Action';
import Device from './models/Device';
import User from './models/User';
import DeviceEvent, { DeviceEventModel } from './models/DeviceEvent';

/**
 * Loads a list of device from `device_list.json` and manages them
 */
export default class HacklandEvents {
    constructor() {}

    private executeAllActions(event: DeviceEventModel, callback: ActionExecuter) {
        if (!event) return;
        event.getActions().forEach(async action => {
            const targetDevices = await Device.getDevicesWithAction(action);
            action.exec(targetDevices, callback);
        });
    }

    async triggerEventFromDevice(eventStr: string, deviceId: string, message: string, callback: ActionExecuter) {
        console.log(`triggerEventFromDevice: deviceId: ${deviceId}, action: ${eventStr}, message: ${message}`);

        // Register is a basic event where we just register a device
        if (eventStr === 'register') {
            const type = message;
            await Device.registerDevice(deviceId, type);
            return;
        }

        // Get here and we have an event that is more complex and needs user authentication

        const uid = deviceId;
        const rfidToken = message;

        // Validate the device is active
        const device = await Device.findByUid(uid);
        if (!device) {
            console.error(`triggerEventFromDevice: Unable to find device with id: ${deviceId}`);
            return;
        }

        // Authenticate user
        const user = await User.findByRfidToken(rfidToken);
        if (!user) {
            console.error(`triggerEventFromDevice: No user found with rfidToken=${rfidToken}`);
            return;
        }
        if (!user.isAuthenticated()) {
            console.error(`triggerEventFromDevice: User not authorised: rfidToken=${rfidToken}`);
            return;
        }

        // The validated event that occurred
        const event = await DeviceEvent.get(eventStr, device.location);

        this.executeAllActions(event, callback);
    }
}
