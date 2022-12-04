export function handleArgv() {
    const { argv } = process;
    let returnArgv = argv.map(v => v);
    returnArgv.splice(0, 2);
    return { defaultArgv: argv, processedArgv: new ProcessedArgv(returnArgv) };
}

class ProcessedArgv {
    constructor(value) {
        this.value = value || [];
    }
    getValue = _ => this.value;
    includesCmd = (cmd) => this.value[0] === cmd;
    getCmd = (cmd, num) => this.value[this.value.indexOf(cmd) + num];
    includesOpt = (short, opt) => this.value.includes(`-${short}`) || this.value.includes(`--${opt}`);
}