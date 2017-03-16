import React from 'react';
import metrics from '../utils/MetricsUtil';
import Router from 'react-router';

import Connect from './DashboardConnect.react';
import ConnectionDetails from './DashboardConnectionDetails.react';

import accountStore from '../stores/AccountStore';

var Preferences = React.createClass({
    getInitialState: function() {
        return {
            connected: accountStore.getState().connected
        };
    },

    componentDidMount: function() {
        accountStore.listen(this.update);
    },

    componentWillUnmount: function() {
        accountStore.unlisten(this.update);
    },

    update: function() {
        if (this.isMounted()) {
            this.setState({
                connected: accountStore.getState().connected
            });
        }
    },

    render: function() {

        var toMount = < Connect / > ;
        if (this.state.connected) {
            toMount = < ConnectionDetails / > ;
        }

        return ( < div className = "content-scroller"
            id = "content" > {toMount} < /div>
        );

    }

});


module.exports = Preferences;