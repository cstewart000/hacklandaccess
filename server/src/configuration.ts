/**
 * This file will load the configuration from disk.  It will load the "../../configuration.json" file.  It will statically load this,
 * you do NOT instantiate the configuration.  You just need to use:
 * 
 * ```TypeScript
 * import Config from './configuration';
 * console.log(Config.slackToken); // Prints the slack token
 * ```
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

class Configuration {
    readonly localIpAddress: Array<String>;
    readonly mongoConnectString: String;
    readonly mqttConnectString: String;
    readonly mongoApplicationString: String;
    readonly slackToken: string;

    constructor() {
        const configFile = path.join(__dirname, '..', '..', 'configuration.json');
        console.log(configFile);
        const config = JSON.parse(fs.readFileSync(configFile).toString());

        this.localIpAddress = config.localIpAddress;
        this.mongoConnectString = config.mongoConnectString;
        this.mqttConnectString = config.mqttConnectString;
        this.mongoApplicationString = config.mongoApplicationString;
        this.slackToken = config.slackToken;
        this.localIpAddress = this.getLocalIp();
    }

    private getLocalIp(): Array<String> {
        const ifaces = os.networkInterfaces();
        const result: Array<String> = [];

        Object.keys(ifaces).forEach(ifname => {
            let alias = 0;

            ifaces[ifname].forEach((iface: any) => {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }

                if (alias >= 1) {
                    // this single interface has multiple ipv4 addresses
                    console.log(ifname + ':' + alias, iface.address);
                    result.push(iface.address);
                } else {
                    // this interface has only one ipv4 adress
                    console.log(ifname, iface.address);
                    result.push(iface.address);
                }
                ++alias;
            });
        });

        return result;
    }
}

const Config = (function() {
    console.log('Loading config');
    return new Configuration();
})();

Object.freeze(Config);

export default Config;
