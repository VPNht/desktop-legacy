import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import { translate } from '../utils/localizationUtil';

@connect(store => {
  return {
    connected: store.accountReducer.connected
  };
})
export default class SubHeader extends Component {

  static propTypes = {
    connected: PropTypes.bool.isRequired
  };

  render() {
    let status;
    let greenGuyClass = 'greenguy';

    if (this.props.connected) {
      status = (
        <div className="status">
          <p className="connected">{translate('connected!')}</p>
          <span>
            {translate('Your internet traffic is now encrypted!and your online identity has become anonymous.')}
          </span>
        </div>
      );
      greenGuyClass += ' connected';
    } else {
      status = (
        <div className="status" >
          <p className="disconnected">{translate('not connected!')}</p>
          <span>{translate('Your internet traffic is unencrypted and your online identity is exposed.')}</span>
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
