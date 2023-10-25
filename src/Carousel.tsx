/***
 * File: /src/components/listView/carousel/Carousel.tsx
 * Project: epik
 * Author: John Chan Kah Seng (johnc@chanksis.com)
 * -----
 * Created: 17th August 2023 6:32pm
 * Modified: 25th October 2023 9:52pm     by: John Chan Kah Seng
 * -----
 * ReactNative: 0.70.2   ReactNavigation: 6.x
 * Copyright 2016 - 2023 Chanksis.
 ***/
import React, {FunctionComponent} from 'react';
import {StyleSheet} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  withTiming,
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import Container, {IndiState as indi} from './Container';
import {createCarouselItemComponent} from './item';
import type {
  CarouselProps,
  CarouselRotateEvt,
  CarouselSelectionEvt,
} from './types';
export * from './types';
//+ Types `
type FCNamespace = {
  createCarouselItemComponent: Function;
  EventState: {[x: string]: string};
};
//^ Vars `
enum EventState {
  idle = 'idle',
  dragging = 'dragging',
  settling = 'settling',
}
/**
 * ### Carousel
 */
export const Carousel: FunctionComponent<CarouselProps> & FCNamespace = ({
  indicators = false,
  indicatorColor,
  mountIdx = 0,
  onRotate,
  onSelection: onSelected,
  onStateChange,
  style,
  children,
}) => {
  const [width, setWidth] = React.useState(0);
  const numItems = Array.isArray(children) ? children.length : 1;
  const onMountIdx = numItems === 1 ? 0 : mountIdx;
  //? container props
  const cursor = useSharedValue(0);
  const cprops = {indicators, indicatorColor, shared: cursor};
  //? carousel panGesture context
  const transX = useSharedValue(0);
  const ctx = useSharedValue({start: 0, idx: onMountIdx});
  //? useEffect to finalize width of Carousel
  React.useEffect(() => {
    //? Apply onMount context values
    transX.value = onMountIdx * -width;
    updateCursor(onMountIdx);
  }, [width]);
  //? carousel State event generators
  function emitStateChangeEvent(state: EventState, index: number) {
    'worklet';
    onStateChange && runOnJS(onStateChange)({state, index});
  }
  function emitSelectionEvent(position: CarouselSelectionEvt['position']) {
    'worklet';
    onSelected && runOnJS(onSelected)({position});
  }
  function emitRotateEvent(evt: CarouselRotateEvt) {
    'worklet';
    onRotate && runOnJS(onRotate)(evt);
  }
  function updateCursor(idx: number) {
    'worklet';
    cursor.value =
      numItems === 1
        ? indi.none
        : idx === numItems - 1
        ? indi.right
        : idx === 0
        ? indi.left
        : indi.both;
  }
  //? Gesture
  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .onStart(e => {
          ctx.value.start = transX.value;
          emitStateChangeEvent(EventState.dragging, ctx.value.idx);
        })
        .onUpdate(e => {
          //? translateX can be + / -, hence start is required
          transX.value = ctx.value.start + e.translationX;
        })
        .onEnd(e => {
          //? total distance panned(without start)
          const deltaX = e.translationX;
          //? threshold of pan width required for forward/reverse
          const threshold = width * 0.2;
          //? index handle left | right
          const target =
            numItems === 1
              ? ctx.value.idx
              : deltaX > threshold && ctx.value.idx > 0
              ? ctx.value.idx - 1
              : deltaX < -threshold && ctx.value.idx < numItems - 1
              ? ctx.value.idx + 1
              : ctx.value.idx;
          //? target is negative bcos going forward(pan Left) is always negative
          //? index will never go below 0, hence target is always negative.
          emitStateChangeEvent(EventState.settling, target);
          transX.value = withTiming(target * -width, {duration: 200}, () => {
            emitStateChangeEvent(EventState.idle, target);
            if (target === ctx.value.idx) return;
            ctx.value.idx = target;
            emitSelectionEvent(target);
            updateCursor(target);
          });
        }),
    [width],
  );
  //? Derived
  const derived = useDerivedValue(() => {
    //? transX is always negative(meant for item transition)
    const pcnt = transX.value / -width;
    //? test for whole number
    const whole = Math.floor(pcnt) === pcnt;
    //? test for non-number(happens on mount render)
    const tx = isNaN(pcnt) ? 0 : pcnt;
    //? on Rotate event callback (extracted from tx)
    emitRotateEvent({
      offset: whole ? 0 : tx % 1,
      position: Math.floor(tx),
    });
    //? tx === onRotate
    return tx;
  });
  //? Pan UAS
  const UAS = useAnimatedStyle(() => ({
    transform: [{translateX: transX.value}],
  }));
  //? Set Children props
  const modChildren = React.Children.map(children, (child, idx) => {
    const modProps = {index: idx, width: width, shared: derived};
    return React.cloneElement(child, modProps);
  });
  return (
    <Container onLayoutWidth={w => setWidth(w)} style={[style]} {...cprops}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.panel, UAS]}>{modChildren}</Animated.View>
      </GestureDetector>
    </Container>
  );
};
/// Namespace `
Carousel.createCarouselItemComponent = createCarouselItemComponent;
Carousel.EventState = EventState;
/// Styles `
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  panel: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '50%',
  },
  left: {
    position: 'absolute',
    left: 0,
  },
  right: {
    position: 'absolute',
    right: 0,
  },
});
