import React from 'react';
import Router from 'react-router';
import Select from 'react-select';
import config from '../../config';
import T from 'i18n-react';
import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';

const General = ({settings}) => {
    const {
        username,
        password,
        connectAtLaunch,
        launchAtStartup,
        launchAtStartupHidden,
        disableSmartDNS,
        port,
        minimizeToTaskbar
    } = settings;

    const hasCredentials = username !== '' && password !== '';

    return (
        <section>
            <h1 className="title">{T.translate('General')}</h1>

            <div className="checkbox">
                <input
                    id="credentials"
                    type="checkbox"
                    disabled={!hasCredentials}
                    value={connectAtLaunch}
                    checked={connectAtLaunch}
                    onChange={() => SettingsActions.update( 'connectAtLaunch', !connectAtLaunch )}/>
                <label htmlFor="credentials">
                    <p>{T.translate('Auto-connect after launch (requires a saved user/pass)')}</p>
                </label>
            </div>

            <div className="checkbox">
                <input
                    id="startup"
                    type="checkbox"
                    value={launchAtStartup}
                    checked={launchAtStartup}
                    onChange={() => SettingsActions.update( 'launchAtStartup', !launchAtStartup )}/>
                <label htmlFor="startup">
                    <p>{T.translate('Launch on operating system startup')}</p>
                </label>
            </div>

            <div className="checkbox">
                <input
                    id="launchStartupHidden"
                    type="checkbox"
                    value={launchAtStartupHidden}
                    checked={launchAtStartupHidden}
                    onChange={() => SettingsActions.update( 'launchAtStartupHidden', !launchAtStartupHidden )} />
                <label htmlFor="launchStartupHidden">
                    <p>{T.translate('Launch on operating system startup hidden')}</p>
                </label>
            </div>

            <div className="checkbox">
                <input
                    id="disableSmartdns"
                    type="checkbox"
                    value={disableSmartDNS}
                    checked={disableSmartDNS}
                    onChange={() => SettingsActions.update( 'disableSmartDNS', !disableSmartDNS )} />
                <label htmlFor="disableSmartdns">
                    <p>{T.translate('Disable SmartDNS')}</p>
                </label>
            </div>

            <div className="checkbox">
                <input
                    id="minToTaskbar"
                    type="checkbox"
                    value={minimizeToTaskbar}
                    checked={minimizeToTaskbar}
                    onChange={() => SettingsActions.update( 'minimizeToTaskbar', !minimizeToTaskbar )} />
                <label htmlFor="minToTaskbar">
                    <p>{T.translate('Minimize to taskbar')}</p>
                </label>
            </div>
        </section>
    );
}

const Encryption = ({encryptions, selected}) => (
    <section className="preferences">
        <h1 className="title">{T.translate('Encryption')}</h1>
        <div className="selectbox">
            <Select
                name="encryption"
                value={selected}
                options={encryptions}
                onChange={({value}) => SettingsActions.update( 'encryption', value )}
                searchable={false}
                clearable={false} />
        </div>
    </section>
);

const Port = ({ports, selected}) => (
    <section className="port">
        <h1 className="title">{T.translate('Custom Port')}</h1>
        <div className="selectbox">
            <Select
                name="port"
                value={selected}
                options={ports}
                onChange={({value}) => SettingsActions.update( 'port', value )}
                searchable={false}
                clearable={false} />
        </div>
    </section>
);

const AutoPath = ({enabled}) => (
    <section className="preferences">
        <h1 className="title">{T.translate('Auto Path')}</h1>
        <div className="checkbox">
            <input type="checkbox" id="autopath" value={enabled} onChange={() => SettingsActions.update( 'autoPath', !enabled)} />
            <label htmlFor="autopath">
                <p>{T.translate( enabled ? 'Enabled' : 'Disabled')}</p>
            </label>
            <p className="info">{T.translate('Feature that tries alternate ports in order to resolve certain types of connections issues.')}</p>
        </div>
    </section>
);

class Preferences extends React.Component {
    constructor( props ) {
        super( props );

        this.state = SettingsStore.getState();
    }

    componentDidMount() {
        SettingsStore.listen( (settings) => {
            this.setState( settings );
        });
    }

    render() {
        const { autoPath, encryption, port } = this.state;

        const encryptions = [
            { value: 128, label: '128 BIT AES' },
            { value: 256, label: '256 bit AES' }
        ];

        if( autoPath === false ) {
            encryptions.push({ value: 64, label: '64 BIT BLOWFISH' });
        }

        const ports = [
            { value: 0, label: T.translate( 'Default' ) }
        ];

        if( encryption === 128 ) {
            ports.push({ value: 53, label: 'UDP - 53' });
            ports.push({ value: 443, label: 'TCP - 443' });
            ports.push({ value: 80, label: 'TCP - 80' });
        }

        if( encryption === 256 ) {
            ports.push({ value: 3389, label: 'UDP - 3389' });
        }

        return (
            <div id="content">
                <General settings={this.state} />
                <Encryption encryptions={encryptions} selected={encryption} />
                {!autoPath ? <Port ports={ports} selected={port} /> : null}
                <AutoPath enabled={autoPath}/>
            </div>
        );
    }
}

export default Preferences;