let hosts: Host[] = [];
let domains: string[] = [];
let ips: string[] = [];

interface Ip {
    ip: string;
    active: boolean;
}

interface Host {
    domain: string;
    ips: Ip[]
}

function disableAll(domain: string): void {
    for (let host of hosts) {
        if (host.domain == domain) {
            for (let ip of host.ips) {
                ip.active = false;
            }
        }
    }
}

function addHost(domain: string, newIp: string, active: boolean): void {
    for (let host of hosts) {
        if (host.domain == domain) {
            let hasThisIp = false;
            // 找下这个 domain 对应的 IP 是否已经存在
            for (let ip of host.ips) {
                // 新的 IP 已经启用，那么所有的 IP 都先弃用
                if (active) {
                    ip.active = false;
                }
                // 已经存在，修改这个 ip 是否是启用的
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

/**
 * 根据 IP 简写查找指定的 IP
 * @param  {string} ipTemp IP 简写
 * @return {string}        完整 IP
 */
function findIp(ipTemp: string): string {
    for (let i = 0; i < ips.length; ++i) {
        let item: string = ips[i];
        let splitArray = item.split('.');
        if (ipTemp == splitArray.pop()) {
            return item;
        }
    }
    console.log('ip not found.');
    return null;
}

function findDomain(domainTemp: string): string[] {
    let result: string[] = [];
    for (let i = 0; i < domains.length; ++i) {
        let item: string = domains[i];
        if (item.indexOf(domainTemp) < 0) {
            continue;
        }
        result.push(item);
    }
    return result;
}

function enableHost(domainTemp: string, ipTemp: string): boolean {
    let domainArray: string[] = findDomain(domainTemp);
    let ip: string = findIp(ipTemp);
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

function disableHost(domainTemp: string): boolean {
    let domainArray: string[] = findDomain(domainTemp);
    if (domainArray.length != 1) {
        console.log('domain not spacific.');
        return false;
    }
    disableAll(domainArray[0]);
    return true;
}

function find(domainTemp: string): Host[] {
    let domainArray: string[] = findDomain(domainTemp);
    let result: Host[] = [];
    for (let host of hosts) {
        for (let domain of domainArray) {
            if (host.domain == domain) {
                result.push(host);
            }
        }
    }
    return result;
}

function getHosts(): Host[] {
    return hosts;
}

function flush(): void {
}

function hehe() {
    console.log('hehe');
}

export {Ip, Host, enableHost, disableHost, flush, addHost, getHosts, find, hehe};
