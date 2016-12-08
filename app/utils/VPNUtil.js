import fs from 'fs';
import openvpnmanager from 'node-openvpn';
import path from 'path';
import request from 'request';

import { dispatch } from '../store';
import { error, info } from '../actions/logActions';
import { supportDir } from './';
import * as vpnActions from '../actions/vpnActions';
import MyipUtil from './MyipUtil';
import SettingsUtil from '../utils/SettingsUtil';
import VPNHelper from './VPNHelper';
import VPNUtilMac from './VPNUtilMac';
import VPNUtilWindows from './VPNUtilWindows';

const GENCONFIG_ENDPOINT = process.env.GENCONFIG_ENDPOINT || 'https://vpn.ht/openvpn-desktop';

let CurrentOSLib;
let openvpn;
let _args;

switch (process.platform) {
  case 'darwin':
    CurrentOSLib = VPNUtilMac;
    break;
  case 'win32':
    CurrentOSLib = VPNUtilWindows;
    break;
  case 'linux':
    CurrentOSLib = VPNUtilMac;
    break;
};

export default class VPNUtil extends CurrentOSLib {

  constructor() {
    super();
    this._helper = new VPNHelper();
  }

  generateConfig(managementPort) {
    return new Promise(resolve => {
      const server = _args.server;

      const encryption = SettingsUtil.get('encryption');
      const autoPath = SettingsUtil.get('autoPath');
      let port = SettingsUtil.get('customPort');
      let smartdns = true;
      const platform = process.platform;
      const disableSmartdns = SettingsUtil.get('disableSmartdns');

      if (disableSmartdns) smartdns = 'disable';
      if (autoPath) port = 'autoPath';
      // if (onlySmartdns) smartdns = 'only';

      return request.get(`${GENCONFIG_ENDPOINT}/${server}/${managementPort}/${port}/${encryption}/${smartdns}/${platform}`, (err, res, body) => {
        const configPath = path.resolve(process.env.CONFIG_PATH, 'config.ovpn');
        fs.writeFileSync(configPath, body);
        return resolve(configPath);
      });
    });
  }

  connectWithConsole() {
    return new Promise(resolve => {
      const port = fs.readFileSync(path.join(supportDir(), 'openvpn.port'));

      const opts = {
        host: 'localhost',
        port: Number(port),
        timeout: 1500
      };

      const auth = {
        user: _args.username,
        pass: _args.password,
      };

      openvpn = openvpnmanager.connect(opts);

      openvpn.on('connected', () => openvpnmanager.authorize(auth));

      openvpn.on('pid', pid => {
        fs.writeFileSync(path.join(supportDir(), 'openvpn.pid'), Number(pid));
      });

      openvpn.on('state-change', state => {
        if (state[1] === 'CONNECTED') {
          // vpnActions.checkIp();
          dispatch(info('Connection successful'));
          return resolve();
        } else if (state[1] === 'EXITING') {
          if (state[2] === 'auth-failure') {
            dispatch(error('Invalid credentials'));
            // vpnActions.invalidCredentials();
            openvpn.removeAllListeners();
            openvpnmanager.destroy();
            // vpnActions.disconnected();
          }

          if (state[2] === 'exit-with-notification') {
            dispatch(info('Disconnected'));
            openvpn.removeAllListeners();
            openvpnmanager.destroy();
            // vpnActions.disconnected();
            if (process.platform === 'win32') {
              dispatch(info('Stopping windows service'));
              exec(['net', 'stop', 'openvpnservice']);
            }
          }
        }
      });

      openvpn.on('error', error => {
        alert(error);
        openvpnmanager.destroy();
        openvpn.removeAllListeners();
        // vpnActions.disconnected();
      });

      openvpn.on('end', () => {
        openvpnmanager.destroy();
        openvpn.removeAllListeners();
        // vpnActions.disconnected();
      });

      openvpn.on('hold-waiting', () => openvpnmanager.cmd('hold release'));
      openvpn.on('console-output', output => dispatch(info(output)));
      // openvpn.on('bytecount', bytes => vpnActions.bytecount(bytes));
    });
  }

  connect(args) {
    _args = args;

    dispatch(info()`

    ----------------------
    Connecting to ${args.server.value}
    `);

    return this._helper.checkRunning()
      .then(this.stopProcess)
      .then(this._helper.managementPort)
      .then(this.generateConfig)
      .then(this.launchProcess)
      .then(this.connectWithConsole);
  }

  disconnect() {
    return openvpnmanager.disconnect();
  }

  initCheck() {
    const myip = new MyipUtil();
    dispatch(info('\n\n----------------------\nWaiting app to be ready\n'));

    return this._helper.checkRunning()
      .then(this.stopProcess)
      .then(myip.fetch)
      .then(() => {
        if (process.platform === 'win32') {
          return this.serviceStatus().then((status) => {
              if (status) {
                exec(['net', 'stop', 'openvpnservice']).then(() => {
                    dispatch(info('VPNUtil.init - App ready'));
                    // return vpnActions.appReady();
                  }).catch(() => {
                    dispatch(warn('VPNUtil.init - App ready with error'));
                    // return vpnActions.appReady();
                  });
              } else {
                dispatch(info('VPNUtil.init - App ready'));
                // return vpnActions.appReady();
              }
            });
        } else {
          dispatch(info('VPNUtil.init - App ready'));
          // return vpnActions.appReady();
        }
      });
  }

}
