import alt from '../alt';
import _ from 'lodash';
import config from '../../config';
import ConnectionActions from '../actions/ConnectionActions';

class ConnectionStore {
    constructor() {
        this.state = {
            status: 'disconnected',
            ip: '',
            country: '',
            city: '',
            connectionTime: null
        };

        this.bindAction( ConnectionActions.updateStatus, this.onUpdateStatus );
        this.bindAction( ConnectionActions.updateDetails, this.onUpdateDetails );
    }

    onUpdateStatus({ status }) {
        this.setState({ status });

        if( status === 'disconnected' ){
            this.setState({ connectionTime: null });
        }

        if( status === 'connected' ) {
            const connectionTime = this.state.connectionTime || new Date().getTime();
            this.setState({ connectionTime });
        }
    }

    onUpdateDetails({ ip, location }) {
        this.setState({ ip, location });
    }
}

export default alt.createStore( ConnectionStore, 'Connection' );