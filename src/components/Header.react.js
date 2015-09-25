import React from 'react/addons';
import remote from 'remote';
import RetinaImage from 'react-retina-image';
import ipc from 'ipc';
import util from '../utils/Util';
import metrics from '../utils/MetricsUtil';
import accountStore from '../stores/AccountStore';
import accountActions from '../actions/AccountActions';
import hub from '../utils/HubUtil';
import Router from 'react-router';
import classNames from 'classnames';

var autoUpdater = remote.require('auto-updater');
var app = remote.require('app');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var Header = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function () {
    return {
      fullscreen: false,
      updateAvailable: false,
      username: accountStore.getState().username,
      connected: accountStore.getState().connected
    };
  },
  componentDidMount: function () {
    document.addEventListener('keyup', this.handleDocumentKeyUp, false);

    accountStore.listen(this.update);

    ipc.on('application:update-available', () => {
      this.setState({
        updateAvailable: true
      });
    });
    autoUpdater.checkForUpdates();
  },
  componentWillUnmount: function () {
    document.removeEventListener('keyup', this.handleDocumentKeyUp, false);
    accountStore.unlisten(this.update);
  },
  update: function () {
    let accountState = accountStore.getState();
    if (this.isMounted()) {
        this.setState({
          username: accountState.username,
          connected: accountState.connected
        });
    }
  },
  handleDocumentKeyUp: function (e) {
    if (e.keyCode === 27 && remote.getCurrentWindow().isFullScreen()) {
      remote.getCurrentWindow().setFullScreen(false);
      this.forceUpdate();
    }
  },
  handleClose: function () {

    if (!util.isWindows()) {
      app.dock.hide();
    }

    remote.getCurrentWindow().hide();

  },
  handleMinimize: function () {
    if(hub.settings('minToTaskbar') === 'false' ? true : false)
      remote.getCurrentWindow().minimize();
    else
      remote.getCurrentWindow().hide();
  },
  handleFullscreen: function () {},

  handleFullscreenHover: function () {
    this.update();
  },
  handleAutoUpdateClick: function () {
    metrics.track('Restarted to Update');
    ipc.send('application:quit-install');
  },
  renderWindowButtons: function () {
    let buttons;
    if (util.isWindows()) {
      buttons = (
        <div className="windows-buttons">
        <div className="windows-button button-minimize enabled" onClick={this.handleMinimize}><div className="icon"></div></div>
        <div className="windows-button button-close enabled" onClick={this.handleClose}></div>
        </div>
      );
    } else {
      buttons = (
        <div className="buttons">
        <div className="button button-close enabled" onClick={this.handleClose}></div>
        <div className="button button-minimize enabled" onClick={this.handleMinimize}></div>
        <div className="button button-fullscreen disabled" onClick={this.handleFullscreen}></div>
        </div>
      );
    }
    return buttons;
  },
  renderDashboardHeader: function () {
    let headerClasses = classNames({
      bordered: !this.props.hideLogin,
      header: true,
      'no-drag': true
    });
    let updateWidget = this.state.updateAvailable && !this.props.hideLogin ? <a className="btn btn-action small no-drag" onClick={this.handleAutoUpdateClick}>UPDATE NOW</a> : null;
    return (
      <div className={headerClasses}>
        <div className="left-header">
          {util.isWindows () ? null : this.renderWindowButtons()}
        </div>
        <div className="right-header">
          <div className="updates">
            {updateWidget}
          </div>
          {util.isWindows () ? this.renderWindowButtons() : null}
        </div>
      </div>
    );
  },
  renderBasicHeader: function () {
    let headerClasses = classNames({
      bordered: !this.props.hideLogin,
      header: true,
      'no-drag': true
    });
    return (
      <div className={headerClasses}>
        <div className="left-header">
          {util.isWindows () ? null : this.renderWindowButtons()}
        </div>
        <div className="right-header">
          {util.isWindows () ? this.renderWindowButtons() : null}
        </div>
      </div>
    );
  },
  render: function () {
    if (this.props.hideLogin) {
      return this.renderBasicHeader();
    } else {
      return this.renderDashboardHeader();
    }
  }
});

module.exports = Header;
