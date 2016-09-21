import React, { Component, PropTypes } from 'react';

export default class SubHeader extends Component {

  render() {
    let status;
    let greenGuyClass = 'greenguy';

    if (this.props.connected) {
      status = (
        <div className="status">
          <p className="connected">connected!</p>
          <span>
            Your internet traffic is now encrypted!and your online identity has become anonymous.
          </span>
        </div>
      );
      greenGuyClass += ' connected';
    } else {
      status = (
        <div className="status" >
          <p className="disconnected">not connected!</p>
          <span>Your internet traffic is unencrypted and your online identity is exposed.</span>
        </div>
      );
    }

    return (
      <header>
        <img role="presentation" className="logo" src="../images/Logo.png" />
        <img role="presentation" className={greenGuyClass} src="../images/Figure.png" />
        {status}
      </header>
    );
  }

}

SubHeader.propTypes = {
  connected: PropTypes.bool
};
