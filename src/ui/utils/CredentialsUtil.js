import accountServerActions from '../actions/AccountServerActions';
import log from '../stores/LogStore';

var CredentialsUtil = {

    username: function() {
        return localStorage.getItem('auth.username') || null;
    },

    get: function() {
        let config = CredentialsUtil._config();
        if (!config) {
            return {
                username: null,
                password: null
            };
        }

        let [username, password] = CredentialsUtil._creds(config);
        return {username, password};
    },

    save: function(username, password) {
        log.info('Username and password saved for future use');
        localStorage.setItem('auth.username', username);
        localStorage.setItem('auth.config', new Buffer(username + ':' + password).toString('base64'));
        accountServerActions.loggedin({username});
    },

    loggedin: function() {
        return CredentialsUtil._config();
    },

    logout: function() {
        accountServerActions.loggedout();
        localStorage.removeItem('auth.username');
        localStorage.removeItem('auth.config');
    },

    _config: function() {
        let config = localStorage.getItem('auth.config');
        if (!config) {
            return null;
        }
        return config;
    },

    _creds: function(config) {
        return new Buffer(config, 'base64')
            .toString()
            .split(/:(.+)?/)
            .slice(0, 2);
    }

};


module.exports = CredentialsUtil;