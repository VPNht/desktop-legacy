import { app, ipcMain, BrowserWindow } from 'electron';
import path from 'path';
import yargs from 'yargs';
import isDevelopment from 'electron-is-dev';
import createApplicationMenu from './menu';
import createApplicationTray from './tray';

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

// Disconnect before quitting
let isDisconnected = true;
ipcMain.on( 'vpn.connected', () => isDisconnected = false );
ipcMain.on( 'vpn.connecting', () => isDisconnected = false );
ipcMain.on( 'vpn.disconnected', () => isDisconnected = true );

app.on( 'before-quit', (e) =>  {
    if( !isDisconnected ) {
        e.preventDefault();
        mainWindow.webContents.send( 'application:vpn-check-disconnect' );
        ipcMain.once( 'vpn.disconnected', () => app.quit() );
    }
});