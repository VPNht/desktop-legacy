import alt from '../alt';
import _ from 'lodash';
import ConnectionActions from '../actions/ConnectionActions';

class ConnectionStore {
    constructor() {
        this.state = {
          isConnecting: false,
          isConnected: true,
          ip: '',
          country: '',
          city: '',
          connectionTime: null
        };

        this.bindAction( ConnectionActions.connect, this.onConnect );
        this.bindAction( ConnectionActions.disconnect, this.onDisconnect );
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
}

export default alt.createStore( ConnectionStore, 'Connection' );