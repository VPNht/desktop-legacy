import fs from 'fs';
import path from 'path';
import request from 'axios';
import promisify from 'es6-promisify';

const writeFile = promisify( fs.writeFile );

const fetchServerOVPNConfiguration = ({ host, port, managementPort, encryption, disableSmartDNS }) =>
  request( `https://vpn.ht/openvpn-desktop/${host}/${managementPort}/${port}/${encryption}/${disableSmartDNS}` );

const saveServerOVPNConfiguration = ( configuration ) =>
  writeFile( path.resolve( process.env.CONFIG_PATH, 'config.ovpn' ), configuration );

const fetchLocalOVPNServiceDetails = () => {
  return request( `http://localhost:1234/status` );
}

export default {
  fetchServerOVPNConfiguration,
  saveServerOVPNConfiguration,
  fetchLocalOVPNServiceDetails
};