/***
 * File: /src/components/listView/carousel/Container.tsx
 * Project: epik
 * Author: John Chan Kah Seng (johnc@chanksis.com)
 * -----
 * Created: 24th August 2023 6:50pm
 * Modified: 24th October 2023 1:18am     by: John Chan Kah Seng
 * -----
 * ReactNative: 0.70.2   ReactNavigation: 6.x
 * Copyright 2016 - 2023 Chanksis.
 ***/
import React, {FunctionComponent} from 'react';
import {View, StyleSheet, type LayoutChangeEvent} from 'react-native';
import {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {Icon} from '~/basic';
import type {ContainerProps} from './types';
//^ Vars `
export enum IndiState {
  none = 0,
  both = 1,
  right = 2,
  left = 3,
}
const RAIcon = Icon.Reanim;
/**
 * ### Container
 * Carousel Container, which contains pan indicators,
 * sharedValue is used to control visibility
 */
export const Container: FunctionComponent<ContainerProps> = ({
  indicators = false,
  indicatorColor = undefined,
  onLayoutWidth,
  shared,
  style,
  children,
}) => {
  //   React.useEffect(() => console.log('container:', indicators, indicatorColor));
  //^ possible upgrade to animate indicators
  const UAS_R = useAnimatedStyle(() => {
    const opacity =
      shared.value === IndiState.both || shared.value === IndiState.right
        ? withTiming(styles.both.opacity, {duration: 100})
        : withTiming(0, {duration: 100});
    const scale =
      shared.value === IndiState.both || shared.value === IndiState.right
        ? withTiming(1, {duration: 100})
        : withTiming(0, {duration: 100});
    return {
      opacity,
      transform: [{scale}],
    };
  });
  const UAS_L = useAnimatedStyle(() => {
    const opacity =
      shared.value === IndiState.both || shared.value === IndiState.left
        ? withTiming(styles.both.opacity, {duration: 100})
        : withTiming(0.15, {duration: 100});
    const scale =
      shared.value === IndiState.both || shared.value === IndiState.left
        ? withTiming(1, {duration: 100})
        : withTiming(0, {duration: 100});

    return {
      opacity,
      transform: [{scale}],
    };
  });
  return (
    <View
      style={[style, styles.container]}
      onLayout={(e: LayoutChangeEvent) => {
        onLayoutWidth(e.nativeEvent.layout.width / 2);
      }}>
      {indicators && (
        <RAIcon
          name={'angleLeft'} // angleLeftThin
          color={indicatorColor}
          style={[styles.left, UAS_L]}
        />
      )}
      {children}
      {indicators && (
        <RAIcon
          name={'angleRight'} //angleRightThin
          color={indicatorColor}
          style={[styles.right, UAS_R]}
        />
      )}
    </View>
  );
};
export default Container;
/// Styles `
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    // overflow: 'hidden',
    // borderWidth: 1,
    flexDirection: 'row',
  },
  both: {
    position: 'absolute',
    opacity: 0.5, // for when visible
    // borderWidth: 1,
    // zIndex: 100,
  },
  get left() {
    return {
      ...this.both,
      left: 0,
    };
  },
  get right() {
    return {
      ...this.both,
      right: 0,
    };
  },
});
