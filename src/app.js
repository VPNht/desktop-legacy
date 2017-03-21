require.main.paths.splice(0, 0, process.env.NODE_PATH);
import {remote, ipcRenderer} from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import metrics from './ui/utils/MetricsUtil';
import VPN from './ui/utils/VPNUtil';
import vpnActions from './ui/actions/VPNActions';
import template from './menutemplate';
import webUtil from './ui/utils/WebUtil';
import request from 'request';
import path from 'path';
import log from './ui/stores/LogStore';
import accountStore from './ui/stores/AccountStore';
import utils from './ui/utils/Util';
import Credentials from './ui/utils/CredentialsUtil';
import Settings from './ui/utils/SettingsUtil';

var app = remote.app;
var Menu = remote.Menu;

// Init process
log.initLogs(app.getVersion());
VPN.initCheck();
webUtil.addLiveReload();
webUtil.addBugReporting();
webUtil.disableGlobalBackspace();
Menu.setApplicationMenu(Menu.buildFromTemplate(template()));
metrics.track('Started App');
metrics.track('app heartbeat');
setInterval(function() {
    metrics.track('app heartbeat');
}, 14400000);

ipcRenderer.on('application:quitting', () => {});

// Define styles
document.getElementById('root').classList = [process.platform];

// Event fires when the app receives a vpnht:// URL
ipcRenderer.on('application:open-url', opts => {
    console.log('open', opts);
});

ipcRenderer.on('application:vpn-connect', () => {
    if (Credentials._config()) {
        vpnActions.connect({
            username: Credentials.get().username,
            password: Credentials.get().password,
            server: Settings.get('server') || 'hub.vpn.ht'
        });
    } else {
        log.error('No user/pass saved in the hash.\n\nTIPS: Try to connect manually first to save your data.')
    }
});

ipcRenderer.on('application:vpn-check-disconnect', () => {
    if (accountStore.getState().connecting || accountStore.getState().connected) {
        log.info('Disconnecting before closing application');
        vpnActions.disconnect();
    } else {
        vpnActions.disconnected();
    }
});

ipcRenderer.on('application:vpn-check-sleep', () => {
    if (accountStore.getState().connected) {
        log.info('Trying to reconnect after sleep');
        if (Credentials._config()) {
            vpnActions.connect({
                username: Credentials.get().username,
                password: Credentials.get().password,
                server: Settings.get('server') || 'hub.vpn.ht'
            });
        } else {
            log.info('No user/pass saved in the hash. Disconnecting.');
            vpnActions.disconnect();
        }
    }
});

ipcRenderer.on('application:vpn-disconnect', () => {
    vpnActions.disconnect();
});