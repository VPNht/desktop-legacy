import { Link } from 'react-router';
import React, { Component } from 'react';

import { translate } from '../utils/localizationUtil';

export default class Sidebar extends Component {

  render() {
    return (
      <ul className="sidebar">
        <Link to="/dashboard" activeClassName="active">
          <li>
            <img role="presentation" src="../images/icons/Dashboard%20Icon.png" />
            <p>{translate('dashboard')}</p>
          </li>
        </Link>
        <Link to="/preferences" activeClassName="active">
          <li>
            <img role="presentation" src="../images/icons/Country%20Selection.png" />
            <p>{translate('preferences')}</p>
          </li>
        </Link>
      </ul>
    );
  }

}
