import { ipcMain, Tray, Menu } from 'electron';
import T from 'i18n-react';

const createDisconnectedMenu = (emitter) => Menu.buildFromTemplate([
    {
        label: `${T.translate( 'Toggle' )} VPN.ht`,
        click: () => emitter.send( 'toggle' )
    },
    {
        type: 'separator'
    },
    {
        label: T.translate( 'Connect' ),
        click: () => emitter.send( 'connect' )
    },
    {
        label: T.translate( 'Disconnect' ),
        click: () => emitter.send( 'disconnect' ),
        enabled: false
    },
    {
        type: 'separator'
    },
    {
        label: T.translate( 'Quit' ),
        click: () => emitter.send( 'quit' )
    }
]);

const createConnectingMenu = (emitter) => Menu.buildFromTemplate([
    {
        label: T.translate( 'Show Window' ),
        click: () => emitter.send( 'show' )
    },
    {
        type: 'separator'
    },
    {
        label: T.translate( 'Cancel Connecting...' ),
        click: () => emitter.send( 'disconnect' )
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
        click: () => emitter.send( 'quit' )
    }
]);

const createConnectedMenu = (emitter) => Menu.buildFromTemplate([
    {
        label: T.translate( 'Show Window' ),
        click: () => emitter.send( 'show' )
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
        click: () => emitter.send( 'disconnect' )
    },
    {
        type: 'separator'
    },
    {
        label: T.translate( 'Quit' ),
        click: () => emitter.send( 'quit' )
    }
]);

const initialize = (mainWindow) => {
    const menus = {
        "disconnected": createDisconnectedMenu( mainWindow.webContents ),
        "connecting": createConnectingMenu( mainWindow.webContents ),
        "connected": createConnectedMenu( mainWindow.webContents )
    };

    const tray = new Tray( `${__dirname}/tray_disconnected.png` );

    tray.on('double-click', () => {
        ipcMain.emit('tray:double-click');
    });

    ipcMain.on( 'tray:set', (status) => {
        const menu = menus[status];
        tray.setContextMenu( menu );
        tray.setImage( `${__dirname}/tray_disconnected.png` );
        tray.setToolTip( T.translate( status ) );
    });
}

export default initialize;