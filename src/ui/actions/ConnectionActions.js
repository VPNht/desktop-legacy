import alt  from '../alt';

class ConnectionActions {
  connect() {
    return {};
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