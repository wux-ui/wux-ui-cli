import chalk from 'chalk';

export const color = {
    react: chalk.hex('#59c9f1'),
    wux: chalk.hex('#5064e1'),
}

export const err = (text) => console.log(chalk.red(text));
export const warnInfo = (title, text) => console.log(chalk.black.bgYellow(title) + ' ' + text);

export const handleStatus = (status, statusText, rightCode) => {
    console.log(chalk[status === 200 ? 'green' : 'red'](`GET ${status} ${statusText}`));
    if (status === 200) rightCode();
}