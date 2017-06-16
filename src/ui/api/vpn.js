import request from 'axios';

const ENDPOINT_URL = 'http://localhost:1234';

const fetchStatus = () =>
  request( `${ENDPOINT_URL}/status` );

const connect = (username, password, port) => {
  username = encodeURIComponent( new Buffer( username ).toString( 'base64' ) );
  password = encodeURIComponent( new Buffer( password ).toString( 'base64' ) );
  return request( `${ENDPOINT_URL}/connect?u=${username}&p=${password}&mp=${port}` );
}

const disconnect = () =>
  request( `${ENDPOINT_URL}/disconnect` );

export default { fetchStatus, connect, disconnect };