import resources from './ResourcesUtil';
import util from './Util';
import path from 'path';
import Promise from 'bluebird';
import log from '../stores/LogStore';
import fs from 'fs';
import running from 'is-running';
import helpers from './VPNHelpers';

module.exports = {

  launchProcess: function (config) {
    return util.exec([
        path.join(resources.resourceDir(), 'openvpn'),
        '--config', config,
        '--script-security', '2',
        '--up', path.join(resources.resourceDir(), 'script.up.launch'),
        '--down', path.join(resources.resourceDir(), 'script.down.launch'),
        '--daemon'
    ]);
  },

  stopProcess: function (isRunning) {
    if (isRunning) {

        var pid = fs.readFileSync(path.join(util.supportDir(), 'openvpn.pid'));
        var port = fs.readFileSync(path.join(util.supportDir(), 'openvpn.port'));

        log.info('Stopping previous openvpn service PID: ' + pid + ' PORT ' + port);

        return new Promise((resolve) => {
            helpers.softKill(Number(port))
                .then(function() {

                    // checking if process stopped as security
                    if (running(Number(pid))) {
                        // process running
                        log.info('Process still running, running manual kill');
                        util.exec(['kill', '-9', Number(pid)])
                            .then(function() {
                                log.info('Process stopped successfully');
                                resolve();
                            });
                    } else {
                        // process stopped
                        log.info('Process stopped successfully');
                        resolve();
                    }
                })
                .catch(function() {
                    log.info('We have to kill the process manually');
                    util.exec(['kill', '-9', Number(pid)])
                        .then(function() {
                            resolve();
                        });
                })
        });

    } else {
        return Promise.resolve();
    }
  },

  enableStartOnBoot: function(hidden) {
    return util.exec([
        'osascript',
        path.join(resources.resourceDir(), 'scripts/LoginItemAdd.scpt'),
        'VPN.ht'
    ]);
  },

  disableStartOnBoot: function() {
    return util.exec([
        'osascript',
        path.join(resources.resourceDir(), 'scripts/LoginItemRemove.scpt'),
        'VPN.ht'
    ]);
  },

  statusStartOnBoot: function() {
    return util.exec([
        'osascript',
        path.join(resources.resourceDir(), 'scripts/LoginItemCheck.scpt')
    ]).then(function(stdout) {
        return stdout == 1 ? true : false;
    });
  }

};
