import React, { Component } from 'react';
import { Text, Animated } from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export default class AnimatedEllipsis extends Component {

  constructor(props) {
    super(props);

    this._animation_state = {
      dot_opacities: this.initializeDots(),
      target_opacity: 1,
      should_animate: true
    };
  }

  initializeDots() {
    let opacities = [];

    for (let i = 0; i < this.props.numberOfDots; i++) {
      let dot = new Animated.Value(this.props.minOpacity);
      opacities.push(dot);
    }

    return opacities;
  }

  componentDidMount() {
    this.animate_dots.bind(this)(0);
  }

  componentWillUnmount() {
    this._animation_state.should_animate = false;
  }

  animate_dots(which_dot) {
    if (!this._animation_state.should_animate) return;

    // swap fade direction when we hit end of list
    if (which_dot >= this._animation_state.dot_opacities.length) {
      which_dot = 0;
      let min = this.props.minOpacity;
      this._animation_state.target_opacity = this._animation_state.target_opacity == min ? 1 : min;
    }

    let next_dot = which_dot + 1;

    Animated.timing(this._animation_state.dot_opacities[which_dot], {
      toValue: this._animation_state.target_opacity,
      duration: this.props.animationDelay
    }).start(this.animate_dots.bind(this, next_dot));
  }

  render() {
    let dots = this._animation_state.dot_opacities.map((o, i) => React.createElement(
      Animated.Text,
      { key: i, style: { opacity: o } },
      <FontAwesome5 name={'circle'} size={this.props.style.fontSize} solid={true}/>
    ));

    return React.createElement(
      Text,
      { style: this.props.style },
      dots
    );
  }
}
AnimatedEllipsis.propTypes = {
  numberOfDots: PropTypes.number,
  animationDelay: PropTypes.number,
  minOpacity: PropTypes.number,
  style: Text.propTypes.style
};
AnimatedEllipsis.defaultProps = {
  numberOfDots: 3,
  animationDelay: 300,
  minOpacity: 0,
  style: {
    color: '#aaa',
    fontSize: 32
  }
};
