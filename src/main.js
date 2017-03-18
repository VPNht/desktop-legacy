import React from 'react';
import ReactDOM from 'react-dom';
import './app';
import App from './components/App';

const { name, version, homepage } = require( '../package.json' );

ReactDOM.render(
  <App name={name} version={version} homepage={homepage} />,
  document.getElementById( 'root' )
);