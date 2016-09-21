import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ipcRenderer } from 'electron';

import routes from './routes';
import configureStore from './store/configureStore';
import './styles/main.less';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

ipcRenderer.on('about', () => history.push('/about'));
// ipcRenderer.on('application:quitting', () => console.log('application:quitting'));
// ipcRenderer.on('application:open-url', opts => console.log('application:open-url'));
// ipcRenderer.on('application:vpn-connect', () => console.log('application:vpn-connect'));
// ipcRenderer.on('application:vpn-check-disconnect',
//    () => console.log('application:vpn-check-disconnect'));
// ipcRenderer.on('application:vpn-check-sleep', () => console.log('application:vpn-check-sleep'));
// ipcRenderer.on('application:vpn-disconnect', () => console.log('application:vpn-disconnect'));
// ipcRenderer.on('vpn.connected', () => {
//   tray.setContextMenu(trayMenuConnected);
//   tray.setImage(`${__dirname}/images/tray_connected.png`);
//   tray.setToolTip('Connected');
// });
// ipcRenderer.on('vpn.connecting', () => {
//   tray.setContextMenu(trayMenuConnecting);
//   tray.setImage(`${__dirname}/images/tray_connecting.png`);
//   tray.setToolTip('Connecting...');
// });
// ipcRenderer.on('vpn.disconnected', () => {
//   tray.setContextMenu(trayMenuDisconnected);
//   tray.setImage(`${__dirname}/images/tray.png`);
//   tray.setToolTip('Disconnected');
// });
// ipcRenderer.on('vpn.disconnected', () => app.quit());

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);

export default history;
