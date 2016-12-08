import { dispatch } from '../store';
import { info } from '../actions/logActions';
import * as accountActions from '../actions/accountActions';

export default class CredentialsUtil {

  _config() {
    const config = localStorage.getItem('auth.config');
    if (!config) return null;
    return config;
  }

  _creds(config) {
    return new Buffer(config, 'base64').toString().split(/:(.+)?/).slice(0, 2);
  }

  username() {
    return localStorage.getItem('auth.username') || null;
  }

  get() {
    const config = this._config();
    if (!config) {
      return {
        username: null,
        password: null
      };
    }

    let [
      username,
      password
    ] = this._creds(config);
    return {
      username,
      password
    };
  }

  save(username, password) {
    dispatch(info('Username and password saved for future use'));
    localStorage.setItem('auth.username', username);
    localStorage.setItem('auth.config', new Buffer(`${username}:${password}`).toString('base64'));
    // accountActions.loggedin({
    //   username
    // });
  }

  loggedin() {
    return this._config();
  }

  logout() {
    // accountActions.loggedout();
    localStorage.removeItem('auth.username');
    localStorage.removeItem('auth.config');
  }

}
