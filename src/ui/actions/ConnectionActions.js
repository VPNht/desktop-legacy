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
      uptimeInSeconds = null,
      localIP = null,
      remoteIP = null,
      uploadedBytes = null,
      downloadedBytes = null,
      error = null
    } = data;

    let status = 'disconnected';

    if( clientState === 'CONNECTING' ) {
      status = 'connecting';
    }

    if( clientState === 'CONNECTED' ) {
      switch( connectionState ) {
        case 'DISCONNECTED':
          status = 'disconnected';
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

    return { status, localIP, remoteIP, uploadedBytes, downloadedBytes, uptimeInSeconds, error };
  }

  updateStatusError(data) {
    return { status: null };
  }
}

export default alt.createActions( ConnectionActions );