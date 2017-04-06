import React from 'react';
import ConnectionActions from '../actions/ConnectionActions';
import ConnectionStore from '../stores/ConnectionStore';
import ConnectionPreferences from './DashboardConnect';
import ConnectionDetails from './DashboardConnectionDetails';

class Dashboard extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            isConnected: false
        };
    }

    componentDidMount() {
        ConnectionStore.listen( ({status}) => {
            this.setState({ isConnected: status === 'connected' });
        });

        this.fetchConnectionStatus = setInterval( () => {
            ConnectionActions.fetchStatus();
        }, 100 );
    }

    componentWillUnmount() {
        clearInterval( this.fetchConnectionStatus );
    }

    render() {
        const { isConnected } = this.state;

        return (
            <div className="content-scroller" id="content">
                {isConnected ? <ConnectionDetails /> : <ConnectionPreferences />}
            </div>
        );
    }
}

export default Dashboard;