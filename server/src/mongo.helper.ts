import * as mongodb from 'mongodb';

export class MongoHelper {
    public static client: mongodb.MongoClient;
    public static Connect(url: string) {
        return new Promise((resolve, reject) => {
            mongodb.MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err: any, client: mongodb.MongoClient) => {
                if (err) {
                    reject(err);
                } else {
                    MongoHelper.client = client;
                    resolve(client);
                }
            })
        });
    } 
}