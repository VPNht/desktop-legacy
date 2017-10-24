import request from 'axios';
import SettingsStore from '../stores/SettingsStore'

const fetchStatus = () => {
	const {servicePort} = SettingsStore.getState();
  return request( `http://localhost:${servicePort}/status` );
}

const connect = (username, password, port) => {
	const {servicePort} = SettingsStore.getState();
  username = encodeURIComponent( new Buffer( username ).toString( 'base64' ) );
  password = encodeURIComponent( new Buffer( password ).toString( 'base64' ) );
  return request( `http://localhost:${servicePort}/connect?u=${username}&p=${password}&mp=${port}` );
}

const disconnect = () => {
	const {servicePort} = SettingsStore.getState();
  return request( `http://localhost:${servicePort}/disconnect` );
}

export default { fetchStatus, connect, disconnect };