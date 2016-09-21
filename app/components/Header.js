import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

import Util from '../utils/Util';

export default class Header extends Component {

  constructor(props) {
    super(props);

    this.util = new Util();
  }

  renderWindowButtons() {
    let buttons;

    if (this.util.isWindows()) {
    // if (true) {
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

    const isWindows = this.util.isWindows();
    // const isWindows = true;
    const buttons = this.renderWindowButtons();
    return (
      <div className={headerClasses}>
        <div className="left-header">
          {isWindows ? null : buttons}
        </div>
        <div className="right-header">
          {isWindows ? buttons : null}
        </div>
      </div>
    );
  }

}

Header.propTypes = {
  hideLogin: PropTypes.bool
};
