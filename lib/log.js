import chalk from 'chalk';
import singleLineLog from './single-line-log.js';

const lineLog = singleLineLog(process.stdout);

export const color = {
    react: chalk.hex('#59c9f1'),
    wux: chalk.hex('#5064e1'),
}

export const err = (text) => console.log(chalk.red(text));
export const warnInfo = (title, text) => console.log(chalk.black.bgYellow(title) + ' ' + text);

export const handleStatus = (before, {status, statusText}, rightCode) => {
    before();
    console.log(chalk[status === 200 ? 'green' : 'red'](`GET ${status} ${statusText}`));
    if (status === 200) rightCode();
}