import {
  app,
  autoUpdater,
  BrowserWindow,
  ipcMain,
  Menu,
  powerMonitor,
  screen,
  shell,
  Tray
} from 'electron';

let menu = null;
let template = null;
let tray = null;
let mainWindow = null;
let checkingQuit = false;
let canQuit = false;
// const autoUpdater = new Updater({
//   currentVersion: app.getVersion()
// });

if (process.env.NODE_ENV === 'development') require('electron-debug')();

app.on('activate-with-no-open-windows', () => {
  if (mainWindow) mainWindow.show();
  return false;
});

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer');
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload);
      } catch (err) {
        console.error(err);
      }
    }
  }
};

app.on('ready', async () => {
  await installExtensions();

  const windowSize = {
    width: 800,
    height: 870
  };

  const size = screen.getPrimaryDisplay().workAreaSize;
  if (size.height < 870) {
    windowSize.width = '800';
    windowSize.height = '600';
  }

  mainWindow = new BrowserWindow({
    width: windowSize.width,
    height: windowSize.height,
    'standard-window': false,
    resizable: process.env.NODE_ENV === 'development',
    frame: process.platform === 'win32' || process.env.NODE_ENV === 'development',
    show: false,
    titleBarStyle: 'hidden-inset',
    backgroundColor: '#ededed',
    webPreferences: {
      backgroundThrottling: false
    }
  });

  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  if (process.platform === 'win32') {
    mainWindow.on('close', () => mainWindow.webContents.send('application:quitting'));
    app.on('window-all-closed', () => app.quit());
  }

  mainWindow.webContents.on('new-window', (e) => e.preventDefault());

  mainWindow.webContents.on('will-navigate', (e, url) => {
    if (url.indexOf('build/index.html#') < 0) e.preventDefault();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle('VPN.ht');

    // if (!args.hide) {
    //   mainWindow.show();
    //   mainWindow.focus();
    // }

    // if (openURL) mainWindow.webContents.send('application:open-url', {url: openURL});

    app.on('open-url', (event, url) => {
      event.preventDefault();
      mainWindow.webContents.send('application:open-url', { url });
    });
  });

  // app.on('before-quit', event => {
  //   if (!canQuit) {
  //     event.preventDefault();
  //     if (!checkingQuit) {
  //       checkingQuit = true;
  //       mainWindow.webContents.send('application:vpn-check-disconnect');
  //     }
  //   }
  // });

  app.on('before-quit', event => {
    if (!canQuit) {
      event.preventDefault();
      if (!checkingQuit) {
        console.log('test2');
        checkingQuit = true;
        mainWindow.webContents.send('application:vpn-check-disconnect');
        ipcMain.on('vpn.disconnected', () => {
          canQuit = true;
          app.quit();
        });
      }
    }
  });

  powerMonitor.on('resume', () => mainWindow.webContents.send('application:vpn-check-sleep'));

  mainWindow.on('closed', () => mainWindow = null);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
    mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          mainWindow.inspectElement(x, y);
        }
      }]).popup(mainWindow);
    });
  }

  if (process.platform === 'darwin') {

  } else {
    template = [{
      label: 'VPN.ht',
      submenu: [{
        label: 'About VPN.ht',
        click() {
          mainWindow.webContents.send('about');
        }
      }, {
        type: 'separator'
      }, {
        label: 'Hide VPN.ht',
        accelerator: 'Ctrl+H',
        selector: 'hide:'
      }, {
        label: 'Hide Others',
        accelerator: 'Ctrl+Shift+H',
        selector: 'hideOtherApplications:'
      }, {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click() {
          app.quit();
        }
      }]
    }, {
      label: 'View',
      submenu: [{
        label: 'Toggle DevTools',
        accelerator: 'Alt+Ctrl+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }]
    }, {
      label: 'Window',
      submenu: [{
        label: 'Minimize',
        accelerator: 'Ctrl+Shift+M',
        selector: 'performMiniaturize:',
        click() {
          mainWindow.minimize();
        }
      }, {
        label: 'Maximize',
        accelerator: 'Ctrl+M',
        selector: 'performMaxiturize:',
        click() {
          mainWindow.maximize();
        }
      }, {
        label: 'Close',
        accelerator: 'Ctrl+W',
        selectror: 'preformClose',
        click() {
          mainWindow.hide();
        }
      }, {
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Report Issue or Suggest Feedback',
        click() {
          console.log('Report Issue or Suggest Feedback');
          shell.openExternal('https://github.com/vpnht/desktop/issues/new');
        }
      }]
    }];

    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }

  function toggleVisibility() {
    if (mainWindow) {
      const isVisible = mainWindow.isVisible();
      console.log(isVisible);
      if (isVisible) {
        if (process.platform == 'darwin') app.dock.hide();
        mainWindow.hide();
      } else {
        if (process.platform == 'darwin') app.dock.show();
        mainWindow.show();
      }
    }
  };

  function connect() {
    const isVisible = mainWindow.isVisible();
    if (!isVisible) toggleVisibility();
    mainWindow.webContents.send('application:vpn-connect');
  };

  function disconnect() {
    const isVisible = mainWindow.isVisible();
    if (!isVisible) toggleVisibility();
    mainWindow.webContents.send('application:vpn-disconnect');
  };

  const trayMenuDisconnected = Menu.buildFromTemplate([{
  		label: 'Toggle VPN.ht',
  		click: toggleVisibility
  	}, {
  		type: 'separator'
  	}, {
  		label: 'Connect',
  		click: connect
  	}, {
  		label: 'Disconnect',
  		enabled: false
  	}, {
  		type: 'separator'
  	}, {
  		label: 'Quit',
  		click() {
        app.quit();
      }
  }]);

  const trayMenuConnected = Menu.buildFromTemplate([{
  		label: 'Show Window',
  		click: toggleVisibility
  	}, {
  		type: 'separator'
  	}, {
  		label: 'Connect',
  		enabled: false
  	}, {
  		label: 'Disconnect',
  		click: disconnect
  	}, {
  		type: 'separator'
  	}, {
  		label: 'Quit',
  		click() {
        app.quit();
      }
  }]);

  const trayMenuConnecting = Menu.buildFromTemplate([{
  		label: 'Show Window',
  		click: toggleVisibility
  	}, {
  		type: 'separator'
  	}, {
  		label: 'Cancel connecting...',
  		click: disconnect
  	}, {
  		label: 'Disconnect',
  		enabled: false
  	}, {
  		type: 'separator'
  	}, {
  		label: 'Quit',
      click() {
        app.quit();
      }
  }]);

	tray = new Tray(`${__dirname}/images/tray.png`);
  tray.setToolTip('VPN.ht');
  tray.setContextMenu(trayMenuDisconnected);
	tray.on('clicked', toggleVisibility);

});
