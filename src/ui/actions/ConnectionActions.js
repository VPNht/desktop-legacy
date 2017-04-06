import alt  from '../alt';
import VPN from '../api/vpn';

class ConnectionActions {
  connect() {
    VPN.connect();
    return {};
  }

  disconnect() {
    VPN.disconnect();
    return {};
  }

  fetchStatus() {
    return async () => {
      const { status, ip, location } = await VPN.fetchStatus();

      this.updateStatus( status );

      if( status === 'connected' ) {
        this.updateDetails( ip, location );
      }
    }
  }

  updateStatus( status ) {
    return { status };
  }

  updateDetails( ip, location ) {
    return { ip, location };
  }

  updateCredentials( username, password, remember ) {
    return { username, password, remember };
  }
}

export default alt.createActions( ConnectionActions );