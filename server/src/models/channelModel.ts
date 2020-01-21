import { ObjectID } from "mongodb";

export class ChannelModel {
    public _id?: ObjectID | undefined;
    public slackId: string | undefined;
    public name: string | undefined;
}