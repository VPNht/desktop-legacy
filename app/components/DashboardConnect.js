import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import { translate } from '../utils/localizationUtil';
import Credentials from './Credentials';
import Logs from './DashboardLogs';
import ServerList from './ServerList';

@connect(store => {
  return {
    appReady: store.accountReducer.appReady,
    connecting: store.accountReducer.connecting
  }
})
export default class DashboardConnect extends Component {

  static propTypes = {
    appReady: PropTypes.bool,
    connecting: PropTypes.bool
  };

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

    const connectionStatus = this.props.connecting ? 'cancel' : 'connect to vpn';

    return (
      <div>
        <section>
          <h1 className="title">{translate('VPN connection status')}</h1>
          <div className="connectionstatus">
            <i className={this.props.connecting ? 'ion-ios-loop spin' : 'ion-ios-close-empty disconnected'} />
            <p>{translate(currentStatus)}</p>
          </div>
          <button disabled={!this.props.appReady} className="right" onClick={this.handleConnect.bind(this)}>
            <p>{translate(connectionStatus)}</p>
          </button>
        </section>

        <Credentials />

        <ServerList />

        <Logs />
      </div>
    );
  }

}
