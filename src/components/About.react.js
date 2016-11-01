import React from 'react';
import metrics from '../utils/MetricsUtil';
import utils from '../utils/Util';
import Router from 'react-router';
import RetinaImage from 'react-retina-image';
var packages;

try {
    packages = utils.packagejson();
} catch (err) {
    packages = {};
}

var Preferences = React.createClass({
    mixins: [Router.Navigation],
    getInitialState: function () {
        return {
            metricsEnabled: metrics.enabled()
        };
    },
    handleGoBackClick: function () {
        this.goBack();
        metrics.track('Went Back From About');
    },
    render: function () {
        return (
            <div className="preferences">
                <div className="about-content">
                    <a onClick={this.handleGoBackClick}>Go Back</a>
                    <div className="items">
                        <div className="item">
                            <RetinaImage src="vpnht-logo.png"/>
                            <h4>{packages.name}</h4>
                            <p>{packages.version}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Preferences;
