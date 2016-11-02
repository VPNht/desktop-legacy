import {app, BrowserWindow, ipcMain, screen, dialog} from 'electron';
import os from 'os';
import net from 'net';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import trayTemplate from './app-tray'
import Updater from 'autoupdater'
import yargs from 'yargs';
import util from './utils/Util';

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

var settingsjson = {};
try {
    settingsjson = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings.json'), 'utf8'));
} catch (err) {}

var openURL = null;
app.on('open-url', function(event, url) {
    event.preventDefault();
    openURL = url;
});

app.on('ready', function() {

    var checkingQuit = false;
    var canQuit = false;
    var size = screen.getPrimaryDisplay().workAreaSize;
    var autoUpdater = new Updater({
        currentVersion: app.getVersion()
    });

    var windowSize = {
        width: 800,
        height: process.platform === 'win32' ? 900 : 870
    };

    if (size.height !== 870) {
        windowSize.width = 800;
        windowSize.height = 600;
    }

    var mainWindow = new BrowserWindow({
        width: windowSize.width,
        height: windowSize.height,
        'standard-window': false,
        resizable: false,
        frame: process.platform === 'win32', //only on Windows
        show: false,
        titleBarStyle: 'hidden-inset',
        backgroundColor: '#ededed', // to enable subpixel anti-aliasing, since electron 0.37.3
        webPreferences: {
            backgroundThrottling: false // disable throttling rendering when not focused
        }
    });

    //DEBUG: mainWindow.webContents.openDevTools();

    var preventMultipleInstances = function() {
        var socket = (process.platform === 'win32') ? '\\\\.\\pipe\\vpnht-sock' : path.join(os.tmpdir(), 'vpnht.sock');
        var client = net.connect({
            path: socket
        }, function() {
            var errorMessage = 'Another instance of VPN.ht is already running. Only one instance of the app can be open at a time.'
            dialog.showMessageBox(mainWindow, {
                'type': 'error',
                message: errorMessage,
                buttons: ['OK']
            }, function() {
                client.end();
                process.exit(0);
            })
        }).on('error', function(err) {

            if (process.platform !== 'win32') {
                // try to unlink older socket if it exists, if it doesn't,
                // ignore ENOENT errors
                try {
                    fs.unlinkSync(socket);
                } catch (e) {
                    if (e.code !== 'ENOENT') {
                        throw e;
                    }
                }
            }

            var server = net.createServer(function(connection) {
                connection.on('data', function(data) {
                    mainWindow.focus();
                    mainWindow.webContents.send('options', JSON.parse(data));
                });
            });

            server.listen(socket);
            mainWindow.loadURL(path.normalize('file://' + path.join(__dirname, 'index.html')));
        });
    }

    preventMultipleInstances(mainWindow);

    app.on('before-quit', function(event) {
        if (!canQuit) {
            event.preventDefault();
            if (!checkingQuit) {
                checkingQuit = true;
                mainWindow.webContents.send('application:vpn-check-disconnect');
                ipcMain.on('vpn.disconnected', () => {
                    canQuit = true;
                    app.quit();
                });
            }
        }
    });

    // powerMonitor cannot be required before 'ready' event is fired: https://github.com/electron/electron/blob/master/docs/api/power-monitor.md
    require('electron').powerMonitor.on('resume', function() {
        mainWindow.webContents.send('application:vpn-check-sleep');
    });

    app.on('activate-with-no-open-windows', function() {
        if (mainWindow) {
            mainWindow.show();
        }
        return false;
    });

    var updating = false;

    if (os.platform() === 'win32') {
        mainWindow.on('close', function() {
            mainWindow.webContents.send('application:quitting');
            return true;
        });
        app.on('window-all-closed', function() {
            app.quit();
        });
    }

    mainWindow.webContents.on('new-window', function(e) {
        e.preventDefault();
    });

    mainWindow.webContents.on('will-navigate', function(e, url) {
        if (url.indexOf('build/index.html#') < 0) {
            e.preventDefault();
        }
    });

    mainWindow.webContents.on('did-finish-load', function() {

        console.log('ready')
        mainWindow.setTitle('VPN.ht');

        if (!args.hide) {
            mainWindow.show();
            mainWindow.focus();
        }
        if (openURL) {
            mainWindow.webContents.send('application:open-url', {
                url: openURL
            });
        }
        app.on('open-url', function(event, url) {
            event.preventDefault();
            mainWindow.webContents.send('application:open-url', {
                url: url
            });
        });
    });


    // auto update
    autoUpdater.on("download", function(version) {
        console.log("Downloading " + version)
    });

    autoUpdater.on("updateReady", function(updaterPath) {
        console.log("Launching " + updaterPath);
        dialog.showMessageBox(mainWindow, {
            'type': 'info',
            message: 'A new version is available, do you want to install now ?',
            buttons: ['Yes', 'No']
        }, function(response) {

            if (response === 0) {
                if (process.platform == 'win32') {
                    util.exec('start ' + updaterPath).then(function(stdOut) {
                        console.log(stdOut);
                        process.exit(0);
                    });
                } else {
                    child_process.spawn('open', [updaterPath], {
                        detached: true,
                        stdio: ['ignore', 'ignore', 'ignore']
                    });
                    process.exit(0);
                }
            }


        })

    });

    autoUpdater.on('error', function(err) {
        console.log('An error occured while checking for updates.');
        console.log(err);
    });

    var helper = {
        toggleVisibility: function() {
            if (mainWindow) {
                var isVisible = mainWindow.isVisible();
                if (isVisible) {
                    if (process.platform == 'darwin') {
                        app.dock.hide();
                    }
                    mainWindow.hide();
                } else {
                    if (process.platform == 'darwin') {
                        app.dock.show();
                    }
                    mainWindow.show();
                }
            }
        },
        disconnect: function() {
            var isVisible = mainWindow.isVisible();
            if (!isVisible) {
                helper.toggleVisibility();
            }
            mainWindow.webContents.send('application:vpn-disconnect');
        },
        connect: function() {
            var isVisible = mainWindow.isVisible();
            if (!isVisible) {
                helper.toggleVisibility();
            }
            mainWindow.webContents.send('application:vpn-connect');
        },
        quit: function() {
            app.quit();
        }
    };

    // do not trigger for nothing
    if (process.env.NODE_ENV !== 'development') {
        autoUpdater.update();
    }

    trayTemplate.init(helper);
});