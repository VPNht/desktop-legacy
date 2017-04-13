import { shell } from 'electron';
import React from 'react';
import T from 'i18n-react';
import RetinaImage from 'react-retina-image';

class About extends React.Component {
    constructor( props ) {
        super( props );
    }

    goBack() {
        history.back();
    }

    render() {
        const { packageName, packageVersion, homepageURL } = this.props;

        return (
            <div className="preferences">
                <div className="about-content">
                    <a className="goback ion-android-arrow-back" onClick={() => this.goBack()}></a>

                    <div className="items">
                        <div className="item">
                            <RetinaImage src="monster-left.png"/>
                            <h4>{T.translate('Plug and play!')}</h4>
                            <p>{T.translate('You can start using our service, and start surfing in privacy, as soon as you create an account.')}</p>
                        </div>
                        <div className="item">
                            <RetinaImage src="monster-right.png"/>
                            <h4>{T.translate('No logs')}</h4>
                            <p>{T.translate('You value your privacy. So do we. We don’t keep logs, we don’t know the sites you have visited or the applications you’ve used.')}</p>
                        </div>
                    </div>

                    <div className="foot">
                        {packageName} v{packageVersion} - <a onClick={() => shell.openExternal(homepageURL)}>{homepageURL}</a>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = About;
