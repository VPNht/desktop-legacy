import fs from 'fs';
import getPort from 'get-port';
import openvpnmanager from 'node-openvpn';
import path from 'path';
import running from 'is-running';

import { dispatch } from '../store';
import { info } from '../actions/logActions';
import { supportDir } from './';
import * as vpnActions from '../actions/vpnActions';
import MyipUtil from './MyipUtil';

let openvpn = null;

export default class VPNHelper {

  constructor() {
  }

  managementPort() {
    return getPort().then(port => {
      fs.writeFileSync(path.join(supportDir(), 'openvpn.port'), port);
      return port;
    });
  }

  softKill(port) {
    const opts = {
      host: 'localhost',
      port,
      timeout: 1500
    };

    dispatch(info('VPNUtil.softDisconnect - Trying to stop previous process'));

    return new Promise((resolve, reject) => {
      openvpn = openvpnmanager.connectAndKill(opts);

      openvpn.on('state-change', state => {
        if (state && state[2] === 'exit-with-notification') {
          openvpnmanager.destroy();
          openvpn.removeAllListeners();
          resolve();
        }
      });

      openvpn.on('error', () => {
        openvpnmanager.destroy();
        openvpn.removeAllListeners();
        reject();
      });

      openvpn.on('console-output', output => dispatch(info(output)));
    });
  }

  updateIp() {
    const myip = new MyipUtil();

    return new Promise(resolve => {
      myip.status((err, res, body) => {
        // vpnActions.newIp(JSON.parse(body));
        resolve();
      });
    });
  }

  checkRunning() {
    return new Promise(resolve => {
      let pid = false;
      try {
        pid = fs.readFileSync(path.join(supportDir(), 'openvpn.pid')) || false;
      } catch (err) {
        console.error(err);
      }

      if (pid && running(Number(pid))) {
        dispatch(info(`Previous openvpn status still running, PID: ${pid}`));
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

}
