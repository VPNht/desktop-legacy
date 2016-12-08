import { Provider } from 'react-redux';
import { remote, ipcRenderer } from 'electron';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import os from 'os';
import React from 'react';
import ReactDOM, { render } from 'react-dom';

import { info } from './actions/logActions';
import { initLocalization } from './utils/localizationUtil';
import * as vpnActions from './actions/vpnActions';
import MetricsUtil from './utils/MetricsUtil';
import routes from './routes';
import SettingsUtil from './utils/SettingsUtil';
import store from './store';
import VPNUtil from './utils/VPNUtil';
import WebUtil from './utils/WebUtil';
import './styles/main.less';

const { app, Menu } = remote;

const history = syncHistoryWithStore(hashHistory, store);

function initLogs(appVersion = app.getVersion()) {
	const ifaces = os.networkInterfaces();
	const memories = os.totalmem() / 1024 / 1024 / 1024;
	const freeMemories = os.freemem() / 1024 / 1024 / 1024;

	store.dispatch(info(`Launching VPN.ht Application ${appVersion}`));
	store.dispatch(info('Network Interfaces', ifaces));
	store.dispatch(info(`Operating System`, {
		'Release': os.release(),
		'Type': os.type(),
		'Arch': os.arch(),
		'LoadAvg': os.loadavg(),
		'Total Memory': `${memories} GB`,
		'Free Memory': `${freeMemories} GB`,
		'CPUs': os.cpus().length
	}));
}
initLogs(app.getVersion());

// const vpnUtil = new VPNUtil();
// vpnUtil.initCheck();

initLocalization();

const webUtil = new WebUtil();
webUtil.addBugReporting();
webUtil.disableGlobalBackspace();

// Menu.setApplicationMenu(Menu.buildFromTemplate(template()));

const metrics = new MetricsUtil();
metrics.track('Started App');
metrics.track('app heartbeat');
setInterval(() => metrics.track('app heartbeat'), 14400000);

ipcRenderer.on('application:quitting', () => console.log('quitting'));

ipcRenderer.on('application:open-url', opts => console.log('open', opts));

ipcRenderer.on('application:vpn-connect', () => {
  // if (Credentials._config()) {
  //   vpnActions.connect({
  //     username: Credentials.get().username,
  //     password: Credentials.get().password,
  //     server: SettingsUtil.get('server') || 'hub.vpn.ht'
  //   });
  // } else {
  //   log.error('No user/pass saved in the hash.\n\nTIPS: Try to connect manually first to save your data.')
  // }
});


ipcRenderer.on('application:vpn-check-disconnect', () => {
  console.log('test');
  // if (accountStore.getState().connecting || accountStore.getState().connected) {
  //     log.info('Disconnecting before closing application');
  //     vpnActions.disconnect();
  // } else {
  //     vpnActions.disconnected();
  // }
});

ipcRenderer.on('application:vpn-check-sleep', () => {
  // if (accountStore.getState().connected) {
  //   log.info('Trying to reconnect after sleep');
  //   if (Credentials._config()) {
  //     vpnActions.connect({
  //       username: Credentials.get().username,
  //       password: Credentials.get().password,
  //       server: SettingsUtil.get('server') || 'hub.vpn.ht'
  //     });
  //   } else {
  //     log.info('No user/pass saved in the hash. Disconnecting.');
  //     vpnActions.disconnect();
  //   }
  // }
});

// ipcRenderer.on('application:vpn-disconnect', () => vpnActions.disconnect());

ipcRenderer.send('vpn.disconnected', true);

ipcRenderer.on('vpn.connected', () => {
  // tray.setContextMenu(trayMenuConnected);
  // tray.setImage(`${__dirname}/images/tray_connected.png`);
  // tray.setToolTip('Connected');
});

ipcRenderer.on('vpn.connecting', () => {
  // tray.setContextMenu(trayMenuConnecting);
  // tray.setImage(`${__dirname}/images/tray_connecting.png`);
  // tray.setToolTip('Connecting...');
});

ipcRenderer.on('vpn.disconnected', () => {
  // tray.setContextMenu(trayMenuDisconnected);
  // tray.setImage(`${__dirname}/images/tray.png`);
  // tray.setToolTip('Disconnected');

  app.quit();
});

ipcRenderer.on('about', () => history.push('/about'));

document.getElementById('root').classList = [process.platform];

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);

export default history;
