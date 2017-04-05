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
            isConnecting: false,
            isConnected: false,
            ip: '',
            country: '',
            city: '',
            connectionTime: null
        };

        this.bindAction( ConnectionActions.connect, this.onConnect );
        this.bindAction( ConnectionActions.disconnect, this.onDisconnect );
        this.bindAction( ConnectionActions.updateCredentials, this.onUpdateCredentials );
    }

    onConnect() {
        this.setState({
            isConnected: true,
            connectionTime: new Date().getTime()
        });
    }

    onDisconnect() {
        this.setState({
            isConnected: false,
            connectionTime: null
        });
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