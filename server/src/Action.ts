export default class Action {
    readonly type: String; // The type of action to perform when the action occurs.
    readonly location: String; // The location where the action occurs.

    constructor(type: String, location: String) {
        this.type = type;
        this.location = location;
    }

    /**
     * Compare this Action against the other action. If they are the same, return true.
     */
    equals(that: Action): boolean {
        return this.type === that.type && this.location === that.location;
    }
}
