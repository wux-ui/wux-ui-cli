export function handleArgv() {
    const { argv } = process;
    let returnArgv = [];
    argv.forEach(v => { if (!v.includes('\\')) returnArgv.push(v); });
    return { argv: argv, processedArgv: returnArgv };
}