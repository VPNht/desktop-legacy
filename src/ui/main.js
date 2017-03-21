import React from 'react';
import ReactDOM from 'react-dom';
import App from './ui/components/App';
import './app';
import './ui/i18n';

const { name, version, homepage } = require( '../package.json' );

ReactDOM.render(
  <App name={name} version={version} homepage={homepage} />,
  document.getElementById( 'root' )
);