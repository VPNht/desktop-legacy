import { remote } from 'electron';
import child_process from 'child_process';
import crypto from 'crypto';
import exec from 'exec';
import fs from 'fs';
import path from 'path';
import ps from 'xps';

const { app } = remote;

// export function exec(args, options) {
//   options = options || {};
//
//   if (isWindows()) {
//     options.env = options.env || {};
//     if (!options.env.PATH) options.env.PATH = `${process.env.BIN_PATH};${process.env.PATH}`;
//   }
//
//   let fn = Array.isArray(args) ? exec : child_process.exec;
//   return new Promise((resolve, reject) => {
//     fn(args, options, (stderr, stdout, code) => {
//       if (code) {
//         const cmd = Array.isArray(args) ? args.join(' ') : args;
//         return reject(new Error(`${cmd} returned non zero exit code. Stderr: ${stderr}`));
//       }
//
//       return resolve(stdout);
//     });
//   });
// }

export function killTask(name) {
  return new Promise((resolve, reject) => {
    module.exports.checkTaskRunning(name).then(task => {
      const taskon = task ? true : false;
      if (taskon) {
        return ps.kill(task.pid).fork(error => reject(new Error(error)), () => resolve(task));
      }

      return resolve('task not running');
    });
  });
}

export function checkTaskRunning(name) {
  return new Promise((resolve, reject) => {
    return ps.list().fork(
      error => reject(error),
      processes => {
        resolve(processes.filter(value => {
          if (value.name === name) return value;
          return null;
        })[0]);
      }
    );
  });
}

export function isWindows() {
  return process.platform === 'win32';
}

export function binsPath() {
  return isWindows() ? path.join(home(), 'VPN.ht-bins') : path.join('/usr/local/bin');
}

export function binsEnding() {
  return isWindows() ? '.exe' : '';
}

export function dockerBinPath() {
  return path.join(binsPath(), `docker${binsEnding()}`);
}

export function dockerMachineBinPath() {
  return path.join(binsPath(), `docker-machine${binsEnding()}`);
}

export function dockerComposeBinPath() {
  return path.join(binsPath(), `docker-compose${binsEnding()}`);
}

export function escapePath(str) {
  return str.replace(/ /g, '\\ ').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export function home() {
  return app.getPath('home');
}

export function documents() {
  return 'Documents';
}

export function supportDir() {
  return app.getPath('userData');
}

export function commandOrCtrl() {
  return isWindows() ? 'Ctrl' : 'Command';
}

export function removeSensitiveData(str) {
  if (!str || str.length === 0 || typeof str !== 'string') return str;
  return str.replace(/-----BEGIN CERTIFICATE-----.*-----END CERTIFICATE-----/mg, '<redacted>')
    .replace(/-----BEGIN RSA PRIVATE KEY-----.*-----END RSA PRIVATE KEY-----/mg, '<redacted>')
    .replace(/\/Users\/[^\/]*\//mg, '/Users/<redacted>/')
    .replace(/\\Users\\[^\/]*\\/mg, '\\Users\\<redacted>\\');
}

export function packageJson() {
  const dest = path.join(process.cwd(), 'app', 'package.json');
  return JSON.parse(fs.readFileSync(dest, 'utf8'));
}

export function settingsJson() {
  let settingsjson = {};
  try {
    const dest = path.join(process.cwd(), 'app', '/settings.json');
    settingsjson = JSON.parse(fs.readFileSync(dest, 'utf8'));
  } catch (err) {}
  return settingsjson;
}

export function isOfficialRepo(name) {
  if (!name || !name.length) return false;

  const repoRegexp = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
  return repoRegexp.test(name);
}

export function compareVersions(v1, v2, options) {
  const lexicographical = options && options.lexicographical;
  const zeroExtend = options && options.zeroExtend;
  let v1parts = v1.split('.');
  let v2parts = v2.split('.');

  const isValidPart = x => (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) return NaN;

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) {
      v1parts.push('0');
    }
    while (v2parts.length < v1parts.length) {
      v2parts.push('0');
    }
  }

  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }

  for (let i = 0; i < v1parts.length; ++i) {
    if (v2parts.length === i) return 1;

    if (v1parts[i] === v2parts[i]) {
      continue;
    } else if (v1parts[i] > v2parts[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  if (v1parts.length !== v2parts.length) return -1;

  return 0;
}

export function randomId() {
  return crypto.randomBytes(32).toString('hex');
}

export function windowsToLinuxPath(windowsAbsPath) {
  let fullPath = windowsAbsPath.replace(':', '').split(path.sep).join('/');
  if (fullPath.charAt(0) !== '/') {
    fullPath = `/${fullPath.charAt(0).toLowerCase()}${fullPath.substring(1)}`;
  }

  return fullPath;
}

export function linuxToWindowsPath(linuxAbsPath) {
  return linuxAbsPath.replace('/c', 'C:').split('/').join('\\');
}

export function bytesToSize(bytes) {
  const thresh = 1000;
  if (Math.abs(bytes) < thresh) return `${bytes} B`;
  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(2)} ${units[u]}`;
}

export function toHHMMSS(seconds) {
  const secNum = parseInt(seconds, 10);
  let hours = Math.floor(secNum / 3600);
  let minutes = Math.floor((secNum - (hours * 3600)) / 60);
  seconds = secNum - (hours * 3600) - (minutes * 60);

  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;

  const time = `${hours}:${minutes}:${seconds}`;
  return time;
}

export function webPorts() {
  return ['80', '8000', '8080', '3000', '5000', '2368', '9200', '8983'];
}
