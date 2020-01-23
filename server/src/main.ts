import { MongoHelper } from './mongo.helper'
import { async } from 'rxjs/internal/scheduler/async';

import { UserController } from './controllers/user.controller';
import { DoorController } from './controllers/door.controller';

import express from 'express';
import * as cors from 'cors';
import * as BodyParser from 'body-parser'
import { requestLoggerMiddleware } from './request.logger.middleware'
import { SlackController  } from './controllers/slack.controller'
import * as fs from 'fs'
import {Configuration} from './configuration'
import PubSub from './pubsub';
import { HacklandAccess } from './hacklandAccess';

const app = express();
//app.use(cors());
app.use(BodyParser.json());
app.use(requestLoggerMiddleware);
console.log('requestLoggerMiddleware');

const port = process.env.PORT || 8088;

console.log(__dirname);

const config = new Configuration();
const accessControl = new HacklandAccess();
const pubSub = new PubSub(config.Params);
const userController = new UserController();
const doorController = new DoorController();
const slackController = new SlackController();
app.use(userController.Routes);
app.use(doorController.Routes);
app.use(slackController.Routes);
app.listen(port, async () => {
    try {
       await MongoHelper.Connect(config.Params.mongoConnectString);
       console.log('connected to mongodb');

       pubSub.Connect(accessControl.DoorOpenRequest);
       await slackController.Connect();
    } catch (err) {
        console.error(err)
    }
})
