import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import ps from 'xps';
// import serviceManager from 'windows-service-manager';
import Winreg from 'winreg';

import { dispatch } from '../store';
import {
  exec,
  supportDir
} from './';
import { info } from '../actions/logActions';

const regKey = new Winreg({
  hive: Winreg.HKCU,
  key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
});

export default class VPNUtilWindows {

  launchProcess() {
    return exec(['net', 'start', 'openvpnservice']);
  }

  stopProcess(isRunning) {
    if (isRunning) {
      const pid = fs.readFileSync(path.join(supportDir(), 'openvpn.pid'));
      const port = fs.readFileSync(path.join(supportDir(), 'openvpn.port'));
      dispatch(info(`Stopping previous openvpn service PID: ${pid} PORT ${port}`));

      return new Promise(resolve => {
        this._helper.softKill(Number(port)).then(() => {
            dispath(info('Process stopped successfully'));
            exec(['net', 'stop', 'openvpnservice']).then(() => {
                dispath(info('Service stopped successfully'));
                return resolve();
              }).catch(() => {
                dispath(info('Service not running'));
                return resolve();
              });
          }).catch(() => {
            dispath(info('We have to stop the service manually'));
            return module.exports.hardKillProcess('openvpnservice.exe').then(resolve).catch(reject);
          });
      });
    }

    return Promise.resolve();
  }

  hardKillProcess(name) {
    return new Promise((resolve, reject) => {
      module.exports.checkProcessRunning(name).then(task => {
        const taskon = task ? true : false;
        if (taskon) {
          ps.kill(task.pid).fork(
            error => reject(error),
            () => {
              dispatch(info(`FORCE KILLING: ${task.name} PID: ${task.pid}`));
              return resolve();
            }
          );
        } else {
          return resolve();
        }
      });
    });
  }

  checkProcessRunning(name) {
    return new Promise((resolve, reject) => {
      ps.list().fork(
        error => reject(error),
        processes => {
          resolve(processes.filter(value => {
            if (value.name === name) return value;
          })[0]);
        }
      );
    });
  }

  enableStartOnBoot(hidden) {
    return new Promise(resolve => {
      regKey.set('VPNht', Winreg.REG_SZ, '\'' + remote.app.getPath('exe') + (hidden ? ' --hide' : '') +'\'', () => resolve());
    });
  }

  disableStartOnBoot() {
    return new Promise(resolve => regKey.remove('VPNht', () => resolve()));
  }

  statusStartOnBoot() {
    return new Promise(resolve => regKey.get('VPNht', (error, item) => resolve(item != null)));
  }

  serviceStatus() {
    return new Promise(resolve => {
      return resolve(false);
      // serviceManager.queryService('openvpnservice', (err, service) => {
      //   if (err) {
      //     return resolve(false);
      //   } else if (service.state === 4) {
      //     return resolve(true);
      //   }
      //
      //   return resolve(false);
      // });
    });
  }

}
