import React, { Component, PropTypes } from 'react';

export default class SingleValue extends Component {

  static propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.object.isRequired
  };

  render() {
    const obj = this.props.value;
    const flagStyle = {
      display: 'inline-block',
      marginRight: 10,
      position: 'relative',
      top: -2,
      verticalAlign: 'middle'
    };

    let flag = false;
    if (obj.value === 'hub.vpn.ht') {
      flag = 'flag-icon';
    } else {
      if (obj && obj.country) flag = `flag-icon flag-icon-${obj.country}`;
    }

		const flagItem = (
			<div>
				<i className={flag} style={flagStyle} />
				{obj.label}
	    </div>
		);

    return (
			<div className="Select-placeholder">
				{flag ? flagItem : (this.props.placeholder)}
			</div>
    );
  }

}
