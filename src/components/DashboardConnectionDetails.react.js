import React from 'react';
import Router from 'react-router';
import VPN from '../actions/VPNActions';
import util from '../utils/Util';
import Logs from './DashboardLogs.react';

import accountStore from '../stores/AccountStore';

var DashboardConnectionDetails = React.createClass({

  getInitialState: function () {
    return {
      bytecount: accountStore.getState().bytecount,
      myip: accountStore.getState().myip,
      connectionTime: accountStore.getState().connectionTime
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
          bytecount: accountStore.getState().bytecount,
          myip: accountStore.getState().myip,
          connectionTime: accountStore.getState().connectionTime
        });
    }
  },

  handleDisconnect: function (e) {
    e.preventDefault();
    VPN.disconnect();
  },

  render: function () {
    var download = util.bytesToSize(this.state.bytecount[0]);
    var upload = util.bytesToSize(this.state.bytecount[1]);

    var location = 'Loading...';
    var myip = this.state.myip.ip || 'Loading...';

    if (this.state.myip.advanced) {
        var city = this.state.myip.advanced.city || false;
        var country = this.state.myip.advanced.countryName || false;
        var countryFlag = this.state.myip.advanced.countryCode || false;
        if (countryFlag) {
            countryFlag = "flag-icon-" + countryFlag.toLowerCase();
        }
        if (city) {
            location = city + " , " + country;
        } else {
            location = country;
        }
    }

    var duration = util.toHHMMSS(this.state.connectionTime);

    return (
        <div>
            <section>
                <h1 className="title">VPN connection status</h1>
                <div className="connectionstatus">
                    <i className="ion-ios-checkmark-empty connected"></i>
                    <p>Connected - {duration}</p>
                </div>
                <button className="right" onClick={this.handleDisconnect}>
                    <p>disconnect vpn</p>
                </button>
            </section>

            <section className="ipOverview">
                <h1 className="title">IP and Country Overview</h1>
                <p>Your New IP Address:</p><span>{myip}</span>
                <div></div>
                <p>Your New ISP Location:</p><i className={countryFlag}></i><span>{location}</span>
            </section>

            <section>
                <h1 className="title">Quick IP Address Management</h1>
                <button className="left">
                    <p>Change IP Address</p>
                </button>
                <button className="left">
                    <p>Verify new IP Address</p>
                </button>
            </section>

            <Logs />
        </div>
    );
  }

});

module.exports = DashboardConnectionDetails;
