import * as express from 'express';
import Device from '../models/Device';

export class DeviceController {
    public Routes = express.Router();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.Routes.get('/api/devices', (req: express.Request, resp: express.Response, next: express.NextFunction) => {
            Device.getAll()
                .then((devices: any) => {
                    resp.json(devices);
                })
                .catch((err: any) => {
                    console.error(`Caught error:${err}`);
                    resp.status(500);
                    resp.end();
                });
        });
    }
}

export default DeviceController;
