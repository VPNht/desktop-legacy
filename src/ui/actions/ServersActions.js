import alt  from '../alt';

class ServersActions {
  fetchServers() {
    return {};
  }

  updateServers( servers ) {
    return { servers };
  }

  updateServersError() {
    return { servers: [] };
  }
}

export default alt.createActions( ServersActions );