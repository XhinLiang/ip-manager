"use strict";
let hosts = [];
let domains = [];
let ips = [];
function disableAll(domain) {
    for (let host of hosts) {
        if (host.domain == domain) {
            for (let ip of host.ips) {
                ip.active = false;
            }
        }
    }
}
function addHost(domain, newIp, active) {
    for (let host of hosts) {
        if (host.domain == domain) {
            let hasThisIp = false;
            for (let ip of host.ips) {
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
            host.ips.push({ ip: newIp, active });
            ips.push(newIp);
            return;
        }
    }
    hosts.push({ domain, ips: [{ ip: newIp, active }] });
    domains.push(domain);
    ips.push(newIp);
}
exports.addHost = addHost;
function findIp(ipTemp) {
    for (let i = 0; i < ips.length; ++i) {
        let item = ips[i];
        if (item == ipTemp) {
            return item;
        }
    }
    for (let i = 0; i < ips.length; ++i) {
        let item = ips[i];
        let splitArray = item.split('.');
        if (ipTemp == splitArray.pop()) {
            return item;
        }
    }
    console.log('ip not found.');
    return null;
}
function findDomain(domainTemp) {
    for (let i = 0; i < domains.length; ++i) {
        let item = domains[i];
        if (item == domainTemp) {
            return [item];
        }
    }
    let result = [];
    for (let i = 0; i < domains.length; ++i) {
        let item = domains[i];
        if (item.indexOf(domainTemp) < 0) {
            continue;
        }
        result.push(item);
    }
    return result;
}
function enableHost(domainTemp, ipTemp) {
    let domainArray = findDomain(domainTemp);
    let ip = findIp(ipTemp);
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
    let domainArray = findDomain(domainTemp);
    if (domainArray.length != 1) {
        console.log('domain not spacific.');
        return false;
    }
    disableAll(domainArray[0]);
    return true;
}
exports.disableHost = disableHost;
function find(domainTemp) {
    let domainArray = findDomain(domainTemp);
    let result = [];
    for (let host of hosts) {
        for (let domain of domainArray) {
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
