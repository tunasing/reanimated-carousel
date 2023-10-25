/***
 * File: /src/components/listView/carousel/GestureHandlerCarousel.tsx
 * Project: epik
 * Author: John Chan Kah Seng (johnc@chanksis.com)
 * -----
 * Created: 17th August 2023 6:32pm
 * Modified: 21st October 2023 5:55pm     by: John Chan Kah Seng
 * -----
 * ReactNative: 0.70.2   ReactNavigation: 6.x
 * Copyright 2016 - 2023 Chanksis.
 ***/
import React, {FunctionComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  //   Image,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  interpolate,
  Extrapolation,
  useDerivedValue,
  DerivedValue,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {Pressable} from '~/others/reanimated';
import {Image} from '~/basic';
import Asset from 'Assets';

// const {width} = Dimensions.get('window');
const images = ['LogoK3', 'LogoK2', 'LogoK3', 'LogoK3', 'LogoK2', 'LogoK3'];
const config = {
  mass: 1,
  damping: 100,
  stiffness: 500,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};
/**
 * ### Carousel
 */
export const GHCarousel = () => {
  const shared = useSharedValue(0);
  const [width, setWidth] = React.useState(0);
  const translateX = useSharedValue(0);
  const currentIndex = React.useRef(0);
  //^ GestureHandler
  const gestureHandlerFn = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx: any) => {
      translateX.value = ctx.startX + event.translationX;
      //   translateX.value = event.translationX;
    },
    onEnd: event => {
      const deltaX = event.translationX;
      const threshold = width * 0.2;

      if (deltaX > threshold && currentIndex.current > 0) {
        currentIndex.current--;
      } else if (
        deltaX < -threshold &&
        currentIndex.current < images.length - 1
      ) {
        currentIndex.current++;
      }
      translateX.value = withSpring(-currentIndex.current * width, config, () =>
        console.log(translateX.value / width),
      );
    },
  });
  //^ Scroll UAS
  const UAS = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });
  return (
    <View
      style={styles.container}
      onLayout={(e: LayoutChangeEvent) =>
        setWidth(e.nativeEvent.layout.width / 2)
      }>
      <PanGestureHandler onGestureEvent={gestureHandlerFn}>
        <Animated.View style={[styles.panel, UAS]}>
          {images.map((image, index) => (
            <SVGImageButton
              key={index}
              index={index}
              image={image}
              width={width}
              shared={translateX}
            />
          ))}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

/**
 * ## <T> SVGImageButton
 */
interface SVGImageButton {
  index: number;
  image: string;
  width: number;
  shared: SharedValue<number>;
}
/**
 * ## [FC] SVGImageButton
 */
const SVGImageButton: FunctionComponent<SVGImageButton> = ({
  index,
  image,
  width,
  shared,
}) => {
  //^ Derived
  const drv = useDerivedValue(() => {
    const offset = shared.value / -width;
    const position = Math.round(-offset);
    const ev = {offset, position, sVal: shared.value};
    // console.log(shared.value);
    console.log(`OLD[${index}]`, ev.offset);
    return isNaN(ev.offset) ? 0 : ev.offset;
  });

  //^ transform UAS
  const inputRange3 = [index - 1, index, index + 1];
  const inputRange5 = [index - 2, index - 1, index, index + 1, index + 2];

  const TUAS = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(drv.value, inputRange5, [0, 0.35, 1, 0.35, 0]);
    const translateX = interpolate(drv.value, inputRange5, [
      -width * 3.5,
      -width / 2,
      1,
      width / 2,
      width * 3.5,
    ]);
    const scale = interpolate(drv.value, inputRange3, [0.7, 1, 0.7]);
    const perspective = interpolate(drv.value, inputRange3, [700, 950, 700]);
    const rotateY = interpolate(
      drv.value,
      inputRange5,
      [180, 90, 0, -90, -180],
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
  //   console.log('SVGImageButton', index);
  return (
    <Pressable.Bounce style={[styles.pBox, TUAS]} unstable_pressDelay={200}>
      {/* <Image.Svg source={image as keyof typeof Assets.SVG} /> */}
      <Image.Svg source={image as keyof typeof Asset.SvgTag} />
    </Pressable.Bounce>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // backgroundColor: 'blue',
  },
  panel: {
    alignItems: 'center',
    flexDirection: 'row', //*
    // backgroundColor: 'pink',
    width: '50%',
    // borderWidth: 1,
  },
  pBox: {
    // flex: 1,
    width: '100%',
    // height: '100%',
    // width: width / 2,
    // height: 180,
    // marginHorizontal: 10,
    // borderWidth: 1,
  },
  image: {
    // resizeMode: 'contain',
  },
});
