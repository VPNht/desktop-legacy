import request from 'axios';

let status = 'disconnected';
let ip = '';
let location = '';

const connect = (credentials) => {
  status = 'connecting';

  setTimeout( () => {
    status = 'connected';
    ip = '127.0.0.1';
    location = 'Manresa, Spain';
  }, 3000 );
}

const disconnect = () => {
  status = 'disconnected';
  ip = '';
  location = '';
}

const fetchStatus = () => new Promise( (resolve, reject) => {
  resolve({
    status,
    ip,
    location
  });
});

export default { connect, disconnect, fetchStatus };