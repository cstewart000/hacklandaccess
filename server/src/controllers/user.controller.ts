import * as express from 'express';
import User from '../models/User';

export class UserController {
    public Routes = express.Router();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.Routes.get('/api/users', (req: express.Request, resp: express.Response, next: express.NextFunction) => {
            User.getAll()
                .then((users: any) => {
                    resp.json(users);
                })
                .catch((err: any) => {
                    console.error(`Caught error:${err}`);
                    resp.status(500);
                    resp.end();
                });
        });

        this.Routes.get(
            '/api/users/:userId',
            (req: express.Request, resp: express.Response, next: express.NextFunction) => {
                User.findByUserId(req.params.userId)
                    .then((user: any) => {
                        resp.json(user);
                    })
                    .catch((err: any) => {
                        console.error(`Caught error:${err}`);
                        resp.status(500);
                        resp.end();
                    });
            }
        );

        this.Routes.post('/api/users', (req: express.Request, resp: express.Response, next: express.NextFunction) => {
            User.create(req.body)
                .then((user: any) => {
                    resp.json(user);
                })
                .catch((err: any) => {
                    console.error(`Caught error:${err}`);
                    resp.status(500);
                    resp.end();
                });
        });
    }
}
export default UserController;
