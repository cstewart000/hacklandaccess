import * as slack from '@slack/web-api';
import { Router, Request, Response, NextFunction } from 'express';
require('dotenv').config();
import Config from '../configuration';
import User from '../models/User';

const SUPPORTERS_CHANNEL_ID = 'GH6D0N8KD'; // FIXME: Want this in configuration or in the database.

export class SlackController {
    public Routes = Router();
    public webSlack: slack.WebClient;
    private slackToken: string;

    constructor() {
        this.slackToken = Config.slackToken;
        this.webSlack = new slack.WebClient(this.slackToken);
        this.initialise();
    }

    public async Connect() {
        var res = await this.webSlack.auth.test({ token: this.slackToken });
        console.log(`slack result ${JSON.stringify(res, null, 4)}`);
    }

    public async getSlackChannels(): Promise<Array<any>> {
        const chans: any = await this.webSlack.conversations.list({ types: 'private_channel' });
        console.dir(JSON.stringify(chans.channels, null, 4));
        return chans.channels;
    }

    public async updateActiveUsers() {
        const result: any = await this.webSlack.conversations.members({ channel: SUPPORTERS_CHANNEL_ID });

        User.setActiveChannelMembers('supporters', result.members);
    }

    private async initialise(): Promise<void> {
        this.updateActiveUsers();

        this.Routes.get('/api/slack/users', async (req: Request, resp: Response, next: NextFunction) => {
            console.log('here');
            const allMembers: any = {};
            const chan: any = await this.webSlack.conversations.members({ channel: SUPPORTERS_CHANNEL_ID });
            const users: any = await this.webSlack.users.list();

            users.members.forEach((u: any) => {
                allMembers[u.id] = {
                    id: u.id,
                    name: u.name,
                    real_name: u.real_name
                };
            });

            const actualMembers = chan.members.map((memberId: any) => allMembers[memberId]);
            console.log(actualMembers);
            resp.json(actualMembers);
            resp.status(200);
            resp.end();
        });
    }
}

export default SlackController;
