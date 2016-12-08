import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import { toggleSaveCredentials } from '../actions/settingsActions';
import { translate } from '../utils/localizationUtil';
import SettingsUtil from '../utils/SettingsUtil';

@connect(store => {
  return {
    appReady: store.accountReducer.appReady,
    password: store.accountReducer.password,
    saveCredentials: store.settingsReducer.saveCredentials,
    username: store.accountReducer.username
  };
})
export default class Credentials extends Component {

  static propTypes = {
    appReady: PropTypes.bool.isRequired,
    password: PropTypes.string.isRequired,
    saveCredentials: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired
  }

  handleChangeSaveCredentials() {
    this.props.dispatch(toggleSaveCredentials(this.props.saveCredentials));
    SettingsUtil.save('saveCredentials', this.props.saveCredentials);
  }

  render() {
    return (
      <section>
        <h1 className="title">Login</h1>
        <input name="username" disabled={!this.props.appReady} value={this.props.username} placeholder={translate('Username')} type="text" />
        <input name="password" disabled={!this.props.appReady} value={this.props.password} placeholder={translate('Password')} type="password" />
        <div className="checkbox">
          <input type="checkbox" disabled={!this.props.appReady} checked={this.props.saveCredentials} onChange={this.handleChangeSaveCredentials.bind(this)} id="saveCredentials" />
          <label htmlFor="saveCredentials" />
          <p>{translate('Remember my username and password')}</p>
        </div>
      </section>
    )
  }

}
