import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import Router from 'react-router';
import Sidebar from './Sidebar.react';
import Header from './Header.react';
import SubHeader from './SubHeader.react';
import metrics from '../utils/MetricsUtil';
import shell from 'shell';
import RetinaImage from 'react-retina-image';

var Client = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      sidebarOffset: 0
    };
  },

  handleScroll: function (e) {
    if (e.target.scrollTop > 0 && !this.state.sidebarOffset) {
      this.setState({
        sidebarOffset: e.target.scrollTop
      });
    } else if (e.target.scrollTop === 0 && this.state.sidebarOffset) {
      this.setState({
        sidebarOffset: 0
      });
    }
  },

  handleClickPreferences: function () {
    metrics.track('Opened Preferences', {
      from: 'app'
    });
    this.context.router.transitionTo('preferences');
  },

  handleClickReportIssue: function () {
    metrics.track('Opened Issue Reporter', {
      from: 'app'
    });
    shell.openExternal('https://github.com/vpnht/desktop/issues/new');
  },

  handleMouseEnterReportIssue: function () {
    this.setState({
      currentButtonLabel: 'Report an issue or suggest feedback.'
    });
  },

  handleMouseLeaveReportIssue: function () {
    this.setState({
      currentButtonLabel: ''
    });
  },

  handleMouseEnterPreferences: function () {
    this.setState({
      currentButtonLabel: 'Change app preferences.'
    });
  },

  handleMouseLeavePreferences: function () {
    this.setState({
      currentButtonLabel: ''
    });
  },

  render: function () {
    var sidebarHeaderClass = 'sidebar-header';
    if (this.state.sidebarOffset) {
      sidebarHeaderClass += ' sep';
    }

    var container = this.context.router.getCurrentParams().name ? this.state.containers[this.context.router.getCurrentParams().name] : {};
    return (
      <div>
        <Header />
        <SubHeader />
        <div className="content-container">
          <Sidebar />
          <Router.RouteHandler />
        </div>
        <footer>
            <RetinaImage className="footerimg" src="FooterIllustration.png"/>
        </footer>
      </div>
    );
  }
});

module.exports = Client;
