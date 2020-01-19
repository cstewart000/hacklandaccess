import  * as slack from '@slack/web-api';
import { threadId } from 'worker_threads';


const tok = "xoxp-191779080454-537096133174-913977760439-b316bb36862577abc4be2ca05ffb886d";
export class slackQuery {
    public static webSlack = new slack.WebClient();
    public static async connect ()  {
        var res = await this.webSlack.auth.test({token: tok });
        console.log(`slack result ${JSON.stringify(res)}`);
        var chans = await this.webSlack.channels.list();
        console.log(`slack result ${JSON.stringify(chans)}`);
    };
}