import  * as slack from '@slack/web-api';
import { Router, Request, Response, NextFunction} from 'express';
import { threadId } from 'worker_threads';
require('dotenv').config();
import * as env from 'dotenv'
import { MongoHelper } from '../mongo.helper';
import { ChannelModel } from '../models/channelModel';

//const tok = "xoxp-191779080454-537096133174-913977760439-b316bb36862577abc4be2ca05ffb886d";
const tok = "xoxp-191779080454-537096133174-913977760439-b316bb36862577abc4be2ca05ffb886d";
export class SlackController {
    public Routes = Router();
    public  webSlack = new slack.WebClient(tok);
    
    constructor () {
        this.initialiseRoutes();
    }

    private getUserCollection  = () => {
        return MongoHelper.client.db('AccessControl').collection('users');
    }

    private getChannelCollection  = () => {
        return MongoHelper.client.db('AccessControl').collection('channels');
    }


    public async Connect ()  {
        var res = await this.webSlack.auth.test({token: tok });
        console.log(`slack result ${JSON.stringify(res, null, 4)}`);
    }

    private initialiseRoutes (): void {
        this.Routes.patch('/api/slack/channels', async (req: Request, resp: Response, next: NextFunction) => {
            const collection = this.getChannelCollection();
            const chans:any = await this.webSlack.conversations.list({types: "private_channel"});
            chans.channels.forEach((ch:any) => {
                let newChannel: ChannelModel = {slackId: ch.id, name: ch.name};
                collection.insertOne(newChannel, (error, result) => {
                    if (error) {
                        console.dir(error);
                    } else {
                        console.dir(`Added ${newChannel.name} : ${newChannel.slackId}`);
                    }
                });
            });
            resp.status(200);
            resp.end();
        });

        this.Routes.patch('/api/slack/users', async (req: Request, resp: Response, next: NextFunction) => {
            const collection = this.getUserCollection();
            const users:any = await this.webSlack.users.list();
            users.members.forEach((u:any) => {
                // let newChannel: ChannelModel = {slackId: ch.id, name: ch.name};
                // collection.insertOne(newChannel, (error, result) => {
                //     if (error) {
                //         console.dir(error);
                //     } else {
                //         console.dir(`Added ${newChannel.name} : ${newChannel.slackId}`);
                //     }
                //});
                console.dir(JSON.stringify(u, null, 4));
            });
            resp.status(200);
            resp.end();
        });
    }
}

export default SlackController