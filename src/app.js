require.main.paths.splice(0, 0, process.env.NODE_PATH);

import {remote, ipcRenderer, shell} from 'electron';
import os from 'os';
import _ from 'lodash';
import { render as prettifyObject } from 'prettyjson';
import React from 'react';
import ReactDOM from 'react-dom';
import ConnectionStore from './ui/stores/ConnectionStore';
import ConnectionActions from './ui/actions/ConnectionActions';
import ServersActions from './ui/actions/ServersActions';
import LogActions from './ui/actions/LogActions';
import config from './config';
import webUtil from './ui/utils/WebUtil';

var app = remote.app;

webUtil.addLiveReload();
webUtil.disableGlobalBackspace();

// React UI is fully initialized
ipcRenderer.on( 'ui.ready', async () => {
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

    ServersActions.fetchServers();
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

ipcRenderer.on( 'minimize', () => {
    remote.getCurrentWindow().minimize();
});

ipcRenderer.on( 'close', () => {
    remote.getCurrentWindow().close();
});

ipcRenderer.on( 'disconnectAndQuit', () => {
    ConnectionActions.disconnect();
    ipcRenderer.send( 'vpn-disconnected' );
});

//
ipcRenderer.on( 'vpn-check-state', () => {
    const { status } = ConnectionStore.getState();
    ipcRenderer.send( `vpn-${status}` );
});

// Define styles
document.getElementById('root').classList = [process.platform];