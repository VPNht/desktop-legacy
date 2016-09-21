import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import Select from 'react-select';

import * as ServerActions from '../actions/serverActions';
import ServerItem from './ServerListItem';
import ServerOption from './ServerListOption';

class ServerList extends Component {

  componentWillMount() {
    this.props.actions.fetchServers();
  }

  handleServer(server) {
    this.props.actions.changeServer(server);
  }

  render() {
    return (
      <section>
        <h1 className="title">Servers</h1>
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

ServerList.propTypes = {
  server: PropTypes.object.isRequired,
  servers: PropTypes.array.isRequired
};


function mapStateToProps(state) {
  return {
    server: state.serverReducer.server,
    servers: state.serverReducer.servers,
    error: state.serverReducer.error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ServerActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServerList);
