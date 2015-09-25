import remote from 'remote';
import shell from 'shell';
import router from './router';
import metrics from './utils/MetricsUtil';
import util from './utils/Util';

var dialog = remote.require('dialog');
var app = remote.require('app');

// main.js
var MenuTemplate = function () {
  return [
    {
      label: 'VPN.ht',
      submenu: [
      {
        label: 'About VPN.ht',
        click: function () {
          metrics.track('Opened About', {
            from: 'menu'
          });
          router.get().transitionTo('about');
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide VPN.ht',
        accelerator: util.CommandOrCtrl() + '+H',
        selector: 'hide:'
      },
      {
        label: 'Hide Others',
        accelerator: util.CommandOrCtrl() + '+Shift+H',
        selector: 'hideOtherApplications:'
      },
      {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: util.CommandOrCtrl() + '+Q',
        click: function() {
          app.quit();
        }
      }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+' + util.CommandOrCtrl() + '+I',
          click: function() { remote.getCurrentWindow().toggleDevTools(); }
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
      {
        label: 'Minimize',
        accelerator: util.CommandOrCtrl() + '+M',
        selector: 'performMiniaturize:'
      },
      {
        label: 'Close',
        accelerator: util.CommandOrCtrl() + '+W',
        click: function () {
          remote.getCurrentWindow().hide();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Report Issue or Suggest Feedback',
          click: function () {
            metrics.track('Opened Issue Reporter', {
              from: 'menu'
            });
            shell.openExternal('https://github.com/vpnht/desktop/issues/new');
          }
        }
      ]
    }
  ];
};

module.exports = MenuTemplate;
