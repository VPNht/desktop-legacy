var alt = require('../alt')

class ServerActions {
  constructor() {
    this.generateActions('receiveAll')
  }
}

module.exports = alt.createActions(ServerActions)
