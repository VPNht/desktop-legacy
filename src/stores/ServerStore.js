import alt from '../alt';
import ServerActions from '../actions/ServerActions';

class ServerStore {
  constructor () {

    this.bindActions(ServerActions);
    this.servers = [{ value: 'hub.vpn.ht', label: 'Nearest Server (Random)', country: 'blank' }];
  }

  onReceiveAll (servers) {
    this.setState({servers});
  }

}

export default alt.createStore(ServerStore);
