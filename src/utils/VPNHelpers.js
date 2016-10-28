import Promise from 'bluebird';
import fs from 'fs';
import log from '../stores/LogStore';
import vpnActions from '../actions/VPNActions';
import getPort from 'get-port';
import myip from './MyipUtil';
import openvpnmanager from 'node-openvpn';
import util from './Util';
import path from 'path';
import running from 'is-running';

var openvpn;

module.exports = {

    managementPort: function () {
      return getPort().then(port => {
          fs.writeFileSync(path.join(util.supportDir(), 'openvpn.port'), port);
          return port;
      });
    },

    softKill: function (port) {

      var opts = {
          host: 'localhost',
          port: port,
          timeout: 1500
      };

      log.info('VPNUtil.softDisconnect - Trying to stop previous process');

      return new Promise((resolve, reject) => {

          openvpn = openvpnmanager.connectAndKill(opts);

          // we wait the connection to close
          openvpn.on('state-change', function(state) {
                if (state && state[2] == 'exit-with-notification') {
                    openvpnmanager.destroy();
                    openvpn.removeAllListeners();
                    resolve();
                }
          });

          openvpn.on('error', function() {
              openvpnmanager.destroy();
              openvpn.removeAllListeners();
              reject();
          });

          openvpn.on('console-output', function(output) {
              log.info(output);
          });

      });

    },

    updateIp: function () {
      return new Promise((resolve, reject) => {

          myip.status(function(error, response, body) {
              vpnActions.newIp(JSON.parse(body));
              resolve();
          });

      });
    },

    checkRunning: function () {
      return new Promise((resolve, reject) => {
          var pid = false;
          try {
              pid = fs.readFileSync(path.join(util.supportDir(), 'openvpn.pid')) || false;
          } catch (err) {}

          if (pid && running(Number(pid))) {
              log.info('Previous openvpn status still running, PID: '+pid);
              resolve(true);
          } else {
              resolve(false);
          }
      });
    }

}
