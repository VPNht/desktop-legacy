var vpnUtil;

import {ipcRenderer} from 'electron';
import alt from '../alt';
import log from '../stores/LogStore';
import config from '../../config';
import Credentials from '../utils/CredentialsUtil';

class VPNActions {

    constructor() {
        this.generateActions(
            'newIp', // called when we received a new ip
            'bytecount',
            'processStarted',
            'processKilled'
        );
    }

    connect(args) {
        return function(dispatch) {
            // set tray in connecting state
            ipcRenderer.send('vpn.connecting');

            vpnUtil = require('../utils/VPNUtil');
            dispatch();

            vpnUtil.connect(args)
                .then(() => {
                    log.info('VPNAction.connect() done');
                    // update tray
                    ipcRenderer.send('vpn.connected');
                    this.connected();
                })
                .catch((error) => {
                    console.log(error);
                    log.error('Unable to launch process');
                    this.disconnected();

                });
        };
    }

    disconnect() {
        return function(dispatch) {
            vpnUtil = require('../utils/VPNUtil');
            dispatch();
            vpnUtil.disconnect()
                .then(() => {

                    log.info('Waiting EXITING state');

                })
                .catch((error) => {

                    log.error('Unable to disconnect');
                    console.log(error);

                });
        };
    }

    checkIp() {
        return function(dispatch) {
            var helpers = require('../utils/VPNHelpers');
            dispatch();
            helpers.updateIp()
                .then(() => {

                    log.info('IP Updated');

                })
                .catch((error) => {

                    log.error('Unable to update IP');
                    console.log(error);

                });
        };
    }

    invalidCredentials() {
        return function(dispatch) {
            dispatch();
            alert('Invalid credentials');
        };
    }

    appReady() {
        return function(dispatch) {
            dispatch();
            if (config.get('connectLaunch') === 'true' && Credentials._config()) {
                log.info('Auto-connect on launch');
                this.connect({
                    username: Credentials.get().username,
                    password: Credentials.get().password,
                    server: config.get('server') || 'hub.vpn.ht'
                });
            }
        };
    }

    // used by tray
    disconnected() {
        return function(dispatch) {
            dispatch();
            ipcRenderer.send('vpn.disconnected');

            // on windows we need to stop the service
            if (process.platform == 'win32') {
                require('../utils/Util').exec(['net', 'stop', 'openvpnservice'])
            }
        };
    }

    connected() {
        return function(dispatch) {
            dispatch();
            ipcRenderer.send('vpn.connected');
        };
    }


}

export default alt.createActions(VPNActions);