import alt from '../alt';
import _ from 'lodash';
import config from '../../config';
import ConnectionActions from '../actions/ConnectionActions';

class ConnectionStore {
    constructor() {
        const username = config.get( 'username' );
        const password = config.get( 'password' );

        this.state = {
            username,
            password,
            remember: username !== '' || password !== '',
            status: 'disconnected',
            ip: '',
            country: '',
            city: '',
            connectionTime: null
        };

        this.bindAction( ConnectionActions.updateStatus, this.onUpdateStatus );
        this.bindAction( ConnectionActions.updateDetails, this.onUpdateDetails );
        this.bindAction( ConnectionActions.updateCredentials, this.onUpdateCredentials );
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

    onUpdateCredentials( {username, password, remember} ) {
        config.set({
            username: remember ? username : '',
            password: remember ? password : ''
        });

        this.setState({ username, password, remember });
    }
}

export default alt.createStore( ConnectionStore, 'Connection' );