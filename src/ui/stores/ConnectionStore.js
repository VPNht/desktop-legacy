import alt from '../alt';
import _ from 'lodash';
import config from '../../config';
import LogStore from '../stores/LogStore';
import LogActions from '../actions/LogActions'
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
        this.bindAction( ConnectionActions.updateStatusError, this.onUpdateStatusError );
    }

    async onConnect( { host } ) {
        this.waitFor(LogStore.dispatchToken);

        const { port, managementPort, encryption, disableSmartDNS, username, password } = SettingsStore.getState();

        let configurationData = {};

        try {
            const { data } = await VPNConfiguration.fetchFromServer({
                host,
                port,
                managementPort,
                encryption,
                disableSmartDNS
            });

            configurationData = data;

            LogActions.addInfo(`Fetched OpenVPN configuration`);
        }
        catch( e ) {
            LogActions.addError(`Could not fetch OpenVPN configuration (${host}:${port})`);
            return;
        }   

        try {
            await VPNConfiguration.saveOnDisk( configurationData );
            LogActions.addInfo(`Saved OpenVPN configuration`);
        }
        catch( e ) {
            LogActions.addError("Could not save OpenVPN configuration. ");
            return;
        }

        try {
            await VPN.connect( username, password, managementPort );
        }
        catch( e ) {
            LogActions.addError(`Could not request new OpenVPN connection from local service.`);
            return;
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
        const previousStatus = this.state.status;

        this.setState({ status });

        if( status === 'disconnected' ){
            this.setState({ uptimeInSeconds: null });

            if( previousStatus === 'connected' ) {
                LogStore.addInfo('Succesfully disconnected.')
            }
        }

        if( status === 'connected' ) {
            this.setState({ uptimeInSeconds, remoteIP, localIP, uploadedBytes, downloadedBytes });

            LogStore.addInfo('Succesfully connected.')
        }
    }

    onUpdateStatusError() {
        setTimeout(() => {
            const {servicePort} = SettingsStore.getState();
            LogActions.addInfo(`Could not fetch status from local serivce on port ${servicePort}.`);
        }, 0);
    }
}

export default alt.createStore( ConnectionStore, 'Connection' );