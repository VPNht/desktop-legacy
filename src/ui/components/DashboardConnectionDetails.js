import React from 'react';
import Router from 'react-router';
import T from 'i18n-react';
import VPN from '../actions/VPNActions';
import util from '../utils/Util';
import Logs from './Logs';

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

    var location = T.translate('Loading...');
    var myip = this.state.myip.ip || T.translate('Loading...');

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
                <h1 className="title">{T.translate('VPN connection status')}</h1>
                <div className="connectionstatus">
                    <i className="ion-ios-checkmark-empty connected"></i>
                    <p>{T.translate('Connected')} - {duration}</p>
                </div>
                <button className="right" onClick={this.handleDisconnect}>
                    <p>{T.translate('disconnect vpn')}</p>
                </button>
            </section>

            <section className="ipOverview">
                <h1 className="title">{T.translate('IP and Country Overview')}</h1>
                <p>{T.translate('Your New IP Address:')}</p><span>{myip}</span>
                <div></div>
                <p>{T.translate('Your New ISP Location:')}</p><i className={countryFlag}></i><span>{location}</span>
            </section>

            <section>
                <h1 className="title">{T.translate('Quick IP Address Management')}</h1>
                <button className="left">
                    <p>{T.translate('Change IP Address')}</p>
                </button>
                <button className="left">
                    <p>{T.translate('Verify new IP Address')}</p>
                </button>
            </section>

            <Logs />
        </div>
    );
  }

});

module.exports = DashboardConnectionDetails;
