import { shell } from 'electron';
import $ from 'jquery';
import _ from 'lodash';
import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import RetinaImage from 'react-retina-image';
import Menu from './Menu';
import Header from './Header';
import SubHeader from './SubHeader';
import Dashboard from './Dashboard';
import Preferences from './Preferences';
import About from './About';

class App extends Component {
    constructor( props ) {
        super( props );
    }

    render() {
        const { name, version, homepage } = this.props;

        return (
            <Router>
                <div>
                    <Header />
                    <SubHeader />

                    <div className="content-container">
                        <Menu />
                        <Route exact path="/" render={() => (<Dashboard />)} />
                        <Route exact path="/preferences" component={Preferences} />
                        <Route exact path="/about" render={() => (
                            <About packageName={name} packageVersion={version} homepageURL={homepage} />
                        )}/>
                    </div>

                    <footer>
                        <RetinaImage className="footerimg" src="FooterIllustration.png"/>
                    </footer>
                </div>
            </Router>
        );
    }
}

export default App;