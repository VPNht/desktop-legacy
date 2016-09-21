import React, { Component, PropTypes } from 'react';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SubHeader from '../components/SubHeader';

export default class App extends Component {

  render() {
    return (
      <div>
        <Header />
        <SubHeader />
        <div className="content-container">
          <Sidebar />
          {this.props.children}
        </div>
        <footer>
          <img role="presentation" className="footerimg" src="../images/FooterIllustration.png" />
        </footer>
      </div>
    );
  }

}

App.propTypes = {
  children: PropTypes.element
};
