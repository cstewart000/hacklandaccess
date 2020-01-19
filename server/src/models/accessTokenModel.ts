import { ObjectID } from "mongodb";

export class AccessToken {
    _id: ObjectID | undefined;
    token: String | undefined;
    userId: ObjectID | undefined;
}