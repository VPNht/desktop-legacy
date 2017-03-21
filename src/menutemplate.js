import {remote, shell} from 'electron';
import metrics from './ui/utils/MetricsUtil';
import util from './ui/utils/Util';
import T from 'i18n-react';

var dialog = remote.dialog;
var app = remote.app;

// main.js
var MenuTemplate = function() {
    return [{
        label: 'VPN.ht',
        submenu: [{
            label: T.translate('Manage Account'),
            click: function() {
                metrics.track('Opened Billing on VPN.ht', {
                    from: 'menu'
                });
                shell.openExternal('https://billing.vpn.ht/clientarea.php?action=services');
            }
        }, {
            type: 'separator'
        }, {
            label: T.translate('Quit'),
            accelerator: util.CommandOrCtrl() + '+Q',
            click: function() {
                app.quit();
            }
        }]
    }, {
        label: T.translate('View'),
        submenu: [{
            label: T.translate('Hide') + ' VPN.ht',
            accelerator: util.CommandOrCtrl() + '+H',
            selector: 'hide:'
        }, {
            label: T.translate('Hide Others'),
            accelerator: util.CommandOrCtrl() + '+Shift+H',
            selector: 'hideOtherApplications:'
        }, {
            label: T.translate('Show All'),
            selector: 'unhideAllApplications:'
        }, {
            type: 'separator'
        }, {
            label: T.translate('Toggle DevTools'),
            accelerator: 'Alt+' + util.CommandOrCtrl() + '+I',
            click: function() {
                remote.getCurrentWindow().toggleDevTools();
            }
        }]
    }, {
        label: T.translate('Window'),
        submenu: [{
            label: T.translate('Minimize'),
            accelerator: util.CommandOrCtrl() + '+M',
            selector: 'performMiniaturize:'
        }, {
            label: T.translate('Close'),
            accelerator: util.CommandOrCtrl() + '+W',
            click: function() {
                remote.getCurrentWindow().hide();
            }
        }, {
            type: 'separator'
        }, {
            label: T.translate('Bring All to Front'),
            selector: 'arrangeInFront:'
        }]
    }, {
        label: T.translate('Help'),
        submenu: [{
            label: T.translate('Support'),
            click: function() {
                metrics.track('Opened Support on VPN.ht', {
                    from: 'menu'
                });
                shell.openExternal('https://billing.vpn.ht/knowledgebase.php');
            }
        }, {
            label: T.translate('Report Issue or Suggest Feedback'),
            click: function() {
                metrics.track('Opened Issue Reporter', {
                    from: 'menu'
                });
                shell.openExternal('https://github.com/vpnht/desktop/issues/new');
            }
        }, {
            type: 'separator'
        }, {
            label: T.translate('About'),
            accelerator: util.CommandOrCtrl() + '+I',
            click: function() {
                metrics.track('Opened About', {
                    from: 'menu'
                });

                window.location.hash = "#/about";
            }
        }]
    }];
};

module.exports = MenuTemplate;