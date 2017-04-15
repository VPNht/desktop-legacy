import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import T from 'i18n-react';
import ConnectionStore from '../stores/ConnectionStore';
import ConnectionActions from '../actions/ConnectionActions';

const formatElapsedTime = ( timeInSeconds ) => {
    timeInSeconds = _.ceil( timeInSeconds );
    const hours = Math.floor( timeInSeconds / 3600);
    const minutes = Math.floor( (timeInSeconds - (hours * 3600)) / 60 );
    const seconds = timeInSeconds - (hours * 3600) - (minutes * 60);
    return `${_.padStart( hours, 2, '0' )}:${_.padStart( minutes, 2, '0' )}:${_.padStart( seconds, 2, '0' )}`;
}

const Status = ({uptime = 0}) => (
    <section>
        <h1 className="title">{T.translate('VPN connection status')}</h1>
        <div className="connectionstatus">
            <i className="ion-ios-checkmark-empty connected"></i>
            <p>{T.translate('Connected')} - {formatElapsedTime(uptime)}</p>
        </div>
        <button className="right" onClick={ConnectionActions.disconnect}>
            <p>{T.translate('disconnect vpn')}</p>
        </button>
    </section>
);

const IP = ({ip, location}) => (
    <section className="ipOverview">
        <h1 className="title">{T.translate( 'IP and Country Overview' )}</h1>
        <p>{T.translate( 'Your New IP Address:' )}</p>
        <span>{ip || T.translate( 'Loading...' )}</span>
        <div />
        <p>{T.translate('Your New ISP Location:')}</p>
        <span>{location || T.translate( 'Loading...' )}</span>
    </section>
);

class Connection extends React.Component {
    constructor( props ) {
        super( props );

        const { connectionTime } = ConnectionStore.getState();

        this.state = {
            connectionTime,
            uptime: connectionTime ? (new Date().getTime() - connectionTime) / 1000 : 0,
            ip: '',
            location: ''
        };

        ConnectionStore.listen( ({connectionTime, ip, location}) => {
            this.setState({ connectionTime, ip, location });
        });
    }

    componentDidMount() {
        this.updateInterval = setInterval( () => {
            const { connectionTime } = this.state;

            this.setState({
                uptime: connectionTime ? (new Date().getTime() - connectionTime) / 1000 : 0
            });
        }, 1000 );
    }

    componentWillUnmount() {
        clearInterval( this.updateInterval );
    }

    render() {
        const { uptime, ip, location } = this.state;

        return (
            <div>
                <Status uptime={uptime} />
                <IP ip={ip} location={location} />
            </div>
        );
    }
}

export default Connection;
