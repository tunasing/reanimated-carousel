/***
 * File: /src/components/listView/carousel/rotateStyle.ts
 * Project: epik
 * Author: John Chan Kah Seng (johnc@chanksis.com)
 * -----
 * Created: 20th August 2023 12:23am
 * Modified: 14th October 2023 11:13am     by: John Chan Kah Seng
 * -----
 * ReactNative: 0.70.2   ReactNavigation: 6.x
 * Copyright 2016 - 2023 Chanksis.
 ***/
import {useAnimatedStyle, interpolate} from 'react-native-reanimated';
import type {RotateStyle} from './types';

export const circular: RotateStyle = (index, width, shared) => {
  //? input Ranges
  const inputRange3 = [index - 1, index, index + 1];
  const inputRange5 = [index - 2, index - 1, index, index + 1, index + 2];
  //? AnimatedStyle
  const UAS = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      shared.value,
      inputRange5,
      [0, 0.25, 1, 0.25, 0],
    );
    const translateX = interpolate(shared.value, inputRange5, [
      -width * 3.5,
      -width / 2,
      1,
      width / 2,
      width * 3.5,
    ]);
    const scale = interpolate(shared.value, inputRange3, [0.7, 1, 0.7]);
    const perspective = interpolate(shared.value, inputRange3, [700, 950, 700]);
    const rotateY = interpolate(
      shared.value,
      inputRange5,
      [180, 80, 0, -80, -180],
    );
    return {
      opacity,
      transform: [
        {scale},
        {perspective},
        {translateX},
        {rotateY: `${rotateY}deg`},
      ],
    };
  });
  return UAS;
};
