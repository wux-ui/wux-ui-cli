const MOVE_LEFT = Buffer.from('1b5b3130303044', 'hex').toString();
const MOVE_UP = Buffer.from('1b5b3141', 'hex').toString();
const CLEAR_LINE = Buffer.from('1b5b304b', 'hex').toString();
import stringWidth from 'string-width';

export default (stream) => {
    let { write } = stream;
    let str;

    stream.write = function (data) {
        if (str && data !== str) str = null;
        return write.apply(this, arguments);
    };

    if (stream === process.stderr || stream === process.stdout) {
        process.on('exit', _ => {
            if (str !== null) stream.write('');
        });
    }

    let prevLineCount = 0;
    return class {
        /**Log arguments to console in single line */
        log() {
            str = '';
            let nextStr = Array.prototype.join.call(arguments, ' ');
            for (let i = 0; i < prevLineCount; i++) {
                str += MOVE_LEFT + CLEAR_LINE + (i < prevLineCount - 1 ? MOVE_UP : '');
            }
            str += nextStr;
            stream.write(str);
            let prevLines = nextStr.split('\n');
            prevLineCount = 0;
            for (let i = 0; i < prevLines.length; i++) {
                prevLineCount += Math.ceil(stringWidth(prevLines[i]) / stream.columns) || 1;
            }
        }

        /**Clear the single line */
        clear() {
            this.log();
            stream.write('');
        }
    }
}