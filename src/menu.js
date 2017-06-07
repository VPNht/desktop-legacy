import { app, shell, ipcMain, ipcRenderer, BrowserWindow, Menu } from 'electron';
import T from 'i18n-react';

const specialKey = process.platform == 'darwin' ? 'Command' : 'Ctrl';

const createMenu = (emitter) => Menu.buildFromTemplate([
    {
        label: 'VPN.ht',
        submenu: [
            {
                label: T.translate( 'Manage account' ),
                click: () => emitter.send( 'open', 'account', true )
            },
            {
                type: 'separator'
            },
            {
                label: T.translate( 'Quit' ),
                click: () => emitter.send( 'quit' )
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: T.translate( 'Hide' ) + ' VPN.ht',
                accelerator: `${specialKey}+H`,
                selector: 'hide:'
            }, {
                label: T.translate( 'Hide Others' ),
                accelerator: `${specialKey}+Shift+H`,
                selector: 'hideOtherApplications:'
            }, {
                label: T.translate( 'Show All' ),
                selector: 'unhideAllApplications:'
            }
        ]
    },
    {
        label: T.translate( 'Window' ),
        submenu: [
            {
                label: T.translate( 'Minimize' ),
                selector: 'performMiniaturize:',
                click: () => emitter.send( 'minimize' )
            },
            {
                label: T.translate( 'Close' ),
                click: () => emitter.send( 'close' )
            },
            {
                type: 'separator'
            },
            {
                label: T.translate( 'Bring All to Front' ),
                selector: 'arrangeInFront:'
            }
        ]
    },
    {
        label: T.translate( 'Help' ),
        submenu: [
            {
                label: T.translate( 'Support' ),
                click: () => emitter.send( 'open', 'support', true )
            },
            {
                label: T.translate( 'Report Issue or Suggest Feedback' ),
                click: () => emitter.send( 'open', 'issue', true )
            },
            {
                type: 'separator'
            },
            {
                label: T.translate( 'About' ),
                accelerator: `${specialKey}+I`,
                click: () => emitter.send( 'open', 'about', false )
            }
        ]
    }
]);

const initialize = (mainWindow) => {
    const menu = createMenu( mainWindow.webContents );
    Menu.setApplicationMenu( menu );
}

export default initialize;