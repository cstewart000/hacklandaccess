// const MongoClient =  require("mongodb");
import {MongoClient, ObjectID} from 'mongodb'
import { Router } from 'express';

export class User {
    _id: ObjectID | undefined;
    name: String | undefined;
    userId: String | undefined;
    admin: boolean | undefined;
    email: String | undefined;
    enabled: boolean | undefined;
}
export enum SearchResult {
    srNotFound
}

export class DataStore {
    mongoClient: MongoClient | undefined;
    database: any;
    collection: any; 
    constructor() {

    } 

    public mountRoutes (router: Router): void {
        router.get('/api/users', async (req, res) => this.GetUsers (req, res))
    }

    public Start (): void {
        MongoClient.connect('mongodb://172.17.0.3:27017', {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
            if(error) {
                throw error;
            }
            this.mongoClient = client;
            this.database = this.mongoClient.db('AccessControl');
            this.collection = this.database.collection('users');
            console.log('connected to db');
        });
    }

    public IsUserValid (useId: String): void {
        
    }

    public async GetUserByAccessId (useId: String): Promise<Response> {
        let u: User = new User();
        console.log('connected to db');
        var resullt = await this.database.collection('users').findOne({"userId": useId });
        return resullt;
    }
        
    public GetUsers (request: any, result: any): void {
        console.log('GetUsers');
     //   var resullt = await this.database.collection('users').find({});
        this.database.collection('users').find({}).toArray((e:any, res: any) => {
            console.log(`GetUsers ${res}`);
            return result.send(res);

        });

    }
        
    

    public GetUserByEmail (useId: String): User {
        let u: User = new User();
        this.database.collection('users').findOne({"userId": useId } , (error: any, result: any) => {
            if (error) {
                return null;
            }
            if (result.enabled) {
                
                console.log('listening 3333');        
            }
            return result;
        })
        return u;
    }
}