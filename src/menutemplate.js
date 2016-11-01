import {remote, shell} from 'electron';
import router from './router';
import metrics from './utils/MetricsUtil';
import util from './utils/Util';
import {t} from './utils/localizationUtil';

var dialog = remote.dialog;
var app = remote.app;

// main.js
var MenuTemplate = function() {
    return [{
        label: 'VPN.ht',
        submenu: [{
            label: t('About'),
            accelerator: util.CommandOrCtrl() + '+I',
            click: function() {
                metrics.track('Opened About', {
                    from: 'menu'
                });
                router.get().transitionTo('about');
            }
        }, {
            type: 'separator'
        }, {
            label: t('Hide') + ' VPN.ht',
            accelerator: util.CommandOrCtrl() + '+H',
            selector: 'hide:'
        }, {
            label: t('Hide Others'),
            accelerator: util.CommandOrCtrl() + '+Shift+H',
            selector: 'hideOtherApplications:'
        }, {
            label: t('Show All'),
            selector: 'unhideAllApplications:'
        }, {
            type: 'separator'
        }, {
            label: t('Quit'),
            accelerator: util.CommandOrCtrl() + '+Q',
            click: function() {
                app.quit();
            }
        }]
    }, {
        label: t('View'),
        submenu: [{
            label: t('Toggle DevTools'),
            accelerator: 'Alt+' + util.CommandOrCtrl() + '+I',
            click: function() {
                remote.getCurrentWindow().toggleDevTools();
            }
        }]
    }, {
        label: t('Window'),
        submenu: [{
            label: t('Minimize'),
            accelerator: util.CommandOrCtrl() + '+M',
            selector: 'performMiniaturize:'
        }, {
            label: t('Close'),
            accelerator: util.CommandOrCtrl() + '+W',
            click: function() {
                remote.getCurrentWindow().hide();
            }
        }, {
            type: 'separator'
        }, {
            label: t('Bring All to Front'),
            selector: 'arrangeInFront:'
        }]
    }, {
        label: t('Help'),
        submenu: [{
            label: t('Report Issue or Suggest Feedback'),
            click: function() {
                metrics.track('Opened Issue Reporter', {
                    from: 'menu'
                });
                shell.openExternal('https://github.com/vpnht/desktop/issues/new');
            }
        }]
    }];
};

module.exports = MenuTemplate;