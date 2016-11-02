import alt from '../alt';
import vpnActions from '../actions/VPNActions';
var _connectionTimer = false;

class AccountStore {
    constructor() {
        this.bindActions(vpnActions);

        this.errors = {};

        this.connected = false;
        this.connecting = false;
        this.appReady = false;
        this.myip = false;
        this.bytecount = [0, 0];
        this.connectionTime = 0;
    }

    onAppReady() {
        this.setState({
            appReady: true
        });
    }

    onBytecount(bytes) {
        this.setState({
            bytecount: bytes
        });
    }

    onConnect() {
        this.setState({
            connecting: true
        });
    }

    onNewIp(ip) {
        this.setState({
            myip: ip
        });
    }

    onConnected() {
        this.setState({
            connected: true,
            connecting: false
        });
        var self = this;
        _connectionTimer = setInterval(function() {
            self.setState({
                connectionTime: self.connectionTime + 1
            });
        }, 1000);
    }

    onDisconnect() {
        // should wait to be fully disconnected?
        if (_connectionTimer) {
            clearTimeout(_connectionTimer);
        }
    }

    onDisconnected() {
        this.setState({
            connected: false,
            connecting: false,
            connectionTime: 0
        });
    }

    errors({
        errors
    }) {
        this.setState({
            errors
        });
    }

}

export default alt.createStore(AccountStore);