import { remote } from 'electron';
import alt from '../alt';
import LogActions from '../actions/LogActions';
import T from 'i18n-react';

class LogStore {
  constructor() {
    this.state = {
      messages: []
    };

    this.bindAction( LogActions.clear, this.onClear );
    this.bindAction( LogActions.add, this.onAdd );
  }

  onClear() {
    const messages = [];
    this.setState({ messages });
  }

  onAdd( {message, level} ) {
    const { messages } = this.state;
    const timestamp = new Date();
    messages.push( `[${level}] ${timestamp.toLocaleString()} ${message}` );
    this.setState({ messages });
  }
}

export default alt.createStore( LogStore, 'Log' );