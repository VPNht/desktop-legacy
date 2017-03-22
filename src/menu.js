import { remote, shell } from 'electron';
import EventEmitter from 'events';
import T from 'i18n-react';

const SPECIAL_KEY = process.platform == 'darwin' ? 'Command' : 'Ctrl';

const { Menu } = remote;

const createMenu = (emitter) => Menu.buildFromTemplate([
    {
        label: 'VPN.ht',
        submenu: [
            {
                label: T.translate( 'Manage account' ),
                click: () => emitter.emit( 'open', 'account', true )
            },
            {
                type: 'separator'
            },
            {
                label: T.translate( 'Quit' ),
                click: () => emitter.emit( 'quit' )
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: T.translate( 'Hide' ) + ' VPN.ht',
                accelerator: `${SPECIAL_KEY}+H`,
                selector: 'hide:'
            }, {
                label: T.translate( 'Hide Others' ),
                accelerator: `${SPECIAL_KEY}+Shift+H`,
                selector: 'hideOtherApplications:'
            }, {
                label: T.translate( 'Show All' ),
                selector: 'unhideAllApplications:'
            }, {
                type: 'separator'
            }, {
                label: T.translate( 'Toggle DevTools' ),
                accelerator: `Alt+${SPECIAL_KEY}+I`,
                click: () => remote.getCurrentWindow().toggleDevTools()
            }
        ]
    },
    {
        label: T.translate( 'Window' ),
        submenu: [
            {
                label: T.translate( 'Minimize' ),
                selector: 'performMiniaturize:'
            },
            {
                label: T.translate( 'Close' ),
                click: () => emitter.emit( 'quit' )
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
                click: () => emitter.emit( 'open', 'support', true )
            },
            {
                label: T.translate( 'Report Issue or Suggest Feedback' ),
                click: () => emitter.emit( 'open', 'issue', true )
            },
            {
                type: 'separator'
            },
            {
                label: T.translate( 'About' ),
                accelerator: `${SPECIAL_KEY}+I`,
                click: () => emitter.emit( 'open', 'about', false )
            }
        ]
    }
]);

class ApplicationMenu extends EventEmitter {
    constructor() {
        super();

        this.menu = createMenu( this );
        Menu.setApplicationMenu( this.menu );
    }
}

export default ApplicationMenu;