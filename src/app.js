require.main.paths.splice(0, 0, process.env.NODE_PATH);
import {remote, ipcRenderer, shell} from 'electron';
import os from 'os';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import metrics from './ui/utils/MetricsUtil';
import VPN from './ui/utils/VPNUtil';
import vpnActions from './ui/actions/VPNActions';
import Menu from './menu';
import webUtil from './ui/utils/WebUtil';
import request from 'request';
import path from 'path';
import log from './ui/stores/LogStore';
import LogActions from './ui/actions/LogActions';
import accountStore from './ui/stores/AccountStore';
import utils from './ui/utils/Util';
import Credentials from './ui/utils/CredentialsUtil';
import config from './config';
import { render as prettifyObject } from 'prettyjson';

var app = remote.app;

// Init process



VPN.initCheck();
webUtil.addLiveReload();
webUtil.addBugReporting();
webUtil.disableGlobalBackspace();

metrics.track('Started App');
metrics.track('app heartbeat');
setInterval(function() {
    metrics.track('app heartbeat');
}, 14400000);

// React UI is fully initialized
ipcRenderer.on( 'ui.ready', () => {
    const interfaces = prettifyObject( os.networkInterfaces(), {noColor: true} );
    const totalMemory = os.totalmem() / 1024 / 1024 / 1024;
    const freeMemory = os.freemem() / 1024 / 1024 / 1024;
    const system = prettifyObject({
        'release': os.release(),
        'type': os.type(),
        'arch': os.arch(),
        'loadAvg': os.loadavg(),
        'total memory': `${totalMemory}GB`,
        'free memory': `${freeMemory}GB`,
        'cpus': os.cpus().length
    }, {noColor: true});

    LogActions.addInfo( `Launching VPN.ht Application ${app.getVersion()}` );
    LogActions.addInfo( `Network Interfaces:\n${interfaces}` );
    LogActions.addInfo( `Operating System ${system}`);
});

//
const AVAILABLE_PAGES = {
    account: {
        action: 'Opened Billing on VPN.ht',
        url: 'https://billing.vpn.ht/clientarea.php?action=services'
    },
    support: {
        action: 'Opened Support on VPN.ht',
        url: 'https://billing.vpn.ht/knowledgebase.php'
    },
    issue: {
        action: 'Opened Issue Reporter',
        url: 'https://github.com/vpnht/desktop/issues/new'
    },
    about: {
        action: 'Opened About',
        url: '#/about'
    }
};

ipcRenderer.on( 'open', (e, name, openInBrowser) => {
    const { action, url } = _.get( AVAILABLE_PAGES, name, {} );

    if( !action || !url ) {
        return;
    }

    if( openInBrowser ) {
        shell.openExternal( url );
    }
    else {
        window.location = url;
    }

    metrics.track( action, { from: 'menu' });
});

ipcRenderer.on( 'toggle', () => {
    ipcRenderer.emit( remote.getCurrentWindow().isVisible() ? 'hide': 'show' );
});

ipcRenderer.on( 'show', () => {
    remote.getCurrentWindow().show();
});

ipcRenderer.on( 'hide', () => {
    remote.getCurrentWindow().hide();
});

ipcRenderer.on( 'connect', () => {
});

ipcRenderer.on( 'disconnect', () => {
});

ipcRenderer.on( 'quit', () => {
    app.quit();
});

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
            server: config.get('server') || 'hub.vpn.ht'
        });
    } else {
        LogActions.addError('No user/pass saved in the hash.\n\nTIPS: Try to connect manually first to save your data.')
    }
});

ipcRenderer.on('application:vpn-check-disconnect', () => {
    if (accountStore.getState().connecting || accountStore.getState().connected) {
        LogActions.addInfo( 'Disconnecting before closing application' );
        vpnActions.disconnect();
    } else {
        vpnActions.disconnected();
    }
});

ipcRenderer.on('application:vpn-check-sleep', () => {
    if (accountStore.getState().connected) {
        LogActions.addInfo( 'Trying to reconnect after sleep' );
        if (Credentials._config()) {
            vpnActions.connect({
                username: Credentials.get().username,
                password: Credentials.get().password,
                server: config.get('server') || 'hub.vpn.ht'
            });
        } else {
            LogActions.addInfo( 'No user/pass saved in the hash. Disconnecting.' );
            vpnActions.disconnect();
        }
    }
});

ipcRenderer.on('application:vpn-disconnect', () => {
    vpnActions.disconnect();
});