import React, { Component, PropTypes } from 'react';

import Credentials from './Credentials';
import Logs from './DashboardLogs';
import ServerList from './ServerList';

export default class DashboardConnect extends Component {

  handleConnect() {
    console.log('handleConnect');
  }

  render() {
    let currentStatus = 'Loading...';
    if (this.props.appReady) {
      if (this.props.connecting) {
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
            <i className={this.props.connecting ? 'ion-ios-loop spin' : 'ion-ios-close-empty disconnected'} />
            <p>{currentStatus}</p>
          </div>
          <button disabled={!this.props.appReady} className="right" onClick={this.handleConnect.bind(this)}>
            <p>{this.props.connecting ? 'cancel' : 'connect to vpn'}</p>
          </button>
        </section>

        <Credentials />

        <ServerList />

        <Logs />
      </div>
    );
  }

}

DashboardConnect.propTypes = {
  appReady: PropTypes.bool,
  connecting: PropTypes.bool
};
