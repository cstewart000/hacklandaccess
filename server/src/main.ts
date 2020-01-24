import { UserController } from './controllers/user.controller';
import { DeviceController } from './controllers/device.controller';

import express from 'express';
import * as cors from 'cors';
import * as BodyParser from 'body-parser';
import { requestLoggerMiddleware } from './request.logger.middleware';
import { SlackController } from './controllers/slack.controller';
import PubSub from './pubsub';

const app = express();
//app.use(cors());
app.use(BodyParser.json());
app.use(requestLoggerMiddleware);
console.log('requestLoggerMiddleware');

const port = process.env.PORT || 8088;

console.log(__dirname);

const pubSub = new PubSub();
const userController = new UserController();
const doorController = new DeviceController();
const slackController = new SlackController();
app.use(userController.Routes);
app.use(doorController.Routes);
app.use(slackController.Routes);
app.listen(port, async () => {
    try {
        pubSub.Connect();
        await slackController.Connect();
    } catch (err) {
        console.error(err);
    }
});

// Update the users from slack on a regular basis
setInterval(() => slackController.updateActiveUsers(), 60 * 60 * 1000);
