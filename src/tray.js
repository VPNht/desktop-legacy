import { webContents, ipcMain, Tray, Menu } from 'electron';
import T from 'i18n-react';
import EventEmitter from 'events';

const createDisconnectedMenu = (emitter) => Menu.buildFromTemplate([
    {
        label: `${T.translate( 'Toggle' )} VPN.ht`,
        click: () => emitter.emit( 'toggle' )
    },
    {
        type: 'separator'
    },
    {
        label: T.translate( 'Connect' ),
        click: () => emitter.emit( 'connect' )
    },
    {
        label: T.translate( 'Disconnect' ),
        click: () => emitter.emit( 'disconnect' )
    },
    {
        type: 'separator'
    },
    {
        label: T.translate( 'Quit' ),
        click: () => emitter.emit( 'quit' )
    }
]);

const createConnectingMenu = (emitter) => Menu.buildFromTemplate([
    {
        label: T.translate( 'Show Window' ),
        click: () => emitter.emit( 'show' )
    },
    {
        type: 'separator'
    },
    {
        label: T.translate( 'Cancel Connecting...' ),
        click: () => emitter.emit( 'disconnect' )
    },
    {
        label: T.translate( 'Disconnect' ),
        enabled: false
    },
    {
        type: 'separator'
    },
    {
        label: T.translate( 'Quit' ),
        click: () => emitter.emit( 'quit' )
    }
]);

const createConnectedMenu = (emitter) => Menu.buildFromTemplate([
    {
        label: T.translate( 'Show Window' ),
        click: () => emitter.emit( 'show' )
    },
    {
        type: 'separator'
    },
    {
        label: T.translate( 'Connect' ),
        enabled: false
    },
    {
        label: T.translate( 'Disconnect' ),
        click: () => emitter.emit( 'disconnect' )
    },
    {
        type: 'separator'
    },
    {
        label: T.translate( 'Quit' ),
        click: () => emitter.emit( 'quit' )
    }
]);

class ApplicationTray extends EventEmitter {
    constructor() {
        super();

        this.tray = new Tray( __dirname + '/tray_disconnected.png' );
        this.menus = {
            "disconnected": createDisconnectedMenu( this ),
            "connecting": createConnectingMenu( this ),
            "connected": createConnectedMenu( this )
        };
    }

    setMenu( status ) {
        this.tray.setContextMenu( this.menus[status] );
        this.tray.setImage( __dirname + '/tray_disconnected.png' );
        this.tray.setToolTip( T.translate( status ) );
    }
}

export default ApplicationTray;