import alt from '../alt';
import hub from '../utils/HubUtil';

class AccountServerActions {

  constructor () {
    this.generateActions(
      'loggedin',
      'loggedout'
    );
  }

}

export default alt.createActions(AccountServerActions);
