"use strict";
var fs = require("fs");
var os = require("os");
var Readline = require("readline");
var Q = require("q");
var hosts_1 = require("./hosts");
var FLAG = '#ip-manager';
var FLAG_END = '#ip-manager-end';
var FLAG_START = '#ip-manager-start';
var LINE_SEPERATOR = isPosix() ? '\n' : '\r\n';
function isPosix() {
    var platform = os.platform();
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
    var promise = Q.Promise(function (resolve, reject) {
        fs.readFile(getHostsFilePath(), 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            var startIndex = data.indexOf(FLAG_START);
            var endIndex = data.indexOf(FLAG_END);
            if (startIndex > -1 && endIndex > -1) {
                resolve(true);
                return;
            }
            var content = data + getNewContent();
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
        var startIndex = data.indexOf(FLAG_START);
        var endIndex = data.indexOf(FLAG_END);
        var content = data.slice(0, startIndex - 1) + data.slice(endIndex + FLAG_END.length, data.length - 1) + getNewContent();
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
    var hostslist = hosts_1.getHosts();
    var content = LINE_SEPERATOR + FLAG_START;
    for (var i = 0; i < hostslist.length; ++i) {
        var host = hostslist[i];
        for (var j = 0; j < host.ips.length; ++j) {
            var ip = host.ips[j];
            if (ip.active) {
                content += LINE_SEPERATOR + "{ip.ip} " + host.domain + " " + FLAG;
                continue;
            }
            content += LINE_SEPERATOR + "#" + ip.ip + " " + host.domain + " " + FLAG;
        }
    }
    return content + LINE_SEPERATOR + FLAG_END;
}
function readHostFile() {
    var promise = Q.Promise(function (resolve, reject) {
        var rl = Readline.createInterface({
            input: fs.createReadStream(getHostsFilePath(), { flags: 'r+' })
        });
        rl.on('line', function (line) {
            var active = true;
            if (line.charAt(0) == '#') {
                line = line.substr(1, line.length - 1).trim();
                active = false;
            }
            var splitArray = line.split(' ');
            var flag = splitArray.pop();
            if (flag.indexOf('#ip-manager') < 0) {
                return;
            }
            var domain = splitArray.pop();
            var ip = splitArray[0];
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
