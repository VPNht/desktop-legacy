import fs from 'fs';
import path from 'path';
import running from 'is-running';

import {
  exec,
  supportDir
} from './';
import { dispatch } from '../store';
import { info } from '../actions/logActions';
import ResourcesUtil from './ResourcesUtil';

export default class VPNUtilMac {

  constructor() {
    this._resources = new ResourcesUtil();
  }

  launchProcess(config) {
    return exec([
      path.join(this._resources.resourceDir(), 'openvpn'),
      '--config', config,
      '--script-security', '2',
      '--up', path.join(this._resources.resourceDir(), 'script.up.launch'),
      '--down', path.join(this._resources.resourceDir(), 'script.down.launch'),
      '--daemon'
    ]);
  }

  stopProcess(isRunning) {
    if (isRunning) {
      const pid = fs.readFileSync(path.join(supportDir(), 'openvpn.pid'));
      const port = fs.readFileSync(path.join(supportDir(), 'openvpn.port'));

      dispatch(info(`Stopping previous openvpn service PID: ${pid} PORT ${port}`));

      return new Promise((resolve) => {
        this._helper.softKill(Number(port)).then(() => {
          if (running(Number(pid))) {
            dispatch(info('Process still running, running manual kill'));
            return exec(['kill', '-9', Number(pid)]).then(() => {
              dispatch(info('Process stopped successfully'));
              return resolve();
            });
          }
          dispatch(info('Process stopped successfully'));
          return resolve();
        }).catch(() => {
          dispatch(info('We have to kill the process manually'));
          return exec(['kill', '-9', Number(pid)]).then(() => resolve());
        });
      });
    }

    return Promise.resolve();
  }

  enableStartOnBoot() {
    return exec([
      'osascript',
      path.join(this._resources.resourceDir(), 'scripts/LoginItemAdd.scpt'),
      'VPN.ht'
    ]);
  }

  disableStartOnBoot() {
    return exec([
      'osascript',
      path.join(this._resources.resourceDir(), 'scripts/LoginItemRemove.scpt'),
      'VPN.ht'
    ]);
  }

  statusStartOnBoot() {
    return exec([
      'osascript',
      path.join(this._resources.resourceDir(), 'scripts/LoginItemCheck.scpt')
    ]).then(stdout => {
      return stdout == 1 ? true : false;
    });
  }

}
