import * as commander from 'commander';
import * as colors from 'colors';
import * as fs from 'fs';
import * as os from 'os';
import * as Tools from './tools';

import {Host, disableHost, enableHost, Ip, addHost, getHosts, find} from './hosts';
const conf = require('../package.json');

function add(params: string[]): void {
    if (params.length != 2) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    let domain: string = params[0];
    let ip: string = params[1];
    addHost(domain, ip, true);
    Tools.flush();
}

function enable(params: string[]): void {
    if (params.length != 2) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    let domain: string = params[0];
    let ip: string = params[1];
    let t = enableHost(domain, ip);
    Tools.flush();
}

function disable(params: string[]): void {
    if (params.length != 1) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    let domain: string = params[0];
    let t = disableHost(domain);
    Tools.flush();
}

function status(params: string[]): void {
    if (params.length != 1) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    let targetDomain = params[0];
    let hostsArray: Host[] = find(targetDomain);
    if (hostsArray.length == 0) {
        console.log('not found.');
    }
    for (let i = 0; i < hostsArray.length; ++i) {
        let host = hostsArray[i];
        process.stdout.write(`${host.domain}: `);
        for (let i = 0; i < host.ips.length; ++i) {
            let ip: Ip = host.ips[i];
            if (ip.active) {
                process.stdout.write(` ${colors.yellow(ip.ip + '(o)')} `);
                continue;
            }
            process.stdout.write(` ${ip.ip} `);
        }
        console.log();
    }
}

function list(params: string[]): void {
    if (params.length != 0) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    let hostslist: Host[] = getHosts();
    let ho: Host = hostslist[0];

    hostslist.forEach(function(item: Host) {
        process.stdout.write(`${item.domain}: `);
        for (let i = 0; i < item.ips.length; ++i) {
            let ip: Ip = item.ips[i];
            if (ip.active) {
                process.stdout.write(` ${colors.yellow(ip.ip + '(o)')} `);
                continue;
            }
            process.stdout.write(` ${ip.ip} `);
        }
        console.log();
    });
}

// 读取 hosts 完毕之后在开始启动主界面
Tools.readHostFile(() => start());

function start() {
    commander
        .version(conf.version)
        .option('-a --add <domain> <ip>', 'add a host', add)
        .option('-e --enable <domain> <ip>', 'enable an ip for a domain', enable)
        .option('-e --disable <domain>', 'disable all hosts of a domain', disable)
        .option('-l --list <param>', 'list all hosts', list)
        .option('-s --status <param>', 'check the status of a domain', status)
        .parse(process.argv);
    if (!process.argv.slice(2).length) {
        commander.outputHelp();
    }
}
