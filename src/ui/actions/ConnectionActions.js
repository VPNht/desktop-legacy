import alt  from '../alt';

class ConnectionActions {
  connect( host ) {
    return { host };
  }

  disconnect() {
    return {};
  }

  fetchStatus() {
    return {};
  }

  updateStatus( {data} ) {
    const {
      clientState,
      connectionState,
      localIP = null,
      remoteIP = null,
      uploadedBytes = null,
      downloadedBytes = null
    } = data;

    let status = 'disconnected';
    
    if( clientState === 'CONNECTED' ) {
      switch( connectionState ) {
        case 'DISCONNECTED':
          status = 'DISCONNECTED';
        break;

        case 'CONNECTING':
        case 'RECONNECTING':
        case 'AUTHENTICATING':
        case 'CONFIGURATING':
          status = 'connecting';
        break;

        case 'CONNECTED':
          status = 'connected';
        break;
      }
    }
    
    return { status, localIP, remoteIP, uploadedBytes, downloadedBytes };
  }

  updateStatusError() {
    return { status: null };
  }
}

export default alt.createActions( ConnectionActions );