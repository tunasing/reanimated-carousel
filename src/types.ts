/***
 * File: /src/components/listView/carousel/types.ts
 * Project: epik
 * Author: John Chan Kah Seng (johnc@chanksis.com)
 * -----
 * Created: 19th August 2023 8:49pm
 * Modified: 25th October 2023 9:42pm     by: John Chan Kah Seng
 * -----
 * ReactNative: 0.70.2   ReactNavigation: 6.x
 * Copyright 2016 - 2023 Chanksis.
 ***/
import type {ReactElement, PropsWithChildren} from 'react';
import type {StyleProp, ViewStyle, ColorValue} from 'react-native';
import type {SharedValue, AnimatedStyleProp} from 'react-native-reanimated';
import * as RotateStyles from './rotateStyle';

export interface CarouselProps extends PropsWithChildren {
  mountIdx?: number;
  onRotate?: (e: CarouselRotateEvt) => void;
  onSelection?: (e: CarouselSelectionEvt) => void;
  onStateChange?: (e: CarouselStateChangeEvt) => void;
  indicators?: boolean;
  indicatorColor?: ColorValue;
  children:
    | ReactElement<CarouselItemHOCProps>[]
    | ReactElement<CarouselItemHOCProps>;
  style?: StyleProp<ViewStyle>;
}
type StateSharedV = {start?: number; idx?: number; indi?: number};
export interface ContainerProps extends PropsWithChildren {
  shared: SharedValue<number>;
  indicators?: boolean;
  indicatorColor?: ColorValue;
  onLayoutWidth: (w: number) => void;
  style?: StyleProp<ViewStyle>;
}

//^ Events
export interface CarouselRotateEvt {
  /**
   * increasing | decresing position percentage of horizontal panning
   * relative to width of component
   */
  offset: number;
  /** position of selected index */
  position: number;
}
export interface CarouselSelectionEvt {
  /** position of selected index */
  position: number;
}
export interface CarouselStateChangeEvt {
  /** current state of carousel */
  state: 'idle' | 'dragging' | 'settling';
  /** index of current state change origin */
  index: number;
}
//^ Higher Order Component
export interface CarouselItemHOCProps {
  index?: number;
  width?: number;
  shared?: SharedValue<number>;
  anim?: keyof typeof RotateStyles;
}
//^ Rotate Style function type
export type RotateStyle = (
  index: number,
  width: number,
  shared: SharedValue<number>,
) => AnimatedStyleProp<ViewStyle>;
