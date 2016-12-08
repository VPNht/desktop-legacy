import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import Connect from './DashboardConnect';
import ConnectionDetails from './DashboardConnectionDetails';

@connect(store => {
  return {
    connected: store.accountReducer.connected
  };
})
export default class Dashboard extends Component {

  static propTypes = {
    connected: PropTypes.bool.isRequired
  };

  render() {
    let toMount = <Connect />;
    if (this.props.connected) toMount = <ConnectionDetails />;

    return (
      <div className="content-scroller" id="content">
        {toMount}
      </div>
    );
  }

}
