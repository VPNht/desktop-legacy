import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

import { fetchServers, changeServer } from '../actions/serverActions';
import { onAppReady } from '../actions/accountActions';
import { translate } from '../utils/localizationUtil';
import ServerItem from './ServerListItem';
import ServerOption from './ServerListOption';

@connect(store => {
  return {
    server: store.serverReducer.server,
    servers: store.serverReducer.servers,
    error: store.serverReducer.error
  };
})
export default class ServerList extends Component {

  static propTypes = {
    server: PropTypes.object,
    servers: PropTypes.array.isRequired,
    error: PropTypes.string
  };

  componentWillMount() {
    this.props.dispatch(fetchServers());
  }

  handleServer(server) {
    this.props.dispatch(changeServer(server));
  }

  render() {
    return (
      <section>
        <h1 className="title">{translate('Servers')}</h1>
        <Select
          name="server"
          value={this.props.server}
          options={this.props.servers}
          onChange={this.handleServer.bind(this)}
          placeholder="Select server"
          optionComponent={ServerOption}
          valueComponent={ServerItem}
        />
      </section>
    );
  }

}
