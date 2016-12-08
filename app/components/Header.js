import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

import { isWindows } from '../utils';

export default class Header extends Component {

  static propTypes = {
    hideLogin: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  renderWindowButtons() {
    let buttons;

    if (isWindows()) {
      buttons = (
        <div className="windows-buttons">
          <div className="windows-button button-minimize enabled" />
          <div className="icon" />
          <div className="windows-button button-close enabled" />
        </div>
      );
    } else {
      buttons = (
        <div className="buttons">
          <div className="button button-close enabled" />
          <div className="button button-minimize enabled" />
          <div className="button button-fullscreen disabled" />
        </div>
      );
    }

    return buttons;
  }

  render() {
    const headerClasses = classNames({
      bordered: !this.props.hideLogin,
      header: true,
      'no-drag': true
    });

    const buttons = this.renderWindowButtons();
    return (
      <div className={headerClasses}>
        <div className="left-header">
          {isWindows() ? null : buttons}
        </div>
        <div className="right-header">
          {isWindows() ? buttons : null}
        </div>
      </div>
    );
  }

}
