import spawn from "cross-spawn";
import semver from 'semver';

export const needUpdate = (version) => new Promise((resolve, reject) => {
    setTimeout(_ => reject(new Error('Time out')), 10 * 1000);
    let nowVersion = spawn.sync('npm', ['view', 'wux-ui-cli', 'version']).stdout.toString()
    resolve({ need: semver.lt(version, nowVersion), nowVersion: nowVersion });
});