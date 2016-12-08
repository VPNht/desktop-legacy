import React, { Component, PropTypes } from 'react';

export default class Option extends Component {

  static propTypes = {
    className: PropTypes.string.isRequired,
    isFocused: PropTypes.bool.isRequired,
    onFocus: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    option: PropTypes.object.isRequired
  };

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  }

  handleMouseEnter(event) {
    this.props.onFocus(this.props.option, event);
  }

  handleMouseMove(event) {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  }

  render() {
    const obj = this.props.option;
    const flagStyle = {
      display: 'inline-block',
      marginRight: 10,
      position: 'relative',
      top: -2,
      verticalAlign: 'middle'
    };

    let flag;
    if (obj.value === 'hub.vpn.ht') {
      flag = 'flag-icon';
    } else {
      if (obj && obj.country) flag = `flag-icon flag-icon-${obj.country}`;
    }

    return (
      <div className={this.props.className}
          onMouseDown={this.handleMouseDown.bind(this)}
          onMouseEnter={this.handleMouseEnter.bind(this)}
          onMouseMove={this.handleMouseMove.bind(this)}
          onClick={this.handleMouseDown.bind(this)}>
        <i className={flag} style={flagStyle} />
        {obj.label}
      </div>
    );
  }

}
