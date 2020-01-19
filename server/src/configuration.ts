import * as fs from 'fs';
import * as path from 'path';

export class Params {
    localIpAddress: Array<string> = [];
    mongoConnectString: string = 'mongodb://127.0.0.1:27017';
    mqttConnectString: string = '';
    constructor(){
        this.localIpAddress = new Array<string>();
    }
}

export class Configuration {
    public Params: Params = new Params();
    constructor () {
        const configFile = path.join(__dirname, '/accessControl.json');
        console.log(configFile);
        const config = fs.readFileSync(configFile);
        this.Params = JSON.parse(config.toString());
        this.Params.localIpAddress = new Array<string>();
        this.getLocalIp();
    }

    private getLocalIp () : void {

        var os = require('os');
        var ifaces = os.networkInterfaces();

        Object.keys(ifaces).forEach((ifname) => {
            var alias = 0;

            ifaces[ifname].forEach((iface: any) => {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }

                if (alias >= 1) {
                    // this single interface has multiple ipv4 addresses
                    console.log(ifname + ':' + alias, iface.address);
                    this.Params.localIpAddress.push(iface.address);
                } else {
                    // this interface has only one ipv4 adress
                    console.log(ifname, iface.address);
                    this.Params.localIpAddress.push(iface.address);
                }
                ++alias;
            });
        
        })
    }
}