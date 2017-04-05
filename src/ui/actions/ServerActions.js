import alt  from '../alt';

class ServerActions {
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