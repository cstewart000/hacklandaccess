import mongoose from '../mongo';
import Action from './Action';

export enum DeviceType {
    Lock,
    CardReader
}

function deviceTypeFromString(str: string): DeviceType {
    switch (str) {
        case 'lock':
            return DeviceType.Lock;
        case 'rfid-reader':
            return DeviceType.CardReader;
        default:
            throw new Error(`Invalid DeviceType: ${str}`);
    }
}

function deviceTypeToString(type: DeviceType): string {
    switch (type) {
        case DeviceType.Lock:
            return 'lock';
        case DeviceType.CardReader:
            return 'rfid-reader';
        default:
            throw new Error(`Invalid DeviceType: ${type}`);
    }
}

export interface IDevice extends mongoose.Document {
    type: DeviceType; // What kind of device this is
    uid: string; // The UID (typically the mac address) of the device
    location: string; // The location of this device
    enabled: boolean; // If false, then this device will be ingored
}

export const deviceSchema = new mongoose.Schema({
    type: { type: String, required: true },
    uid: { type: String, required: true },
    location: { type: String, required: false },
    enabled: { type: Boolean, required: false }
});

export class DeviceModel extends mongoose.Model {
    public async setLocation(location: string): Promise<void> {
        this.location = location;
        await this.save();
    }

    //
    // Static functions that work on the whole User Data model - these could be moved to a UserManager class
    //

    public static createUnregisteredDevice(uid: string, type: string) {
        return this.create({ uid, type, enabled: false });
    }

    public static async findByUid(uid: string): Promise<DeviceModel> {
        return await this.findOne({ uid, enabled: true });
    }

    public static async getAllDevicesByTypeAndLocation(type: string, location: string): Promise<Array<DeviceModel>> {
        return await this.find({ type, location });
    }

    public static async getDevicesWithAction(action: Action): Promise<Array<DeviceModel>> {
        return await this.find({
            enabled: true,
            location: action.location,
            type: deviceTypeToString(action.appliesToDevice)
        });
    }

    public static async registerDevice(uid: string, type: string) {
        const device = await this.findOne({ uid });

        if (!device) {
            console.log(`DeviceManager: Registering new device: id:${uid} as ${type}`);
            await this.createUnregisteredDevice(uid, type);
            return;
        }

        if (device.enabled) {
            console.log(`DeviceManager: Device already registered and enabled`);
        } else {
            console.log(`DeviceManager: Device already registered, but not enabled: id:${uid} as ${type}`);
        }
    }
}

deviceSchema.loadClass(DeviceModel);
const Device = <any>mongoose.model<IDevice>('Device', deviceSchema);
export default Device;
