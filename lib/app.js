"use strict";
var commander = require('commander');
var colors = require('colors');
var Tools = require('./tools');
var hosts_1 = require('./hosts');
var conf = require('../package.json');
function add(params) {
    if (params.length != 2) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    var domain = params[0];
    var ip = params[1];
    hosts_1.addHost(domain, ip, true);
    Tools.flush();
}
function enable(params) {
    if (params.length != 2) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    var domain = params[0];
    var ip = params[1];
    var t = hosts_1.enableHost(domain, ip);
    Tools.flush();
}
function disable(params) {
    if (params.length != 1) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    var domain = params[0];
    var t = hosts_1.disableHost(domain);
    Tools.flush();
}
function status(params) {
    if (params.length != 1) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    var targetDomain = params[0];
    var hostsArray = hosts_1.find(targetDomain);
    if (hostsArray.length == 0) {
        console.log('not found.');
    }
    for (var i = 0; i < hostsArray.length; ++i) {
        var host = hostsArray[i];
        process.stdout.write(host.domain + ": ");
        for (var i_1 = 0; i_1 < host.ips.length; ++i_1) {
            var ip = host.ips[i_1];
            if (ip.active) {
                process.stdout.write(" " + colors.yellow(ip.ip + '(o)') + " ");
                continue;
            }
            process.stdout.write(" " + ip.ip + " ");
        }
        console.log();
    }
}
function list(params) {
    if (params.length != 0) {
        console.log('Your command params is no suit for action-add');
        return commander.outputHelp();
    }
    var hostslist = hosts_1.getHosts();
    var ho = hostslist[0];
    hostslist.forEach(function (item) {
        process.stdout.write(item.domain + ": ");
        for (var i = 0; i < item.ips.length; ++i) {
            var ip = item.ips[i];
            if (ip.active) {
                process.stdout.write(" " + colors.yellow(ip.ip + '(o)') + " ");
                continue;
            }
            process.stdout.write(" " + ip.ip + " ");
        }
        console.log();
    });
}
Tools.readHostFile()
    .then(function () { return start(); }, function (err) { return console.log(err); });
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
