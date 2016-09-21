import React, { Component } from 'react';

import Logs from './DashboardLogs';

export default class DashboardConnectionDetails extends Component {

  handleDisconnect() {
    console.log('handleDisconnect');
  }

  handleChangeIp() {
    console.log('handleChangeIp');
  }

  handleVerifyIp() {
    console.log('handleVerifyIp');
  }

  render() {
    let location = 'Loading...';
    // const myip = this.props.myip.ip || 'Loading...';
    const myip = 'Loading...';

    let city, country, countryFlag;
    // if (this.props.myip.advanced) {
    //   city = this.props.myip.advanced.city || false;
    //   country = this.props.myip.advanced.countryName || false;
    //   countryFlag = this.props.myip.advanced.countryCode || false;
    //   if (countryFlag) {
    //     countryFlag = `flag-icon-${countryFlag.toLowerCase()}`;
    //   }
    //   if (city) {
    //     location = `${city}, ${country}`;
    //   } else {
    //     location = country;
    //   }
    // }

    // const duration = util.toHHMMSS(this.props.connectionTime);
    const duration = 123;

    return (
      <div>
        <section>
          <h1 className="title">VPN connection status</h1>
          <div className="connectionstatus">
            <i className="ion-ios-checkmark-empty connected" />
            <p>Connected - {duration}</p>
          </div>
          <button className="right" onClick={this.handleDisconnect.bind(this)}>
            <p>disconnect vpn</p>
          </button>
        </section>

        <section className="ipOverview">
          <h1 className="title">IP and Country Overview</h1>
          <p>Your New IP Address:</p><span>{myip}</span>
          <div / >
          <p>Your New ISP Location:</p><i className={countryFlag} /><span>{location}</span>
        </section>

        <section>
          <h1 className="title">Quick IP Address Management</h1>
          <button className="left" onClick={this.handleChangeIp.bind(this)}>
            <p>Change IP Address</p>
          </button>
          <button className="left" onClick={this.handleVerifyIp.bind(this)}>
            <p>Verify new IP Address</p>
          </button>
        </section>

        <Logs />
      </div>
    );
  }

}
