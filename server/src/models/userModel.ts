import { ObjectID } from "mongodb";

export class User {
    _id: ObjectID | undefined;
    name: String | undefined;
    userId: String | undefined;
    admin: boolean | undefined;
    email: String | undefined;
    enabled: boolean | undefined;
}