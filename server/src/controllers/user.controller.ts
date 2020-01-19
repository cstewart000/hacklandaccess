import * as express from 'express';
import { MongoHelper } from '../mongo.helper';


export class UserController {
    public Routes = express.Router();

    constructor () {
        this.initialiseRoutes();
    }

    private getCollection  = () => {
        return MongoHelper.client.db('AccessControl').collection('users');
    }
    
    private getTokenCollection  = () => {
        return MongoHelper.client.db('AccessControl').collection('tokens');
    }

    private initialiseRoutes (): void {
        this.Routes.get('/api/users', (req: express.Request, resp: express.Response, next: express.NextFunction) => {
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
        })
        
        this.Routes.get('/api/users/:userId', (req: express.Request, resp: express.Response, next: express.NextFunction) => {
            const collection = this.getCollection();
            var resullt = collection.findOne({"userId": req.params.userId }, (err, items) => {
                if (err) {
                    resp.status(500);
                    resp.end();
                    console.error(`Caught error:${err}`);
                } else {
                    resp.json(items);
                }
            });
        })
        
        this.Routes.post('/api/users', (req: express.Request, resp: express.Response, next: express.NextFunction) => {
            const collection = this.getCollection();
            collection.insertOne(req.body, (error, result) => {
                if (error) {
                    resp.status(500);
                    resp.end();
                }
                resp.send(result.result);
            });

        });

        this.Routes.post('/api/users/:userId/token', (req: express.Request, resp: express.Response, next: express.NextFunction) => {
            const collection = this.getTokenCollection();
            collection.insertOne(req.body, (error, result) => {
                if (error) {
                    resp.status(500);
                    resp.end();
                }
                resp.send(result.result);
            });

        });
    }
}
export default UserController;



