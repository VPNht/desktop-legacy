import React from 'react';
import RetinaImage from 'react-retina-image';

var Option = React.createClass({
	propTypes: {
		addLabelText: React.PropTypes.string,
		className: React.PropTypes.string,
		mouseDown: React.PropTypes.func,
		mouseEnter: React.PropTypes.func,
		mouseLeave: React.PropTypes.func,
		option: React.PropTypes.object.isRequired,
		renderFunc: React.PropTypes.func
	},
	render () {
		var obj = this.props.option;
		var size = 15;
		var flagStyle = {
			display: 'inline-block',
			marginRight: 10,
			position: 'relative',
			top: -2,
			verticalAlign: 'middle',
		};
		var flag;
		if (obj.value == 'hub.vpn.ht') {
			flag = "flag-icon";
		} else {
			if (obj && obj.country) {
				flag = "flag-icon flag-icon-"+obj.country;
			}
		}

		return (
			<div className={this.props.className}
				onMouseEnter={this.props.mouseEnter}
				onMouseLeave={this.props.mouseLeave}
				onMouseDown={this.props.mouseDown}
				onClick={this.props.mouseDown}>
				<i className={flag} style={flagStyle}></i>
				{obj.label}
			</div>
		);
	}
});

module.exports = Option;
