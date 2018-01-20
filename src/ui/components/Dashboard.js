import _ from 'lodash';
import React from 'react';
import T from 'i18n-react';
import ConnectionActions from '../actions/ConnectionActions';
import ConnectionStore from '../stores/ConnectionStore';
import Authentication from './DashboardAuthentication';
import Connection from './DashboardConnection';

class Dashboard extends React.Component {
    constructor( props ) {
        super( props );

        const { status } = ConnectionStore.getState();

        this.state = {
            isConnected: status === "connected"
        };

        this.updateFromConnectionStore = this.updateFromConnectionStore.bind( this );
    }

    componentDidMount() {
        ConnectionStore.listen( this.updateFromConnectionStore );

        this.fetchConnectionStatus = setInterval( () => {
            ConnectionActions.fetchStatus();
        }, 100 );
    }

    componentWillUnmount() {
        ConnectionStore.unlisten( this.updateFromConnectionStore );

        clearInterval( this.fetchConnectionStatus );
    }

     updateFromConnectionStore( {status} ) {
        const wasConnected = this.state.isConnected;
        const isConnected = status === 'connected';
        this.setState({ isConnected });

        if (wasConnected !== isConnected) {
            const action = isConnected ? 'CONNECTED' : 'DISCONNECTED';
            const message = _.map(T.translate(`NOTIFICATION_${action}`), (value) => {
                return typeof value == "string" ? value : "\n";
            }).join("");

            new Notification('VPN.ht', {
                body: message
            });
        }
    }

    render() {
        const { isConnected } = this.state;

        return (
            <div className="content-scroller" id="content">
                {isConnected ? <Connection /> : <Authentication />}
            </div>
        );
    }
}

export default Dashboard;