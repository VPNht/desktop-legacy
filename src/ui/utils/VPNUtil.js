import _ from 'lodash';
import path from 'path';
import assign from 'object-assign';
import request from 'request';
import fs from 'fs';

import openvpnmanager from 'node-openvpn';

import util from './Util';
import myip from './MyipUtil';
import config from '../../config';
import helpers from './VPNHelpers';

import log from '../stores/LogStore';
import vpnActions from '../actions/VPNActions';

let GENCONFIG_ENDPOINT = process.env.GENCONFIG_ENDPOINT || 'https://vpn.ht/openvpn-desktop';

var currentOSLib;
var openvpn;
var _args;

switch (process.platform) {
    case 'darwin':
        currentOSLib = require('./VPNUtilMac');
        break;
    case 'win32':
        currentOSLib = require('./VPNUtilWindows');
        break;
    case 'linux':
        break;
};

module.exports = assign(currentOSLib, {

    generateConfig: function(managementPort) {
        return new Promise((resolve, reject) => {

            let server = _args.server;

            let encryption = config.get('encryption');
            let autoPath = config.get('autoPath');
            let port = config.get('customPort');
            let smartdns = true;
            let platform = process.platform;
            let disableSmartdns = config.get('disableSmartdns');

            if (disableSmartdns) {
                smartdns = 'disable';
            }

            //        if (onlySmartdns) {
            //            smartdns = 'only';
            //        }

            if (autoPath) {
                port = 'autoPath';
            }

            request.get(`${GENCONFIG_ENDPOINT}/${server}/${managementPort}/${port}/${encryption}/${smartdns}/${platform}`, (error, response, body) => {

                let configPath = path.resolve(process.env.CONFIG_PATH, 'config.ovpn');
                fs.writeFileSync(configPath, body);
                resolve(configPath);

            });

        });
    },

    connectWithConsole: function() {
        return new Promise((resolve, reject) => {

            var port = fs.readFileSync(path.join(util.supportDir(), 'openvpn.port'));

            var opts = {
                host: 'localhost',
                port: Number(port),
                timeout: 1500
            };

            var auth = {
                user: _args.username,
                pass: _args.password,
            };

            openvpn = openvpnmanager.connect(opts);

            openvpn.on('connected', function() {
                openvpnmanager.authorize(auth);
            });

            openvpn.on('pid', function(pid) {
                fs.writeFileSync(path.join(util.supportDir(), 'openvpn.pid'), Number(pid));
            });

            openvpn.on('state-change', function(state) {
                if (state[1] == 'CONNECTED') {


                    // update IP
                    vpnActions.checkIp();

                    log.info('Connection successful');
                    resolve();

                } else if (state[1] == 'EXITING') {

                    // auth failed
                    if (state[2] == 'auth-failure') {
                        log.error('Invalid credentials');
                        vpnActions.invalidCredentials();
                        openvpn.removeAllListeners();
                        openvpnmanager.destroy();
                        vpnActions.disconnected();
                    }

                    // process killed
                    if (state[2] == 'exit-with-notification') {
                        log.info('Disconnected');
                        openvpn.removeAllListeners();
                        openvpnmanager.destroy();
                        vpnActions.disconnected();
                        if (process.platform == 'win32') {
                            log.info('Stopping windows service');
                            util.exec(['net', 'stop', 'openvpnservice']);
                        }
                    }

                }
            });

            // error from the openvpn logs
            openvpn.on('error', function(error) {
                alert(error);
                openvpnmanager.destroy();
                openvpn.removeAllListeners();
                vpnActions.disconnected();
            });

            // catch event from the telnet connection
            openvpn.on('end', function(error) {
                openvpnmanager.destroy();
                openvpn.removeAllListeners();
                vpnActions.disconnected();
            });

            openvpn.on('hold-waiting', function() {
                openvpnmanager.cmd('hold release');
            });

            openvpn.on('console-output', function(output) {
                log.info(output);
            });

            openvpn.on('bytecount', function(bytes) {
                vpnActions.bytecount(bytes);
            });

        });
    },

    connect: function(args) {

        _args = args; // don't remove

        log.info("\n\n----------------------\nConnecting to " + args.server.value + "\n");

        return helpers.checkRunning()
            .then(this.stopProcess)
            .then(helpers.managementPort)
            .then(this.generateConfig)
            .then(this.launchProcess)
            .then(this.connectWithConsole);
    },

    disconnect: function() {
        return openvpnmanager.disconnect();
    },

    initCheck: function() {
        var self = this;

        log.info("\n\n----------------------\nWaiting app to be ready\n");

        return helpers.checkRunning()
            .then(this.stopProcess)
            .then(myip.fetch)
            .then(function() {

                if (process.platform == 'win32') {

                    // we need to validate windows service
                    self.serviceStatus()
                        .then(function(status) {

                            if (status) {
                                util.exec(['net', 'stop', 'openvpnservice'])
                                    .then(function() {
                                        log.info('VPNUtil.init - App ready');
                                        vpnActions.appReady();
                                    })
                                    .catch(function() {
                                        log.warn('VPNUtil.init - App ready with error');
                                        vpnActions.appReady();
                                    });
                            } else {
                                log.info('VPNUtil.init - App ready');
                                vpnActions.appReady();
                            }
                        });

                } else {
                    log.info('VPNUtil.init - App ready');
                    vpnActions.appReady();
                }


            });
    }

});