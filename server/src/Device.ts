export enum DeviceType {
    Lock,
    CardReader
}

function deviceTypeFromString(str: String): DeviceType {
    switch (str) {
        case 'lock':
            return DeviceType.Lock;
        case 'rfid-reader':
            return DeviceType.CardReader;
        default:
            throw new Error(`Invalid DeviceType: ${str}`);
    }
}

interface IDevice {
    type: DeviceType; // What kind of device this is
    uid: String; // The UID (typically the mac address) of the device
    location: String; // The location of this device
    enabled: Boolean; // If false, then this device will be ingored
}

export default class Device implements IDevice {
    type: DeviceType;
    uid: String;
    location: String;
    enabled: Boolean;

    constructor(typeStr: String, uid: String, loc: String | undefined, enabled: Boolean) {
        this.type = deviceTypeFromString(typeStr);
        this.uid = uid;
        this.location = loc || '';
        this.enabled = enabled;
    }

    static createUnregisteredDevice(typeStr: String, uid: String) {
        return new this(typeStr, uid, undefined, false);
    }
}
