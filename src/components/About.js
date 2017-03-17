import {shell} from 'electron';
import React from 'react';
import metrics from '../utils/MetricsUtil';
import utils from '../utils/Util';
import {t} from '../utils/localizationUtil';
import Router from 'react-router';
import RetinaImage from 'react-retina-image';
import pkJson from '../package';
var packages;

try {
    packages = utils.packagejson();
} catch (err) {
    packages = {};
}

var Preferences = React.createClass({
    getInitialState: function () {
        return {
            metricsEnabled: metrics.enabled()
        };
    },
    handleGoBackClick: function () {
        history.back();
        metrics.track('Went Back From About');
    },
    handleExternal: function () {
        shell.openExternal(pkJson.homepage);
    },
    render: function () {
        return (
            <div className="preferences">
                <div className="about-content">
                    <a className="goback ion-android-arrow-back" onClick={this.handleGoBackClick}></a>

                    <div className="items">
                        <div className="item">
                            <RetinaImage src="monster-left.png"/>
                            <h4>{t('Plug and play!')}</h4>
                            <p>{t('You can start using our service, and start surfing in privacy, as soon as you create an account.')}</p>
                        </div>
                        <div className="item">
                            <RetinaImage src="monster-right.png"/>
                            <h4>{t('No logs')}</h4>
                            <p>{t('You value your privacy. So do we. We don’t keep logs, we don’t know the sites you have visited or the applications you’ve used.')}</p>
                        </div>
                    </div>

                    <div className="foot">
                        {packages.name} v{packages.version} - <a onClick={this.handleExternal}>{pkJson.homepage}</a>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Preferences;
