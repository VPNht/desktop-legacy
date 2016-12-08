export const types = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTING: 'DISCONNECTING',
  DISCONNECTED: 'DISCONNECTED',
  NEW_IP: 'NEW_IP',
  APP_READY: 'APP_READY',
  BYTE_COUNT: 'BYTE_COUNT'
};

export function onConnect() {
  return {
    type: types.CONNECTING,
    payload: {
      connected: false,
      connecting: true,
      disconnected: false
    }
  };
}

export function onConnected() {
  return {
    type: types.CONNECTED,
    payload: {
      connected: true,
      connecting: false
    }
  };
}

export function onDisconnect() {
  return {
    type: types.DISCONNECTING,
    payload: {
      connected: false,
      disconnecting: true
    }
  };
}

export function onDisconnected() {
  return {
    type: types.DISCONNECTED,
    payload: {
      disonnected: true,
      disconecting: false
    }
  };
}

export function onNewIp(ip) {
  return {
    type: types.NEW_IP,
    payload: ip
  };
}

export function onAppReady() {
  return {
    type: types.APP_READY,
    payload: true
  };
}

export function onBytecount(bytes) {
  return {
    type: types.BYTE_COUNT,
    payload: bytes
  };
}
