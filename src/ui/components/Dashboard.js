import React from 'react';
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
        this.setState({ isConnected: status === 'connected' });
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