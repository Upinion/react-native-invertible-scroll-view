'use strict';

import React, {
  PropTypes,
} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import ScrollableMixin from 'react-native-scrollable-mixin';

import cloneReferencedElement from 'react-clone-referenced-element';

type DefaultProps = {
  renderScrollComponent: (props: Object) => ReactElement;
};

let InvertibleScrollView = React.createClass({
  mixins: [ScrollableMixin],

  propTypes: {
    ...ScrollView.propTypes,
    inverted: PropTypes.bool,
    renderScrollComponent: PropTypes.func.isRequired,
  },

  getDefaultProps(): DefaultProps {
    return {
      renderScrollComponent: props => <ScrollView {...props} />,
    };
  },

  getScrollResponder(): ReactComponent {
    return this._scrollComponent.getScrollResponder();
  },

  setNativeProps(props: Object) {
    this._scrollComponent.setNativeProps(props);
  },

  render() {
    var {
      inverted,
      renderScrollComponent,
      ...props,
    } = this.props;

    if (inverted) {
      if (this.props.horizontal) {
        props.style = [styles.horizontallyInverted, props.style];
        props.children = this._renderInvertedChildren(props.children, styles.horizontallyInverted);
      } else {
        props.style = [styles.verticallyInverted, props.style];
        props.children = this._renderInvertedChildren(props.children, styles.verticallyInvertedChild);
      }
    }

    return cloneReferencedElement(renderScrollComponent(props), {
      ref: component => { this._scrollComponent = component; },
    });
  },

  _renderInvertedChildren(children, inversionStyle) {
    return React.Children.map(children, child => {
      return child ? <View style={inversionStyle}>{child}</View> : child;
    });
  },
});

let styles = StyleSheet.create({
  verticallyInvertedAndroid: {
    flex: 1,
    transform: [
      { rotate: '180deg' },
    ],
  },
  verticallyInvertedChildAndroid: {
    flex: 1,
    transform: [
      { rotate: '-180deg' },
    ],
  },
  verticallyInvertedIOS: {
    flex: 1,
    transform: [
      { rotate: '180deg' },
    ],
  },
  verticallyInvertedChildIOS: {
    flex: 1,
    transform: [
      { rotate: '-180deg' },
    ],
  },
  horizontallyInverted: {
    flex: 1,
    transform: [
      { scaleX: -1 },
    ],
  },
});

module.exports = InvertibleScrollView;
