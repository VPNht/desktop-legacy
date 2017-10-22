import alt from '../alt';
import _ from 'lodash';
import config from '../../config';
import ConnectionActions from '../actions/ConnectionActions';
import SettingsStore from '../stores/SettingsStore';
import VPNConfiguration from '../api/vpnConfiguration'
import VPN from '../api/vpn';

let status = 'disconnected';

const StatusSource = {
  update: {
    remote() {
      return VPN.fetchStatus();
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
            uptimeInSeconds: null
        };

        this.registerAsync( StatusSource );
        this.bindAction( ConnectionActions.connect, this.onConnect );
        this.bindAction( ConnectionActions.disconnect, this.onDisconnect );
        this.bindAction( ConnectionActions.fetchStatus, this.onFetchStatus );
        this.bindAction( ConnectionActions.updateStatus, this.onUpdateStatus );
    }

    async onConnect( { host } ) {
        try {
            const { port, managementPort, encryption, disableSmartDNS, username, password } = SettingsStore.getState();

            const { data } = await VPNConfiguration.fetchFromServer({
                host,
                port,
                managementPort,
                encryption,
                disableSmartDNS
            });

            await VPNConfiguration.saveOnDisk( data );
            await VPN.connect( username, password, managementPort );
        }
        catch( e ) {
          console.log( e );
        }
    }

    onDisconnect() {
      VPN.disconnect();
    }

    onFetchStatus() {
        const instance = this.getInstance();

        if( instance.isLoading() === false ) {
            instance.update();
        }
    }

    onUpdateStatus({ status, localIP, remoteIP, uploadedBytes, downloadedBytes, uptimeInSeconds }) {
        this.setState({ status });

        if( status === 'disconnected' ){
            this.setState({ uptimeInSeconds: null });
        }

        if( status === 'connected' ) {
            this.setState({ uptimeInSeconds, remoteIP, localIP, uploadedBytes, downloadedBytes });
        }
    }
}

export default alt.createStore( ConnectionStore, 'Connection' );