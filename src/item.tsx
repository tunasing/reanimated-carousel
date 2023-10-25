/***
 * File: /src/components/listView/carousel/item.tsx
 * Project: epik
 * Author: John Chan Kah Seng (johnc@chanksis.com)
 * -----
 * Created: 23rd August 2023 12:58pm
 * Modified: 14th October 2023 2:58pm     by: John Chan Kah Seng
 * -----
 * ReactNative: 0.70.2   ReactNavigation: 6.x
 * Copyright 2016 - 2023 Chanksis.
 ***/
import {StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import * as RotateStyles from './rotateStyle';
import type {CarouselItemHOCProps} from './types';
/**
 * #### createCarouselItemComponent
 */
export function createCarouselItemComponent<P extends Object>(
  CPN: React.ComponentType<P>,
): React.FC<P & CarouselItemHOCProps> {
  const HOC = ({
    anim = 'circular',
    index,
    width,
    shared,
    ...rest
  }: CarouselItemHOCProps) => {
    //? carousel rotation style
    const UAS =
      index !== undefined && width !== undefined && shared !== undefined
        ? RotateStyles[anim](index, width, shared)
        : undefined;
    return (
      <Animated.View style={[styles.box, UAS]}>
        <CPN {...(rest as P)} />
      </Animated.View>
    );
  };

  return HOC;
}
/// Styles `
const styles = StyleSheet.create({
  box: {width: '100%'},
});
