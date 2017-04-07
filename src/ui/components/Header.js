import React, { Component } from 'react';
import T from 'i18n-react';
import Image from 'react-retina-image';
import ConnectionStore from '../stores/ConnectionStore';

const ConnectedStatus = () => (
    <div>
        <Image className="figure connected" src="Figure.png"/>
        <p className="connected">{T.translate('connected!')}</p>
        <span>{T.translate('Your internet traffic is now encrypted! and your online identity has become anonymous.')}</span>
    </div>
);

const DisconnectedStatus = () => (
    <div>
        <Image className="figure disconnected" src="Figure.png"/>
        <p className="disconnected">{T.translate('not connected!')}</p>
        <span>{T.translate('Your internet traffic is unencrypted and your online identity is exposed.')}</span>
    </div>
);

class Header extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            isConnected: false
        };
    }

    componentDidMount() {
        ConnectionStore.listen( ({status}) => {
            this.setState({
                isConnected: status === 'connected'
            });
        });
    }

    render() {
        const { isConnected  } = this.state;

        return (
            <header>
                <Image className="logo" src="Logo.png"/>
                <div className="status">
                    {isConnected ? <ConnectedStatus /> : <DisconnectedStatus />}
                </div>
            </header>
        );
    }
}

export default Header;