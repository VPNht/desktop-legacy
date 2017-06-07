import { app, ipcMain, BrowserWindow } from 'electron';
import path from 'path';
import yargs from 'yargs';
import isDevelopment from 'electron-is-dev';
import config from './config';
import createApplicationMenu from './menu';
import createApplicationTray from './tray';
import ConnectionStore from './ui/stores/ConnectionStore';

// Update application paths
let args = yargs(process.argv.slice(1)).wrap(100).argv;

process.env.NODE_PATH = path.join(__dirname, 'node_modules');

if (process.env.NODE_ENV !== 'development') {
    process.env.BIN_PATH = path.join(__dirname, '/../bin');
    process.env.LOG_PATH = path.join(__dirname, '/../log');
    if (process.platform == 'darwin') {
        process.env.CONFIG_PATH = path.join(process.env['HOME'], 'Library', 'Application\ Support', 'VPN.ht');
    } else {
        process.env.CONFIG_PATH = path.join(__dirname, '/../config');
    }
} else {
    process.env.BIN_PATH = path.join(__dirname, '/../resources/bin', process.platform);
    process.env.CONFIG_PATH = path.join(__dirname, '/../resources/config');
    process.env.LOG_PATH = path.join(__dirname, '/../resources/log');
}

// Prevent more than single instance running at the same time
let mainWindow = null;

const isAnotherInstanceRunning = app.makeSingleInstance( (commandLine, workingDirectory) => {
  if( mainWindow ) {
      mainWindow.restore();
      mainWindow.focus();
  }
});

if( isAnotherInstanceRunning ) {
    app.quit();
}

app.on( 'ready', () => {
    if( isAnotherInstanceRunning ) return;

    // Create the window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 850,
        show: false,
        frame: true,
        resizable: false,
        title: 'VPN.ht',
        backgroundColor: '#ededed',
        skipTaskbar: config.get( 'minimizeToTaskbar' ),
        webPreferences: {
            backgroundThrottling: false
        }
    });

    // Load the initial page
    const initialPageURL = path.join( __dirname, 'index.html' );
    mainWindow.loadURL( path.normalize( `file://${initialPageURL}` ) );

    if( isDevelopment ) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on( 'did-finish-load', () => {
        if( !args.hide ) {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    let isDisconnected = true;
    
    const updateDisconnected = (wasDisconnected, hasDisconnected) => {
        if (hasDisconnected == wasDisconnected) return;

        ipcMain.emit( 'tray:set', hasDisconnected ? 'disconnected' : 'connected' );

        isDisconnected = hasDisconnected;
    }
    
    ipcMain.on( 'vpn-connected', () => updateDisconnected( isDisconnected, false ) );
    ipcMain.on( 'vpn-connecting', () => updateDisconnected( isDisconnected, false ) );
    ipcMain.on( 'vpn-disconnected', () => updateDisconnected( isDisconnected, true ) );

    const connectionCheck = setInterval( () => {
        mainWindow.send( 'vpn-check-state' );
    }, 1000 );

    mainWindow.on( 'close', (e) => {
        if (!isDisconnected) {
            e.preventDefault();
            mainWindow.hide();
            mainWindow.webContents.send( 'disconnectAndQuit' );

            ipcMain.on( 'vpn-disconnected', () => {
                app.quit();
            });

            return;
        }

        clearInterval( connectionCheck );
    });

    // Resume after OS wakes up
    const { powerMonitor } = require( 'electron' );

    powerMonitor.on( 'resume', () => {
        mainWindow.webContents.send( 'application:vpn-check-sleep' );
    });

    createApplicationMenu( mainWindow );
    createApplicationTray( mainWindow );

    ipcMain.emit( 'tray:set', 'disconnected' );
});

// Show the window after the page has been loaded
app.on( 'browser-window-created', (e, instance) => {
    instance.show();
});

// Follow the MacOS standard and hide the application when all windows have been closed
app.on( 'window-all-closed', () => {
  if( process.platform != 'darwin' ) {
    app.quit();
  }
});