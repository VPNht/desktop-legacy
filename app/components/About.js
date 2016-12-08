import { browserHistory } from 'react-router'
import { remote } from 'electron';
import React, { Component } from 'react';

import { packageJson } from '../utils';
import { translate } from '../utils/localizationUtil';
import MetricsUtil from '../utils/MetricsUtil';

export default class About extends Component {

  constructor(...args) {
    super(...args);
    this._metrics = new MetricsUtil();
  }

  handleGoBackClick() {
    browserHistory.goBack();
    this._metrics.track('Went Back From About');
  }

  handleExternal() {
    const packagejson = packageJson();
    const { shell } = remote;

    shell.openExternal(packagejson.homepage);
  }

  render() {
    const packagejson = packageJson();

    return (
      <div className="preferences">
        <div className="about-content">
          <a className="goback ion-android-arrow-back" onClick={this.handleGoBackClick.bind(this)} />

          <div className="items">
            <div className="item">
              <img src="../images/monster-left.png" />
              <h4>{translate('Plug and play!')}</h4>
              <p>{translate('You can start using our service, and start surfing in privacy, as soon as you create an account.')}</p>
            </div>
            <div className="item">
              <img src="../images/monster-right.png" />
              <h4>{translate('No logs')}</h4>
              <p>{translate('You value your privacy. So do we. We don’t keep logs, we don’t know the sites you have visited or the applications you’ve used.')}</p>
            </div>
          </div>

          <div className="foot">
            {packagejson.name} v{packagejson.version} - <a onClick={this.handleExternal.bind(this)}>{packagejson.homepage}</a>
          </div>
        </div>
      </div>
    );
  }

}
