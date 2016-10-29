import React from 'react';
import RetinaImage from 'react-retina-image';

var SingleValue = React.createClass({
	propTypes: {
		placeholder: React.PropTypes.string,
		value: React.PropTypes.object
	},
	render () {
		var obj = this.props.value;
		var size = 15;
		var flagStyle = {
			display: 'inline-block',
			marginRight: 10,
			position: 'relative',
			top: -2,
			verticalAlign: 'middle'
		};
        var placeHolderStyle = {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }

		var flag = false;
		if (obj.value == 'hub.vpn.ht') {
			flag = "flag-icon";
		} else {
			if (obj && obj.country) {
				flag = "flag-icon flag-icon-"+obj.country;
			}
		}
		return (
			<div className="Select-placeholder">
					{flag ? (
						<div style={placeHolderStyle}>
							<i className={flag} style={flagStyle}></i>
							{obj.label}
						</div>
					) : (
						this.props.placeholder
					)
				}
			</div>
		);

	}
});

module.exports = SingleValue;
