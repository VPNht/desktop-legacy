import React, { Component } from 'react';

import packageJson from '../package.json';

export default class About extends Component {

  render() {
    return (
      <div className="preferences">
        <div className="about-content">
          <a>Go Back</a>
          <div className="items">
            <div className="item">
              <img role="presentation" src="../images/Logo.png" />
              <h4>{packageJson.name}</h4>
              <p>{packageJson.version}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
