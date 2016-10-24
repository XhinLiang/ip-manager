import * as commander from 'commander';
import * as colors from 'colors';
import * as fs from 'fs';
import * as os from 'os';
import * as Readline from 'readline';
import * as Q from 'q';
import {Host, Ip, addHost, getHosts, find} from './hosts';

const FLAG = '#ip-manager';
const FLAG_END = '#ip-manager-end';
const FLAG_START = '#ip-manager-start';
const LINE_SEPERATOR = isPosix() ? '\n' : '\r\n';

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

export function init(): Q.IPromise<boolean> {
    let promise: Q.IPromise<boolean> = Q.Promise<boolean>((resolve: Function, reject: Function) => {
        fs.readFile(getHostsFilePath(), 'utf8', function(err: Error, data: string) {
            if (err) {
                return console.log(err);
            }
            let startIndex = data.indexOf(FLAG_START);
            let endIndex = data.indexOf(FLAG_END);
            if (startIndex > -1 && endIndex > -1) {
                resolve(true);
                return;
            }
            let content = data + getNewContent();
            fs.writeFile(getHostsFilePath(), content, 'utf8', function(err) {
                if (err) {
                    reject();
                    return console.log(err);
                }
                resolve(false);
            });
            return;
        });
    });
    return promise;
}

export function flush(): void {
    fs.readFile(getHostsFilePath(), 'utf8', function(err: Error, data: string) {
        if (err) {
            return console.log(err);
        }
        let startIndex = data.indexOf(FLAG_START);
        let endIndex = data.indexOf(FLAG_END);
        let content = data.slice(0, startIndex - 1) + data.slice(endIndex + FLAG_END.length, data.length - 1) + getNewContent();
        fs.writeFile(getHostsFilePath(), content, 'utf8', function(err) {
            if (err) {
                return console.log(err);
            }
        });
        return;
    });
}

function getNewContent(): string {
    let hostslist = getHosts();
    let content: string = LINE_SEPERATOR + FLAG_START;
    for (let i = 0; i < hostslist.length; ++i) {
        let host = hostslist[i];
        for (let j = 0; j < host.ips.length; ++j) {
            let ip: Ip = host.ips[j];
            if (ip.active) {
                content += `${LINE_SEPERATOR}{ip.ip} ${host.domain} ${FLAG}`;
                continue;
            }
            content += `${LINE_SEPERATOR}#${ip.ip} ${host.domain} ${FLAG}`;
        }
    }
    return content + LINE_SEPERATOR + FLAG_END;
}

export function readHostFile(): Q.IPromise<String> {
    let promise: Q.IPromise<String> = Q.Promise<String>((resolve: Function, reject: Function) => {
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
        rl.on('close', resolve);
        rl.on('error', reject);
    });
    return promise;
}
