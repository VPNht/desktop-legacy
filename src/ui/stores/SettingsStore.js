import { remote } from 'electron';
import alt from '../alt';
import config from '../../config';
import SettingsActions from '../actions/SettingsActions';

class SettingsStore {
  constructor() {
    this.state = {
      servicePort: 1234,
      username: config.get( 'username' ),
      password: config.get( 'password' ),
      rememberCredentials: config.get( 'rememberCredentials' ),
      launchAtStartup: config.get( 'launchAtStartup' ),
      launchAtStartupHidden: config.get( 'launchAtStartupHidden' ),
      connectAtLaunch: config.get( 'connectAtLaunch' ),
      saveCredentials: config.get( 'saveCredentials' ),
      disableSmartDNS: config.get( 'disableSmartDNS' ),
      autoPath: config.get( 'autoPath' ),
      encryption: config.get( 'encryption' ),
      managementPort: 53813,
      port: config.get( 'port' ),
      minimizeToTaskbar: config.get( 'minimizeToTaskbar' )
    };

    this.bindAction( SettingsActions.update, this.onUpdate );
  }

  onUpdate({key, value}) {
    const { rememberCredentials } = this.state;

    this.setState({ [key]: value });

    if( rememberCredentials || (key !== 'username' && key !== 'password') ) {
      config.set( key, value );
    }

    if( key === 'minimizeToTaskbar' ) {
      remote.getCurrentWindow().setSkipTaskbar( value );
    }
  }
}

export default alt.createStore( SettingsStore, 'Settings' );