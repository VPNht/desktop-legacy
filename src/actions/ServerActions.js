import alt from '../alt'

class ServerActions {
  constructor() {
    this.generateActions('receiveAll')
  }
}

module.exports = alt.createActions(ServerActions)
