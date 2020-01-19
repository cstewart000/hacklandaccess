import * as express from 'express';
import { MongoHelper } from '../mongo.helper';


export class DoorController {
    public Routes = express.Router();

    private getCollection  = () => {
        return MongoHelper.client.db('AccessControl').collection('users');
    }
    
    private initialiseRoutes (): void { 
        this.Routes.get('/api/doors', (req: express.Request, resp: express.Response, next: express.NextFunction) => {
            const collection = this.getCollection();
            collection.find({}).toArray((err, items) => {
                if (err) {
                    resp.status(500);
                    resp.end();
                    console.error(`Caught error:${err}`);
                } else {
                    resp.json(items);
                }
        
            });
        });
    }
} 


export default DoorController