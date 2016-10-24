"use strict";
var hosts = [];
var domains = [];
var ips = [];
function disableAll(domain) {
    for (var _i = 0, hosts_1 = hosts; _i < hosts_1.length; _i++) {
        var host = hosts_1[_i];
        if (host.domain == domain) {
            for (var _a = 0, _b = host.ips; _a < _b.length; _a++) {
                var ip = _b[_a];
                ip.active = false;
            }
        }
    }
}
function addHost(domain, newIp, active) {
    for (var _i = 0, hosts_2 = hosts; _i < hosts_2.length; _i++) {
        var host = hosts_2[_i];
        if (host.domain == domain) {
            var hasThisIp = false;
            for (var _a = 0, _b = host.ips; _a < _b.length; _a++) {
                var ip = _b[_a];
                if (active) {
                    ip.active = false;
                }
                if (ip.ip == newIp) {
                    hasThisIp = true;
                    ip.active = active;
                }
            }
            if (hasThisIp) {
                return;
            }
            host.ips.push({ ip: newIp, active: active });
            ips.push(newIp);
            return;
        }
    }
    hosts.push({ domain: domain, ips: [{ ip: newIp, active: active }] });
    domains.push(domain);
    ips.push(newIp);
}
exports.addHost = addHost;
function findIp(ipTemp) {
    for (var i = 0; i < ips.length; ++i) {
        var item = ips[i];
        var splitArray = item.split('.');
        if (ipTemp == splitArray.pop()) {
            return item;
        }
    }
    console.log('ip not found.');
    return null;
}
function findDomain(domainTemp) {
    var result = [];
    for (var i = 0; i < domains.length; ++i) {
        var item = domains[i];
        if (item.indexOf(domainTemp) < 0) {
            continue;
        }
        result.push(item);
    }
    return result;
}
function enableHost(domainTemp, ipTemp) {
    var domainArray = findDomain(domainTemp);
    var ip = findIp(ipTemp);
    if (!ip) {
        return false;
    }
    if (domainArray.length != 1) {
        console.log('domain not found');
        return false;
    }
    addHost(domainArray[0], ip, true);
    return true;
}
exports.enableHost = enableHost;
function disableHost(domainTemp) {
    var domainArray = findDomain(domainTemp);
    if (domainArray.length != 1) {
        console.log('domain not spacific.');
        return false;
    }
    disableAll(domainArray[0]);
    return true;
}
exports.disableHost = disableHost;
function find(domainTemp) {
    var domainArray = findDomain(domainTemp);
    var result = [];
    for (var _i = 0, hosts_3 = hosts; _i < hosts_3.length; _i++) {
        var host = hosts_3[_i];
        for (var _a = 0, domainArray_1 = domainArray; _a < domainArray_1.length; _a++) {
            var domain = domainArray_1[_a];
            if (host.domain == domain) {
                result.push(host);
            }
        }
    }
    return result;
}
exports.find = find;
function getHosts() {
    return hosts;
}
exports.getHosts = getHosts;
function flush() {
}
exports.flush = flush;
function hehe() {
    console.log('hehe');
}
exports.hehe = hehe;
