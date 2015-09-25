import React from 'react/addons';
import RetinaImage from 'react-retina-image';
import accountStore from '../stores/AccountStore';

var SubHeader = React.createClass({

  getInitialState: function () {
    return {
      connected: accountStore.getState().connected
    };
  },

  componentDidMount: function () {
    accountStore.listen(this.update);
  },

  componentWillUnmount: function () {
    accountStore.unlisten(this.update);
  },

  update: function () {
    if (this.isMounted()) {
        this.setState({
          connected: accountStore.getState().connected
        });
    }
  },

  render: function () {
    var status;
    var greenGuyClass = 'greenguy';
    if (this.state.connected) {
        status = (
            <div className="status">
                <p className="connected">connected!</p>
                <span>Your internet traffic is now encrypted! and your online identity has become anonymous.</span>
            </div>
        );
        greenGuyClass += ' connected';
    } else {
        status = (
            <div className="status">
                <p className="disconnected">not connected!</p>
                <span>Your internet traffic is unencrypted and your online identity is exposed.</span>
            </div>
        );
    }
    return (
        <header>
            <RetinaImage className="logo" src="Logo.png"/>
            <RetinaImage className={greenGuyClass} src="Figure.png"/>
            {status}
        </header>
    );
  }
});

module.exports = SubHeader;
