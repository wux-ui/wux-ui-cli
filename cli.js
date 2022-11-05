#!/usr/bin/env node
import envinfo from 'envinfo';
import chalk from 'chalk';
import { handleArgv } from './lib/argv.js';
const { processedArgv } = handleArgv();

if (processedArgv.includes('-d') || processedArgv.includes('--debug')) console.log(processedArgv);

if (processedArgv.includes('ls')) {
    envinfo.run(
        { npmPackages: ['react'] },
        { json: true, showNotFound: true }
    ).then(env => {
        const { npmPackages } = JSON.parse(env);
        if (npmPackages.react === 'Not Found') {
            console.log(chalk.red(
                'The node package ' +
                chalk.hex('#59c9f1')('react') +
                ' is not found'
            ));
        }
        else {
            console.log(`${chalk.hex('#59c9f1')('react')}: v${npmPackages.react.installed}`);
        }
    });
}