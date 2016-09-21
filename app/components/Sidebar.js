import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Sidebar extends Component {

  render() {
    return (
      <ul className="sidebar">
        <Link to="/dashboard">
          <li>
            <p>dashboard</p>
            <img role="presentation" src="../images/icons/Dashboard%20Icon.png" />
          </li>
        </Link>
        <Link to="/preferences">
          <li>
            <p>preferences</p>
            <img role="presentation" src="../images/icons/Country%20Selection.png" />
          </li>
        </Link>
      </ul>
    );
  }

}
