import $ from 'jquery';
import _ from 'lodash';
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SubHeader from './SubHeader';
import metrics from '../utils/MetricsUtil';
import readPackageInfo from 'pkginfo';
import {
    shell
}
from 'electron';

import RetinaImage from 'react-retina-image';

import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import Dashboard from './Dashboard';
import Preferences from './Preferences';
import About from './About';

import packageInfo from '../package.json';

var App = React.createClass({
    getInitialState: function() {
        return {
            sidebarOffset: 0,
            name: packageInfo.name,
            version: packageInfo.version,
            homepageURL: packageInfo.homepage
        };
    },

    handleScroll: function(e) {
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

    handleClickPreferences: function() {
        metrics.track('Opened Preferences', {
            from: 'app'
        });
    },

    handleClickReportIssue: function() {
        metrics.track('Opened Issue Reporter', {
            from: 'app'
        });
        shell.openExternal('https://github.com/vpnht/desktop/issues/new');
    },

    handleMouseEnterReportIssue: function() {
        this.setState({
            currentButtonLabel: 'Report an issue or suggest feedback.'
        });
    },

    handleMouseLeaveReportIssue: function() {
        this.setState({
            currentButtonLabel: ''
        });
    },

    handleMouseEnterPreferences: function() {
        this.setState({
            currentButtonLabel: 'Change app preferences.'
        });
    },

    handleMouseLeavePreferences: function() {
        this.setState({
            currentButtonLabel: ''
        });
    },

    render: function() {
        const { name, version, homepageURL } = this.state;

        var sidebarHeaderClass = 'sidebar-header';
        if (this.state.sidebarOffset) {
            sidebarHeaderClass += ' sep';
        }

        return (
            <Router basename="" >
                <div>
                    <Header />
                    <SubHeader />

                    <div className="content-container">
                        <Sidebar />
                        <Route exact path="/" render={() => (<Dashboard />)} />
                        <Route exact path="/preferences" component={Preferences} />
                        <Route exact path="/about" render={() => (
                            <About packageName={name} packageVersion={version} homepageURL={homepageURL} />
                        )}/>
                    </div>

                    <footer>
                        <RetinaImage className="footerimg" src="FooterIllustration.png"/>
                    </footer>
                </div>
            </Router>
        );
    }
});

export default App;