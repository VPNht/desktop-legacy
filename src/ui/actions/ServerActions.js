import alt  from '../alt';

class ServerActions {
  clear() {
    return {};
  }

  fetch() {
    return {};
  }

  update( servers ) {
    return {
      servers
    };
  }

  abort() {
    return {};
  }
}

export default alt.createActions( ServerActions );