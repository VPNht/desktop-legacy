import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

// import { toggleSaveCredentials } from '../actions/settingsActions';
import * as SettingsActions from '../actions/settingsActions';
import SettingsUtil from '../utils/SettingsUtil';

class Credentials extends Component {

  handleChangeSaveCredentials() {
    console.log(this.props);
    this.props.actions.toggleSaveCredentials(this.props.saveCredentials);
    SettingsUtil.save('saveCredentials', this.props.saveCredentials);
  }

  render() {
    return (
      <section>
        <h1 className="title">Login</h1>
        <input name="username" disabled={!this.props.appReady} valueLink={this.props.username} placeholder="Username" type="text" />
        <input name="password" disabled={!this.props.appReady} valueLink={this.props.password} placeholder="Password" type="password" />
        <div className="checkbox">
          <input type="checkbox" checked={this.props.saveCredentials} onChange={this.handleChangeSaveCredentials.bind(this)} />
          <label htmlFor="saveCredentials" />
          <p>Remember my username and password</p>
        </div>
      </section>
    )
  }

}

Credentials.propTypes = {
  appReady: PropTypes.bool,
  password: PropTypes.string,
  saveCredentials: PropTypes.bool,
  username: PropTypes.string
}

// function mapStateToProps(state) {
//   return {
//     appReady: state.settingsReducer.autoPath,
//     password: state.settingsReducer.connectLaunch,
//     saveCredentials: state.settingsReducer.disableSmartdns,
//     username: state.settingsReducer.encryption,
//   };
// }

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SettingsActions, dispatch)
  };
}

export default connect(
  // mapStateToProps,
  mapDispatchToProps
)(Credentials);
