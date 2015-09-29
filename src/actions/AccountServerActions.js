import alt from '../alt';

class AccountServerActions {

  constructor () {
    this.generateActions(
      'loggedin',
      'loggedout'
    );
  }

}

export default alt.createActions(AccountServerActions);
