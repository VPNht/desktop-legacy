import React from 'react';
import ConnectionStore from '../stores/ConnectionStore';
import ConnectionPreferences from './DashboardConnect';
import ConnectionDetails from './DashboardConnectionDetails';

class Dashboard extends React.Component {
    constructor( props ) {
        super( props );

        const { isConnected } = ConnectionStore.getState();

        this.state = { isConnected };
    }

    componentDidMount() {
        ConnectionStore.listen( ({isConnected}) => {
            this.setState({ isConnected });
        });
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