import alt  from '../alt';

class LogActions {
  clear() {
    return {};
  }

  add( message, level ) {
    return { message, level };
  }

  addInfo( message ) {
    return this.add( message, 'INFO' );
  }

  addError( message ) {
    return this.add( message, 'ERROR' );
  }
}

export default alt.createActions( LogActions );