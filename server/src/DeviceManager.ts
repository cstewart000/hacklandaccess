import Device, { DeviceType } from './Device';

import deviceListJson from './device_list.json';

/**
 * Loads a list of device from `device_list.json` and manages them
 */
export default class DeviceManager {
    private devices: Device[];

    constructor() {
        this.devices = deviceListJson.map(d => new Device(d.type, d.uid, d.location, d.enabled));
    }

    getDevice(uid: String): Device | undefined {
        return this.devices.find(d => d.uid === uid && d.enabled);
    }

    getDevicesByTypeAndLocation(type: DeviceType, location: String): Device[] {
        return this.devices.filter(d => d.type === type && d.location === location && d.enabled);
    }

    registerDevice(uid: String, type: String) {
        if (this.getDevice(uid)) {
            console.log(`DeviceManager: Device already registered and enabled`);
            return;
        }
        if (this.devices.find(d => d.uid === uid) === undefined) {
            console.log(`DeviceManager: Registering new device: id:${uid} as ${type}`);
            this.devices.push(Device.createUnregisteredDevice(uid, type));
        } else {
            console.log(`DeviceManager: Device already registered, but not enabled: id:${uid} as ${type}`);
        }
    }
}
