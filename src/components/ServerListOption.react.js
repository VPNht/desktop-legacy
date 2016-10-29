import React from 'react';
import RetinaImage from 'react-retina-image';

var Option = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		mouseDown: React.PropTypes.func,
		mouseEnter: React.PropTypes.func,
		mouseLeave: React.PropTypes.func,
		option: React.PropTypes.object.isRequired,
		renderFunc: React.PropTypes.func
	},
	handleMouseDown (event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.option, event);
	},
	handleMouseEnter (event) {
		this.props.onFocus(this.props.option, event);
	},
	handleMouseMove (event) {
		if (this.props.isFocused) return;
		this.props.onFocus(this.props.option, event);
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
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseMove}
				onMouseDown={this.handleMouseDown}
				onClick={this.handleMouseDown}>
				<i className={flag} style={flagStyle}></i>
				{obj.label}
			</div>
		);
	}
});

module.exports = Option;
