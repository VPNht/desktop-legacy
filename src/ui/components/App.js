import { shell } from 'electron';
import $ from 'jquery';
import app, { ipcMain, remote } from 'electron';
import _ from 'lodash';
import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import RetinaImage from 'react-retina-image';
import Menu from './Menu';
import Header from './Header';
import Dashboard from './Dashboard';
import Preferences from './Preferences';
import About from './About';
import Logs from './Logs';

class App extends Component {
    constructor( props ) {
        super( props );
    }

    componentDidMount() {
        app.ipcRenderer.emit( 'ui.ready' );
    }

    render() {
        const { name, version, homepage } = this.props;

        return (
            <Router>
                <div>
                    <Header />

                    <div className="content-container">
                        <Menu />
                        <Route exact path="/" render={() => (<Dashboard />)} />
                        <Route exact path="/preferences" component={Preferences} />
                        <Route exact path="/about" render={() => (
                            <About packageName={name} packageVersion={version} homepageURL={homepage} />
                        )} />
                        <Route exact path="/logs" render={() => (<Logs />)} />
                    </div>

                    <footer>
                        <RetinaImage className="footerimg" src="footer.png"/>
                    </footer>
                </div>
            </Router>
        );
    }
}

export default App;