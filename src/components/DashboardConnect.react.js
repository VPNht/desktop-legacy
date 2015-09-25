import React from 'react/addons';
import Router from 'react-router';
import hub from '../utils/HubUtil';
import myip from '../utils/MyipUtil';

import accountStore from '../stores/AccountStore';
import accountActions from '../actions/AccountActions';
import VPN from '../actions/VPNActions';
import Select from 'react-select';
import _ from 'underscore';
import log from '../stores/LogStore';
import ServerOption from './ServerListOption.react';
import ServerItem from './ServerListItem.react';
import Logs from './DashboardLogs.react';

import Cache from 'node-cache';
let serversCache = new Cache();

var DashboardConnect = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      connecting: accountStore.getState().connecting,
      appReady: accountStore.getState().appReady,
      username: hub.credentials().username,
      password: hub.credentials().password,
      saveCredentials: hub.settings('saveCredentials') === 'true' ? true : false,
      server: hub.settings('server') || 'hub.vpn.ht'
    };
  },

  componentDidMount: function () {
    accountStore.listen(this.update);
  },

  componentWillUnmount: function () {
    accountStore.unlisten(this.update);
  },

  update: function () {
    if (this.isMounted()) {
        this.setState({
          connecting: accountStore.getState().connecting,
          appReady: accountStore.getState().appReady
        });
    }
  },

  handleConnect: function (e) {
    e.preventDefault();

    if (this.state.connecting) {
        VPN.disconnect();
    } else {
        if (!this.state.username) {
            alert('Username should not be left blank');
        } else if (!this.state.password) {
            alert('Password should not be left blank');
        } else if (!this.state.server) {
            alert('You should select a server');
        } else {

            // should we save credentials ?
            if (this.state.saveCredentials) {
                hub.saveLogin(this.state.username, this.state.password);
            } else {
                // make sure to flush previous save
                hub.logout();
            }

            VPN.connect(this.state);
        }
    }
  },

  handleServer: function (val) {
    this.setState({
      server: val
    });

    // save for future use
    accountActions.saveSettings('server', val);
  },

  handleRemoteServer: function (input, callback) {
    var self = this;
    serversCache.get( "serversList", function( err, value ){

        if (value) {

            setTimeout(function() {
    			callback(null, { options: value, complete: true });
    		}, 500);

        } else {
            self.getRemoteServers(function(servers) {
                serversCache.set( "serversList", servers, function( err, success ){
                    if (err) {
                        log.error('Servers list error', err);
                    }

                    log.debug('Caching servers list');
                    callback(null, { options: servers, complete: true });
                });
            });
        }


    });
  },

  getRemoteServers: function(callback) {

    var options = [{ value: 'hub.vpn.ht', label: 'Nearest Server (Random)', country: 'blank' }];
    var serverName;

    myip.servers(function(error, response, body) {
        var servers = JSON.parse(body);

        _.each(servers, function(server, country) {

            serverName = server.countryName + ' - ' + Math.round(server.distance) + ' KM  - LOC ' + server.host.toUpperCase().replace( /^\D+/g, '');

            if (server.regionName) {
                serverName = server.regionName + ", " + serverName;
            }

            if (server.city) {
                serverName = server.city + ", " + serverName;
            }

            options.push({
                value: server.ip,
                label: serverName,
                country: server.country
            });
        });

        callback(options);
    });

  },

  handleChangeSaveCredentials: function (e) {
    var checked = e.target.checked;
    this.setState({
      saveCredentials: checked
    });

    // save for future use
    hub.saveSettings('saveCredentials', !!checked);
  },

  render: function () {
    var currentStatus = 'Loading...';
    if (this.state.appReady) {
        if (this.state.connecting) {
            currentStatus = 'Connecting...';
        } else {
            currentStatus = 'Disconnected';
        }
    }
    return (
        <div>

          <section>
            <h1 className="title">VPN connection status</h1>
            <div className="connectionstatus">
                <i className={this.state.connecting ? 'ion-ios-loop spin' : 'ion-ios-close-empty disconnected'}></i>
                <p>{currentStatus}</p>
            </div>
            <button disabled={!this.state.appReady} className="right" onClick={this.handleConnect}>
                <p>{this.state.connecting ? 'cancel' : 'connect to vpn'}</p>
            </button>
          </section>

          <section>
            <h1 className="title">Login</h1>
            <input name="username" disabled={!this.state.appReady} valueLink={this.linkState('username')} placeholder="Username" type="text" />
            <input name="password" disabled={!this.state.appReady} valueLink={this.linkState('password')} placeholder="Password" type="password" />
            <div className="checkbox">
                <input type="checkbox" disabled={!this.state.appReady} checked={this.state.saveCredentials} onChange={this.handleChangeSaveCredentials} id="saveCredentials" />
                <label htmlFor="saveCredentials"></label>
                <p>Remember my username and password</p>
            </div>
          </section>

          <section>
            <h1 className="title">Servers</h1>
            <Select
                    disabled={!this.state.appReady}
                    name="server"
                    value={this.state.server}
					onOptionLabelClick={this.onLabelClick}
                    asyncOptions={this.handleRemoteServer}
                    onChange={this.handleServer}
					placeholder="Select server"
					optionComponent={ServerOption}
					singleValueComponent={ServerItem}
                    searchable={false}
                    clearable={false}
            />
          </section>

          <Logs />
        </div>
    );
  }

});

module.exports = DashboardConnect;
