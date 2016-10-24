import * as path from 'path';
import * as fs from 'fs';
import * as Q from 'q';
import * as request from 'request';
import * as colors from "colors";

const UPDATE_INTERVAL = 20 * 60 * 1000;
const tnpmRepo = 'http://r.tnpm.oa.com/@tencent/ic-client';
const packageInfo = require('../package.json');
const currentVersion = packageInfo.version;

let isNeedToCheckUpdate = true;
let latestVersion = '';
let isNeedToUpdate = false;
setInterval(() => isNeedToCheckUpdate = true, UPDATE_INTERVAL);

function getTnpmPage(): Q.Promise<String> {
    return Q.Promise<String>((resolve, reject) => {
        request
            .get(tnpmRepo, function(err, response, body) {
                if (err) {
                    let logMessage = `get tnpm page error: ${err.toString()}\n`;
                    console.log(colors.red(logMessage));
                    return reject(err);
                }
                resolve(body);
            });
    });
}

function print() {
    if (!isNeedToUpdate) {
        return;
    }
    let logMessage = `Latest version: ${colors.yellow(latestVersion)}, your version: ${colors.red(currentVersion)}`
    console.log(logMessage);
    console.log(colors.red(`Your ic-client is outdate! please exec the 'tnpm install ic-client -g' to update!\n`));
}

function setVersion(version: string) {
    latestVersion = version;
    if (latestVersion == currentVersion) {
        isNeedToUpdate = false;
        return;
    }
    isNeedToUpdate = true;
}

export function checkVersion() {
    if (!isNeedToCheckUpdate) {
        print();
        return;
    }
    isNeedToCheckUpdate = false;
    getTnpmPage()
        .then(function(page: string) {
            let obj = JSON.parse(page);
            let t = obj['dist-tags']['latest'];
            return t;
        })
        .then(function(version: string) {
            let logMessage = `get tnpm version: ${version}\n`;
            console.log(colors.green(logMessage));
            setVersion(version);
            print();
        });
};
