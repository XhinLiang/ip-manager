"use strict";
const commander = require("commander");
const colors = require("colors");
const Tools = require("./file");
const hosts_1 = require("./hosts");
const conf = require('../package.json');
function add() {
    log(process.argv);
    return;
}
function enable(params) {
    if (params.length != 2) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    let domain = params[0];
    let ip = params[1];
    let t = hosts_1.enableHost(domain, ip);
    Tools.flush();
}
function disable(params) {
    if (params.length != 1) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    let domain = params[0];
    let t = hosts_1.disableHost(domain);
    Tools.flush();
}
function status(params) {
    if (params.length != 1) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    let targetDomain = params[0];
    let hostsArray = hosts_1.find(targetDomain);
    if (hostsArray.length == 0) {
        console.log('not found.');
    }
    for (let i = 0; i < hostsArray.length; ++i) {
        let host = hostsArray[i];
        process.stdout.write(`${host.domain}: `);
        for (let i = 0; i < host.ips.length; ++i) {
            let ip = host.ips[i];
            if (ip.active) {
                process.stdout.write(` ${colors.yellow(ip.ip + '(o)')} `);
                continue;
            }
            process.stdout.write(` ${ip.ip} `);
        }
        console.log();
    }
}
function init(params) {
    if (params.length != 0) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    Tools
        .init()
        .then(function (hasInit) {
        if (!hasInit) {
            console.log(colors.green('hosts file init success!'));
            return;
        }
        console.log(colors.green('hosts file already has been inited!'));
    })
        .catch(err => console.log(colors.red(err.toString()) + ' ,hosts file init error'));
}
function list(params) {
    if (params.length != 0) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    let hostslist = hosts_1.getHosts();
    if (hostslist.length == 0) {
        console.log(colors.yellow('ip-manager hold no hosts yet'));
    }
    hostslist.forEach(function (item) {
        process.stdout.write(`${item.domain}: `);
        for (let i = 0; i < item.ips.length; ++i) {
            let ip = item.ips[i];
            if (ip.active) {
                process.stdout.write(` ${colors.yellow(ip.ip + '(o)')} `);
                continue;
            }
            process.stdout.write(` ${ip.ip} `);
        }
        console.log();
    });
}
Tools.readHostFile()
    .then(() => start())
    .catch(err => console.log(err));
function log(str) {
    console.log(str);
}
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
}
