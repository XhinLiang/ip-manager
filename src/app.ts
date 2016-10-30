import * as commander from 'commander';
import * as colors from 'colors';
import * as fs from 'fs';
import * as Tools from './file';

import {Host, disableHost, enableHost, Ip, addHost, getHosts, find} from './hosts';
const conf = require('../package.json');

function add(): void {
    let args = process.argv;
    if (args.length != 5) {
        console.log('\nYour command params is no suit for action-add'.red);
        return commander.outputHelp();
    }
    let ip: string = args.pop();
    let domain: string = args.pop();
    addHost(domain, ip, true);
    Tools.flush();
}

function enable(): void {
    let args = process.argv;
    if (args.length != 5) {
        console.log('\nYour command params is no suit for action-enable'.red);
        return commander.outputHelp();
    }
    let ip: string = args.pop();
    let domain: string = args.pop();
    let result: boolean = enableHost(domain, ip);
    Tools.flush();
}

function disable(params: string[]): void {
    let args = process.argv;
    if (args.length != 4) {
        console.log('\nYour command params is no suit for action-disable'.red);
        return commander.outputHelp();
    }
    let domain: string = args.pop();
    let result: boolean = disableHost(domain);
    Tools.flush();
}

function status(): void {
    let args = process.argv;
    if (args.length != 4) {
        console.log('\nYour command params is no suit for action-status'.red);
        return commander.outputHelp();
    }
    let targetDomain = args.pop();
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

function init(): void {
    let args = process.argv;
    if (args.length != 3) {
        console.log('\nYour command params is no suit for action-init'.red);
        return commander.outputHelp();
    }
    Tools
        .init()
        .then(function(hasInit) {
            if (!hasInit) {
                console.log(colors.green('hosts file init success!'))
                return;
            }
            console.log(colors.green('hosts file already has been inited!'))
        })
        .catch(err => console.log(colors.red(err.toString()) + ' ,hosts file init error'));
}

function list(): void {
    let args = process.argv;
    if (args.length != 3) {
        console.log('\nYour command params is no suit for action-list'.red);
        return commander.outputHelp();
    }
    let hostslist: Host[] = getHosts();
    if (hostslist.length == 0) {
        console.log(colors.yellow('ip-manager hold no hosts yet'));
    }
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
Tools.readHostFile()
    .then(() => start())
    .catch(err => console.log(err));

function start() {
    commander
        .version(conf.version)
        .option('add <domain> <ip>', 'add a host', add)
        .option('enable <domain> <ip>', 'enable an ip for a domain', enable)
        .option('disable <domain>', 'disable all hosts of a domain', disable)
        .option('list', 'list all hosts', list)
        .option('init', 'init hosts file', init)
        .option('status <domain>', 'check the status of the domains of keyword', status)
        .parse(process.argv);

    if (!process.argv.slice(2).length) {
        commander.outputHelp();
    }

    if (process.argv.length > 2) {
        let action: string = process.argv[2];
        let actions: string[] = ['add', 'enable', 'disable', 'init', 'list', 'status'];
        if (actions.indexOf(action) < 0) {
            console.log('\nyour command: ' + action.red + ' is not enable yet, check again.');
            commander.outputHelp();
        }
    }

}
