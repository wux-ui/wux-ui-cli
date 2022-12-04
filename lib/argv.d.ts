namespace Argv {
    type handledArgv = {
        defaultArgv: string[];
        processedArgv: ProcessedArgv<string>;
    }
}

/**Handle the {@link process.argv} */
export function handleArgv(): Argv.handledArgv;

class ProcessedArgv<T> {
    constructor(value: T[]): ProcessedArgv;
    /**Get the value */
    getValue(): T[];
    /**Get the `num` parameter of `cmd` in argv */
    getCmd(cmd: T, num: number): T | undefined;
    /**Is the argv includes the command of `cmd` */
    includesCmd(cmd: T): boolean;
    /**Is the argv includes the option of `short` or `opt` */
    includesOpt(short: T, opt: T): boolean;

    value: T[];
}