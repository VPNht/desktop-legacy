import React from 'react/addons';

import Framework from './components/Framework.react';
import Dashboard from './components/Dashboard.react';
import Preferences from './components/Preferences.react';
import About from './components/About.react';

import Router from 'react-router';

var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  render: function () {
    return (
      <RouteHandler/>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="framework" handler={Framework}>
      <Route name="dashboard" path="/dashboard" handler={Dashboard}/>
      <Route name="preferences" path="/dashboard/preferences" handler={Preferences}/>
      <Route name="about" path="/dashboard/about" handler={About}/>
    </Route>
  </Route>
);

module.exports = routes;
