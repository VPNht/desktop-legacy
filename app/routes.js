import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from './containers/App';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Preferences from './components/Preferences';

export default (
  <Route path="/" component={App}>
    <IndexRoute name="dashboard" component={Dashboard} />
    <Route name="dashboard" path="/dashboard" component={Dashboard} />
    <Route name="preferences" path="/preferences" component={Preferences} />
    <Route name="about" path="/about" component={About} />
  </Route>
);
