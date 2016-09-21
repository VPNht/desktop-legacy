
export function onConnect() {
  return {
    type: 'CONNECTING',
    payload: {
      connected: false,
      connecting: true,
      disconnected: false
    }
  };
}

export function onConnected() {
  return {
    type: 'CONNECTED',
    payload: {
      connected: true,
      connecting: false
    }
  };
}

export function onDisconnect() {
  return {
    type: 'DISCONNECTING',
    payload: {
      connected: false,
      disconnecting: true
    }
  };
}

export function onDisconnected() {
  return {
    type: 'DISCONNECTED',
    payload: {
      disonnected: true,
      disconecting: false
    }
  };
}

// export function onNewIp(ip) {
//   return {
//     type: 'NEW_IP',
//     payload: ip
//   };
// };
//
// export function onAppReady() {
//   return {
//     type: 'APP_READY',
//     payload: true
//   };
// };
//
// export function onBytecount(bytes) {
//   return {
//     type: 'BYTE_COUNT',
//     payload: bytes
//   };
// };

// export function onConnected() {
//   this.setState({
//     connected: true,
//     connecting: false
//   });
//
//   const self = this;
//   _connectionTimer = setInterval(function() {
//     self.setState({
//       connectionTime: self.connectionTime + 1
//     });
//   }, 1000);
// };
//
// export function onDisconnect() {
//   if (_connectionTimer) clearTimeout(_connectionTimer);
// };
//
// export function onDisconnected() {
//   this.setState({
//     connected: false,
//     connecting: false,
//     connectionTime: 0
//   });
// };

// errors({ errors }) {
//   this.setState({ errors });
// };
