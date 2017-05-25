import React from 'react';
import ReactDOM from 'react-dom';
import App from './ui/components/App';
import './app';
import './ui/i18n';

const name = "VPN.ht";
const version = "0.0.4";
const homepage = "https://vpn.ht";

ReactDOM.render(
  <App name={name} version={version} homepage={homepage} />,
  document.getElementById( 'root' )
);