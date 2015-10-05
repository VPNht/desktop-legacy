import resources from './ResourcesUtil';
import util from './Util';
import path from 'path';
import Winreg from 'winreg';
import Promise from 'bluebird';
import fs from 'fs';
import helpers from './VPNHelpers';
import log from '../stores/LogStore';
import ps from 'xps';

import serviceManager from 'windows-service-manager';

var regKey = new Winreg({
    hive: Winreg.HKCU,
    key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
});

module.exports = {

    launchProcess: function(config) {
        return util.exec(['net', 'start', 'openvpnservice']);
    },

    stopProcess: function(isRunning) {
        if (isRunning) {

            var pid = fs.readFileSync(path.join(util.supportDir(), 'openvpn.pid'));
            var port = fs.readFileSync(path.join(util.supportDir(), 'openvpn.port'));
            log.info('Stopping previous openvpn service PID: ' + pid + ' PORT ' + port);

            return new Promise((resolve) => {

                // try softKill
                helpers.softKill(Number(port))
                    .then(function() {
                        log.info('Process stopped successfully');

                        util.exec(['net', 'stop', 'openvpnservice'])
                            .then(function() {
                                log.info('Service stopped successfully');
                                resolve();
                            })
                            .catch(function() {
                                log.info('Service not running');
                                resolve();
                            });

                    })
                    .catch(function() {
                        log.info('We have to stop the service manually');
                        module.exports.hardKillProcess('openvpnservice.exe')
                            .then(resolve)
                            .catch(reject);
                    })

            });
        } else {
            return Promise.resolve();
        }
    },
    hardKillProcess: function(name) {
        return new Promise((resolve, reject) => {
            module.exports.checkProcessRunning(name).then(function(task) {
                var taskon = task ? true : false;
                if (taskon)
                    ps.kill(task.pid).fork(
                        function(error) {
                            reject(error);
                        },
                        function() {
                            log.info('FORCE KILLING: ' + task.name + ' PID: ' + task.pid);
                            resolve();
                        }
                    );
                else
                    resolve();
            });
        });
    },
    checkProcessRunning: function(name) {
        return new Promise((resolve, reject) => {
            ps.list().fork(
                function(error) {
                    reject(error)
                },
                function(processes) {
                    resolve(_.filter(processes, function(value) {
                        if (value.name === name) {
                            return value;
                        }
                    })[0]);
                }
            );
        });
    },
    enableStartOnBoot: function() {
        return new Promise((resolve) => {
            regKey.set('VPNht', Winreg.REG_SZ, "\"" + require('remote').require('app').getPath('exe') + "\"", function() {
                resolve();
            });
        });
    },

    disableStartOnBoot: function() {
        return new Promise((resolve) => {
            regKey.remove('VPNht', function() {
                resolve();
            });
        });
    },

    statusStartOnBoot: function() {
        return new Promise((resolve) => {
            regKey.get('VPNht', function(error, item) {
                resolve(item != null);
            });
        });
    },

    serviceStatus: function() {
        return new Promise((resolve) => {
            serviceManager.queryService('openvpnservice', function(err, service) {
                if (err) {
                    resolve(false);
                } else {
                    if (service.state == 4) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });

    }

};