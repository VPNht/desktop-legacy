import _ from 'lodash';
import bytes from 'bytes';
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

const Details = ({ip, location, uploadedBytes, downloadedBytes}) => (
    <section className="ipOverview">
        <h1 className="title">{T.translate( 'IP and Country Overview' )}</h1>
        <p>{T.translate( 'Your New IP Address:' )}</p>
        <span>{ip || T.translate( 'Loading...' )}</span>
        <div />
        <p>{T.translate('Your New ISP Location:')}</p>
        <span>{location || 'N/A'}</span>
        <div />
        <p>{T.translate('UPLOADED')}</p>
        <span>{uploadedBytes ? bytes(uploadedBytes) : 'N/A'}</span>
        <div />
        <p>{T.translate('DOWNLOADED')}</p>
        <span>{downloadedBytes ? bytes(downloadedBytes) : 'N/A'}</span>
        <div />
    </section>
);

class Connection extends React.Component {
    constructor( props ) {
        super( props );

        const { connectionTime } = ConnectionStore.getState();

        this.state = {
            connectionTime,
            uptime: connectionTime ? (new Date().getTime() - connectionTime) / 1000 : 0,
            localIP: '',
            remoteIP: '',
            location: ''
        };

        this.updateFromConnectionStore = this.updateFromConnectionStore.bind( this );
    }

    componentDidMount() {
        ConnectionStore.listen( this.updateFromConnectionStore );

        this.updateInterval = setInterval( () => {
            const { connectionTime } = this.state;

            this.setState({
                uptime: connectionTime ? (new Date().getTime() - connectionTime) / 1000 : 0
            });
        }, 1000 );
    }

    componentWillUnmount() {
        clearInterval( this.updateInterval );

        ConnectionStore.unlisten( this.updateFromConnectionStore );
    }

    updateFromConnectionStore( state ) {
        this.setState( state );
    }

    render() {
        const { uptime, remoteIP, location, uploadedBytes, downloadedBytes } = this.state;

        return (
            <div>
                <Status uptime={uptime} />
                <Details ip={remoteIP} location={location} uploadedBytes={uploadedBytes} downloadedBytes={downloadedBytes} />
            </div>
        );
    }
}

export default Connection;
