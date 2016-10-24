import * as commander from 'commander';
import * as colors from 'colors';
import * as fs from 'fs';
import * as os from 'os';
import * as Readline from 'readline';
import {Host, Ip, addHost, getHosts, find} from './hosts';

export function isPosix(): boolean {
    let platform: string = os.platform();
    if (platform == 'win32') {
        return false;
    }
    return true;
}

export function getHostsFilePath(): string {
    if (isPosix()) {
        return '/etc/hosts';
    }
    return 'C:/Windows/System32/drivers/etc/hosts';
}

export function validateIp(str: string) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(str)) {
        return true;
    }
    return false;
}

export function flush(): void {
    fs.readFile(getHostsFilePath(), 'utf8', function(err: Error, data: string) {
        if (err) {
            return console.log(err);
        }
        let startIndex = data.indexOf('#ip-manager-start');
        const tt = '#ip-manager-end';
        let endIndex = data.indexOf(tt);
        fs.writeFile(getHostsFilePath(), data.slice(0, startIndex - 1) + data.slice(endIndex + tt.length, data.length - 1) + getNewContent(), 'utf8', function(err) {
            if (err) {
                return console.log(err);
            }
        });
        return;
    });
}

function getNewContent(): string {
    let hostslist = getHosts();
    let content: string = '\n#ip-manager-start';
    for (let i = 0; i < hostslist.length; ++i) {
        let host = hostslist[i];
        for (let j = 0; j < host.ips.length; ++j) {
            let ip: Ip = host.ips[j];
            if (ip.active) {
                content += `\n${ip.ip} ${host.domain} #ip-manager`;
                continue;
            }
            content += `\n#${ip.ip} ${host.domain} #ip-manager`;
        }
    }
    return content + '\n#ip-manager-end';
}

export function readHostFile(callback: Function): void {
    let rl = Readline.createInterface({
        input: fs.createReadStream(getHostsFilePath(), { flags: 'r+' })
    });
    rl.on('line', function(line: string): void {
        let active = true;
        if (line.charAt(0) == '#') {
            line = line.substr(1, line.length - 1).trim();
            active = false;
        }
        let splitArray = line.split(' ');
        let flag = splitArray.pop();
        if (flag.indexOf('#ip-manager') < 0) {
            return;
        }
        let domain = splitArray.pop();
        let ip = splitArray[0];
        if (!validateIp(ip)) {
            return;
        }
        addHost(domain, ip, active);
    });
    rl.on('close', function(): void {
        callback();
    });
}
