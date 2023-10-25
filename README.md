# reanimated-carousel

![pressable-carousel](https://github.com/tunasing/reanimated-carousel/assets/5899265/f279a56e-27e4-41e6-8ed6-dc7111459571)

## Feature

-   ability to turn pan indicators on/off, and set `indicatorColor`
-   set pan index on mount.
-   emits `onRotate | onSelection | onStateChange` events.
-   ability to customize item rotate style in `rotateStyle.ts`, and set the `anim` property in each carousel item.
-   item components are created via HOC.
-   enhanced with react-native-reanimated.

## Instructions

-   create carousel items using `Carousel.createCarouselItemComponent`
-   add all items as children to `<Carousel/>` component.

```
        const CRSitem = createCarouselItemComponent(Image.Svg);

    return (
        <Carousel
          indicators={true}
          indicatorColor={card}
          mountIdx={mountIdx}
          onSelection={onSelectionFn}
          onStateChange={onStateChangeFn}>
          {items.map((x, i) => (
            <CRSitem key={i} source={x.icon} fill={card} />
          ))}
        </Carousel>
    )
```

## Pre-requisites

-   react-native-reanimated (package)
-   react-native-gesture-handler (package)

## compatability

-   ios
-   android
