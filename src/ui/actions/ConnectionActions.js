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

  updateStatus( {status} ) {
    return { status };
  }

  updateStatusError() {
    return { status: null };
  }
}

export default alt.createActions( ConnectionActions );