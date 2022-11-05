#!/usr/bin/env node
import envinfo from 'envinfo';
import chalk from 'chalk';
import fs from 'fs';
import { handleArgv } from './lib/argv.js';
import inquirer from 'inquirer';
import axios from 'axios';
const argv = handleArgv();
const { processedArgv } = argv;
const color = {
    react: chalk.hex('#59c9f1'),
    wux: chalk.hex('#5064e1'),
}

//wux-ui -d [cmd]
if (processedArgv.includes('-d') || processedArgv.includes('--debug')) console.log(argv);

//wux-ui ls
if (processedArgv.includes('ls')) {
    envinfo
        .run({ npmPackages: ['react'] }, { json: true, showNotFound: true })
        .then(env => {
            const { npmPackages } = JSON.parse(env);
            if (npmPackages.react === 'Not Found') {
                console.log(chalk.red(
                    'The node package ' +
                    color.react('react') +
                    ' is not found'
                ));
            }
            else {
                console.log(`${color.react('react')}: v${npmPackages.react.installed}`);
                fs.readdir('./src/wux-ui', (err, files) => {
                    if (err) console.log(chalk.red(
                        'You don\'t have ' +
                        color.wux('wux-ui') +
                        ' yet'
                    ));
                    else if (files.includes('package.json')) {
                        fs.readFile('./src/wux-ui/package.json', (e, data) => {
                            if (e) throw e;
                            else console.log(`${color.wux('wux-ui')}: v${JSON.parse(data).version}`);
                        });
                    }
                })
            }
        });
}

//wux-ui i <pkg>
if (processedArgv.includes('i')) {
    const pkg = processedArgv[processedArgv.indexOf('i') + 1];
    if (pkg === undefined) console.log(chalk.red('You need write the pkg name to install'));
    else {
        switch (pkg) {
            case 'wux-ui':
                console.log(chalk.red('You needn\'t to install the wux.css, you should import that css by the CDN'));
                console.log(chalk.black.bgYellow('SEE') + ' ' + color.wux('https://docs.wux-ui.tk/start/download.html'));
                inquirer
                    .prompt([{
                        type: 'confirm',
                        name: 'install',
                        message: 'Are you sure to install?',
                        default: false
                    }])
                    .then(({ install }) => {
                        if (install) axios
                            .get('https://debug.wux-ui.tk/dist/wux.css')
                            .then(r => {
                                if (r.status === 200) {
                                    console.log(chalk.green(`GET ${r.status} ${r.statusText}`));
                                    fs.writeFile('wux.css', r.data, err => {
                                        if (err) throw err;
                                        console.log('The file is installed');
                                    })
                                }
                                else console.log(chalk.red(`GET ${r.status} ${r.statusText}`));
                            })
                    });
                break;

            default: console.log(chalk.red(`There isn\'t a pkg of ${pkg}`));
        }
    }
}