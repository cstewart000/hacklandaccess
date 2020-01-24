import Action from './Action';
import Device, { DeviceType } from './models/Device';
import User from './models/User';

import eventActionMapJson from './event_action_map.json';

export class Event {
    private type: String;
    private location: String;

    constructor(type: String, location: String) {
        this.type = type;
        this.location = location;
    }

    equals(that: Event): Boolean {
        return this.type === that.type && this.location === that.location;
    }
}

/**
 * Loads a list of device from `device_list.json` and manages them
 */
export class EventActionMap {
    private event: Event;
    private doActions: Action[];

    constructor(event: Event, doActions: any[]) {
        this.event = event;
        this.doActions = doActions.map(a => new Action(a.type, a.location));
    }

    async execActions(thatEvent: Event, execFn: (a: Action) => void): Promise<void> {
        console.log(this.event, thatEvent);
        if (this.event.equals(thatEvent)) {
            await this.doActions.forEach(async action => await execFn(action));
        }
    }
}

/**
 * Loads a list of device from `device_list.json` and manages them
 */
export class EventHandler {
    private events: EventActionMap[];

    constructor() {
        console.log(eventActionMapJson);
        this.events = eventActionMapJson.map(
            (ev: any) => new EventActionMap(new Event(ev.event, ev.location), ev.doActions)
        );
    }

    async executeAll(event: Event, execFn: (a: Action) => void): Promise<void> {
        await this.events.forEach(async e => e.execActions(event, execFn));
    }

    async triggerEventFromDevice(eventStr: String, deviceId: String, message: String): Promise<void> {
        console.log(`triggerEventFromDevice: deviceId: ${deviceId}, action: ${eventStr}, message: ${message}`);

        if (eventStr === 'register') {
            const uid = deviceId;
            const type = message;
            await Device.registerDevice(uid, type);
            return;
        }

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
        if (!user || !user.isAuthenticated()) {
            console.error(`triggerEventFromDevice: User not authorised: rfidToken=${rfidToken}`);
            return;
        }

        const event = new Event(eventStr, device.location);

        this.executeAll(event, async (action: Action) => {
            const devices = await Device.getDevicesByTypeAndLocation(DeviceType.Lock, action.location);
            devices.forEach((device: any) => {
                const mqttTopic = `/device/${device.uid}/unlock`;
                const mqttMessage = '3';
                console.log(mqttTopic, mqttMessage);
                // if (this.mqttClient) {
                //     this.mqttClient.publish(mqttTopic, mqttMessage);
                // }
            });
        });
    }
}
