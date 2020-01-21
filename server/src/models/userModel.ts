import { ObjectID } from "mongodb";

export class User {
  
    name: String | undefined;
    userId: String | undefined;
    admin: boolean | undefined;
    email: String | undefined;
    enabled: boolean | undefined;
}