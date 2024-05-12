import {Image, Pressable, StyleSheet, Text} from 'react-native';
import React from 'react';
import {fontSize, iconSize, vidH, vidW} from '../../constants/orther';
import {Close} from '../../constants/svg';
import colors from '../../constants/colors';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface ItemPanderProps {
  item: any;
  index: number;
  isHideRemoveItem: boolean;
  onEditText: (i: any, n: number) => void;
  onRemovePicker: (n: number) => void;
  onEndMoveItem: (coor: {x: number; y: number}, index: number) => void;
}

const clamp = (val: number, min: number, max: number) => {
  return Math.min(Math.max(val, min), max);
};

const ItemPander = ({
  item,
  index,
  isHideRemoveItem,
  onEditText,
  onRemovePicker,
  onEndMoveItem,
}: ItemPanderProps) => {
  const {type, sticker, text, fontFamily, fontColor, fontBg} = item;

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {translateX: translationX.value},
      {translateY: translationY.value},
    ],
  }));

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate(event => {
      const maxH = vidH / 2;
      const maxW = vidW / 2;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxW,
        maxW,
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxH,
        maxH,
      );
    })
    .onEnd(event => {
      const {absoluteX, absoluteY} = event;

      onEndMoveItem(
        {
          x: absoluteX - iconSize,
          y: absoluteY - 100 - iconSize / 2,
        },
        index,
      );
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          type === 'sticker'
            ? styles.stickerImgContainer
            : styles.textContainer,
          animatedStyles,
        ]}>
        {type === 'sticker' ? (
          <Image source={sticker} style={styles.stickerImg} />
        ) : (
          <Pressable
            disabled={isHideRemoveItem}
            onPress={() => {
              onEditText(item, index);
            }}>
            <Text
              style={{
                fontFamily,
                backgroundColor: fontBg,
                color: fontColor,
                fontSize: fontSize,
              }}>
              {text}
            </Text>
          </Pressable>
        )}

        {!isHideRemoveItem && (
          <Pressable
            style={styles.closeBtn}
            onPress={() => {
              onRemovePicker(index);
            }}>
            <Close width={22} height={22} />
          </Pressable>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  stickerImgContainer: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.primaryYellow,
    backgroundColor: 'rgba(253, 252, 252, 0.33)',
    width: iconSize,
    height: iconSize,
  },

  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },

  stickerImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  closeBtn: {
    ...StyleSheet.absoluteFillObject,
    top: -12,
    left: '75%',
  },
});

export default ItemPander;
