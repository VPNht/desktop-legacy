import request from 'axios';

const ENDPOINT_URL = 'http://localhost:1234';

const fetchStatus = () =>
  request( `${ENDPOINT_URL}/status` );

const connect = (username, password) => {
  username = encodeURIComponent( new Buffer( username ).toString( 'base64' ) );
  password = encodeURIComponent( new Buffer( password ).toString( 'base64' ) );
  request( `${ENDPOINT_URL}/connect?u=${username}&p=${password}` );
}

const disconnect = () => 
  request( `${ENDPOINT_URL}/disconnect` );

export default { fetchStatus, connect, disconnect };