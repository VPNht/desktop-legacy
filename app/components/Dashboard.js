import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import * as AccountActions from '../actions/accountActions';
import Connect from './DashboardConnect';
import ConnectionDetails from './DashboardConnectionDetails';

export default class Dashboard extends Component {

  render() {
    let toMount = <Connect />;
    // toMount = <ConnectionDetails />;
    if (this.props.connected) toMount = <ConnectionDetails />;

    return (
      <div className="content-scroller" id="content">
        {toMount}
      </div>
    );
  }

}

Dashboard.propTypes = {
  connected: PropTypes.bool
};

// function mapStateToProps(state) {
//   return {
//     appReady: state.accountReducer.appReady,
//     bytecount: state.accountReducer.bytecount,
//     connected: state.accountReducer.connected,
//     connecting: state.accountReducer.connecting,
//     connectionTime: state.accountReducer.connectionTime,
//     errors: state.accountReducer.errors,
//     myip: state.accountReducer.myip,
//     password: state.accountReducer.password,
//     username: state.accountReducer.username
//   };
// }
//
// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(AccountActions, dispatch)
//   };
// }
//
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Dashboard);
