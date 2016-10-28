"use strict";
const fs = require('fs');
const os = require('os');
const Readline = require('readline');
const hosts_1 = require('./hosts');
const FLAG = '#ip-manager';
const FLAG_END = '#ip-manager-end';
const FLAG_START = '#ip-manager-start';
const LINE_SEPERATOR = isPosix() ? '\n' : '\r\n';
function isPosix() {
    let platform = os.platform();
    if (platform == 'win32') {
        return false;
    }
    return true;
}
exports.isPosix = isPosix;
function getHostsFilePath() {
    if (isPosix()) {
        return '/etc/hosts';
    }
    return 'C:/Windows/System32/drivers/etc/hosts';
}
exports.getHostsFilePath = getHostsFilePath;
function validateIp(str) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(str)) {
        return true;
    }
    return false;
}
exports.validateIp = validateIp;
function init() {
    let promise = new Promise((resolve, reject) => {
        fs.readFile(getHostsFilePath(), 'utf8', function (err, data) {
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
            fs.writeFile(getHostsFilePath(), content, 'utf8', function (err) {
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
exports.init = init;
function flush() {
    fs.readFile(getHostsFilePath(), 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        let startIndex = data.indexOf(FLAG_START);
        let endIndex = data.indexOf(FLAG_END);
        let content = data.slice(0, startIndex - 1) + data.slice(endIndex + FLAG_END.length, data.length - 1) + getNewContent();
        fs.writeFile(getHostsFilePath(), content, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        });
        return;
    });
}
exports.flush = flush;
function getNewContent() {
    let hostslist = hosts_1.getHosts();
    let content = LINE_SEPERATOR + FLAG_START;
    for (let i = 0; i < hostslist.length; ++i) {
        let host = hostslist[i];
        for (let j = 0; j < host.ips.length; ++j) {
            let ip = host.ips[j];
            if (ip.active) {
                content += `${LINE_SEPERATOR}${ip.ip} ${host.domain} ${FLAG}`;
                continue;
            }
            content += `${LINE_SEPERATOR}#${ip.ip} ${host.domain} ${FLAG}`;
        }
    }
    return content + LINE_SEPERATOR + FLAG_END;
}
function readHostFile() {
    let promise = new Promise((resolve, reject) => {
        let rl = Readline.createInterface({
            input: fs.createReadStream(getHostsFilePath(), { flags: 'r+' })
        });
        rl.on('line', function (line) {
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
            hosts_1.addHost(domain, ip, active);
        });
        rl.on('close', resolve);
        rl.on('error', reject);
    });
    return promise;
}
exports.readHostFile = readHostFile;
