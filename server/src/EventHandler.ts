import Action from './Action';

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
        this.events = eventActionMapJson.map(ev => new EventActionMap(new Event(ev.event, ev.location), ev.doActions));
    }

    async executeAll(event: Event, execFn: (a: Action) => void): Promise<void> {
        await this.events.forEach(async e => e.execActions(event, execFn));
    }
}
