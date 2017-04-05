import alt  from '../alt';

class ConnectionActions {
  connect() {
    return {};
  }

  disconnect() {
    return {};
  }

  updateCredentials( username, password, remember ) {
    return { username, password, remember };
  }
}

export default alt.createActions( ConnectionActions );