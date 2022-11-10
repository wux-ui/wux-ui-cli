#!/usr/bin/env node
import envinfo from 'envinfo';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import axios from 'axios';
import spawn from 'cross-spawn';
import singleLineLog from './lib/single-line-log.js';

import { handleArgv } from './lib/argv.js';
import { err, color, warnInfo, handleStatus } from './lib/log.js';
import { needUpdate } from './lib/update.js';

const argv = handleArgv();
const { processedArgv } = argv;
const lineLog = new (singleLineLog(process.stdout));

//wux-ui -d [cmd]
if (processedArgv.includes('-d') || processedArgv.includes('--debug')) console.log(argv);

//wux-ui ls
if (processedArgv.includes('ls')) {
    envinfo
        .run({ npmPackages: ['react'] }, { json: true, showNotFound: true })
        .then(env => {
            const { npmPackages } = JSON.parse(env);
            if (npmPackages.react === 'Not Found') {
                err(`The node package ${color.react('react')} is not found`);
            }
            else {
                console.log(`${color.react('react')}: v${npmPackages.react.installed}`);
                fs.readdir('./src/wux-ui-react', (err, files) => {
                    if (err) {
                        err(`You don't have ${color.wux('wux-ui-react')} yet`);
                        inquirer
                            .prompt([{
                                type: 'confirm',
                                name: 'install',
                                message: 'Do you want to install wux-ui-react?',
                                default: false
                            }])
                            .then(({ install }) => {
                                if (install) {
                                    spawn('git', ['clone', 'https://github.com/wux-ui/wux-ui-react', '.\\src\\wux-ui-react'], { stdio: 'inherit' });
                                }
                            })
                    }
                    else if (files.includes('package.json')) {
                        fs.readFile('./src/wux-ui-react/package.json', (e, data) => {
                            if (e) throw e;
                            else console.log(`${color.wux('wux-ui-react')}: v${JSON.parse(data).version}`);
                        });
                    }
                })
            }
        });
}

//wux-ui i <pkg>
if (processedArgv.includes('i')) {
    const pkg = processedArgv[processedArgv.indexOf('i') + 1];
    if (pkg === undefined) err('You need write the pkg name to install');
    else {
        switch (pkg) {
            case 'wux-ui':
                err('You needn\'t to install the wux.css, you should import that css by the CDN');
                warnInfo('SEE', color.wux('https://docs.wux-ui.tk/start/download.html'));
                inquirer
                    .prompt([{
                        type: 'confirm',
                        name: 'install',
                        message: 'Are you sure to install?',
                        default: false
                    }])
                    .then(({ install }) => {
                        if (install) {
                            inquirer
                                .prompt([{
                                    type: 'list',
                                    name: 'hostname',
                                    message: 'Where do you want to install from?',
                                    choices: ['debug.wux-ui.tk', 'cdn.jsdelivr.net/gh/wux-ui/wux-ui'],
                                }])
                                .then(({ hostname }) => {
                                    const text = `Getting wux.css from ${color.wux(`https://${hostname}/dist/wux.css`)}`;
                                    let waiting = '';
                                    const logger = setInterval(() => {
                                        waiting = waiting.length === 3 ? '' : waiting + '.';
                                        lineLog.log(text + waiting);
                                    }, 500);
                                    axios
                                        .get(`https://${hostname}/dist/wux.css`)
                                        .then(result => {
                                            handleStatus(
                                                _ => {
                                                    clearInterval(logger);
                                                    lineLog.clear();
                                                },
                                                result,
                                                _ => fs.writeFile('wux.css', result.data, err => {
                                                    if (err) throw err;
                                                    console.log('The file is installed');
                                                })
                                            );
                                        });
                                });
                        }
                    });
                break;

            default: err(`There isn't a pkg of ${pkg}`);
        }
    }
}

//wux-ui update
if (processedArgv.includes('update')) {
    const { version } = JSON.parse(fs.readFileSync(path.join(argv.defaultArgv[1], '../package.json')).toString());
    needUpdate(version).then(({ need, nowVersion }) => {
        if (need) {
            spawn('npm', ['i', 'wux-ui-cli@latest', '-g'], { stdio: 'inherit' }).addListener('close', _ => {
                console.log(`Update ${color.wux('wux-ui-cli')} ${version} -> ${nowVersion}`);
            });
        }
        else console.log(`There is no new version, now version: ${color.wux('v' + nowVersion)}`);
    }, (err) => { throw err });
}