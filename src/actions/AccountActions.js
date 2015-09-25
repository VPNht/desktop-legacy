import alt from '../alt';
import hub from '../utils/HubUtil';

class AccountActions {

  saveLogin (username, password) {
    this.dispatch({});
    hub.saveLogin(username, password);
  }

  saveSettings (key, value) {
    this.dispatch({});
    hub.saveSettings(key, value);
  }

  logout () {
    this.dispatch({});
    hub.logout();
  }

}

export default alt.createActions(AccountActions);
