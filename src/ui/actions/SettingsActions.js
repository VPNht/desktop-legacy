import alt  from '../alt';
import config from '../../config';

class SettingsActions {
  update( key, value ) {
    if( key === 'encryption' || key === 'autoPath' ) {
      this.update( 'port', 0 );
    }

    return { key, value };
  }
}

export default alt.createActions( SettingsActions );