import alt from '../alt';
import _ from 'lodash';
import config from '../../config';
import ConnectionActions from '../actions/ConnectionActions';
import SettingsStore from '../stores/SettingsStore';
import API from '../api/api';

let status = 'disconnected';

const StatusSource = {
  update: {
    async remote() {
      return { status };
    },

    local() {
      return null;
    },

    shouldFetch( state ) {
      return true;
    },

    success: ConnectionActions.updateStatus,
    error: ConnectionActions.updateStatusError
  }
};

class ConnectionStore {
    constructor() {
        this.state = {
            status: 'disconnected',
            ip: '',
            country: '',
            city: '',
            connectionTime: null
        };

        this.registerAsync( StatusSource );
        this.bindAction( ConnectionActions.connect, this.onConnect );
        this.bindAction( ConnectionActions.disconnect, this.onDisconnect );
        this.bindAction( ConnectionActions.fetchStatus, this.onFetchStatus );
        this.bindAction( ConnectionActions.updateStatus, this.onUpdateStatus );
    }

    async onConnect( { host } ) {
        try {
            const { port, managementPort, encryption, disableSmartDNS } = SettingsStore.getState();

            const { data } = await API.fetchServerOVPNConfiguration({
                host,
                port,
                managementPort,
                encryption,
                disableSmartDNS
            });

            await API.saveServerOVPNConfiguration( data );

            status = 'connected';
        }
        catch( e ) {
            status = 'disconnected';
        }
    }

    onDisconnect() {
        status = 'disconnected';
    }

    onFetchStatus() {
        const instance = this.getInstance();

        if( instance.isLoading() === false ) {
            instance.update();
        }
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
}

export default alt.createStore( ConnectionStore, 'Connection' );