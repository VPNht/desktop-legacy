import {Menu, MenuItem, ipcMain, Tray} from 'electron';

var trayMenuDisconnected = null;
var trayMenuConnected = null;
var trayMenuConnecting = null;

// Define a function to set up our tray icon
exports.init = function(helper) {

    ipcMain.on('localization.ready', function localize (e, arg) {
        let t = JSON.parse(arg);

        // Disconnected State
        trayMenuDisconnected = new Menu();
        trayMenuDisconnected.append(new MenuItem({
            label: t['Toggle'] + ' VPN.ht',
            click: helper.toggleVisibility
        }));
        trayMenuDisconnected.append(new MenuItem({
            type: 'separator'
        }));
        trayMenuDisconnected.append(new MenuItem({
            label: t['Connect'],
            click: helper.connect
        }));
        trayMenuDisconnected.append(new MenuItem({
            label: t['Disconnect'],
            enabled: false
        }));
        trayMenuDisconnected.append(new MenuItem({
            type: 'separator'
        }));
        trayMenuDisconnected.append(new MenuItem({
            label: t['Quit'],
            click: helper.quit
        }));

        // Connected State
        trayMenuConnected = new Menu();
        trayMenuConnected.append(new MenuItem({
            label: t['Show Window'],
            click: helper.toggleVisibility
        }));
        trayMenuConnected.append(new MenuItem({
            type: 'separator'
        }));
        trayMenuConnected.append(new MenuItem({
            label: t['Connect'],
            enabled: false
        }));
        trayMenuConnected.append(new MenuItem({
            label: t['Disconnect'],
            click: helper.disconnect
        }));
        trayMenuConnected.append(new MenuItem({
            type: 'separator'
        }));
        trayMenuConnected.append(new MenuItem({
            label: t['Quit'],
            click: helper.quit
        }));

        // Connecting State
        trayMenuConnecting = new Menu();
        trayMenuConnecting.append(new MenuItem({
            label: t['Show Window'],
            click: helper.toggleVisibility
        }));
        trayMenuConnecting.append(new MenuItem({
            type: 'separator'
        }));
        trayMenuConnecting.append(new MenuItem({
            label: t['Cancel connecting...'],
            click: helper.disconnect
        }));
        trayMenuConnecting.append(new MenuItem({
            label: t['Disconnect'],
            enabled: false
        }));
        trayMenuConnecting.append(new MenuItem({
            type: 'separator'
        }));
        trayMenuConnecting.append(new MenuItem({
            label: t['Quit'],
            click: helper.quit
        }));

        var tray = new Tray(__dirname + '/tray.png');
        tray.setContextMenu(trayMenuDisconnected);

        tray.on('clicked', helper.toggleVisibility);

        ipcMain.on('vpn.connected', function handleConnected() {
            tray.setContextMenu(trayMenuConnected);
            tray.setImage(__dirname + '/tray_connected.png');
            tray.setToolTip(t['Connected']);
        });

        ipcMain.on('vpn.connecting', function handleConnecting() {
            tray.setContextMenu(trayMenuConnecting);
            tray.setImage(__dirname + '/tray_connecting.png');
            tray.setToolTip(t['Connecting...']);
        });

        ipcMain.on('vpn.disconnected', function handleDisconnected() {
            tray.setContextMenu(trayMenuDisconnected);
            tray.setImage(__dirname + '/tray.png');
            tray.setToolTip(t['Disconnected']);
        });
    });
};
