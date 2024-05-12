import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {Back, Remove, Share, VideoAction} from '../../constants/svg';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import TextCustom from '../../components/TextCustom';
import {width} from '../../constants/orther';

interface HeaderVideoEditedProps {
  onBack: () => void;
  onShare: () => void;
  onRemove: () => void;
}

const iconSize = 32;
const actionVidColor = '#F2A229';

const HeaderVideoEdited = (props: HeaderVideoEditedProps) => {
  const {onBack, onShare, onRemove} = props;

  const actionVid = useSharedValue<boolean>(false);

  const actionVidStyle = useAnimatedStyle(() => {
    const opacity = interpolate(actionVid.value, [false, true], [0, 1]);
    const pointerEvents = actionVid.value ? 'auto' : 'none';

    return {opacity, pointerEvents};
  });

  const handlePressVidAction = () => {
    actionVid.value = withTiming(!actionVid.value, {duration: 300});
  };

  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={onBack}>
        <Back width={iconSize} height={iconSize} fill={'#FAC90A'} />
      </Pressable>
      <Pressable onPress={handlePressVidAction}>
        <VideoAction width={iconSize} height={iconSize} />

        <Animated.View style={[actionVidStyle, styles.actionBtnContainer]}>
          <Pressable
            onPress={onShare}
            style={[
              styles.actionBtn,
              {borderBottomWidth: 1, borderBottomColor: actionVidColor},
            ]}>
            <TextCustom
              text={'Share'}
              color={actionVidColor}
              style={styles.actionVidText}
            />
            <Share width={22} height={22} />
          </Pressable>
          <Pressable onPress={onRemove} style={styles.actionBtn}>
            <TextCustom
              text={'Delete'}
              color={actionVidColor}
              style={styles.actionVidText}
            />
            <Remove width={22} height={22} />
          </Pressable>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '36%',
  },

  actionBtnContainer: {
    position: 'absolute',
    right: 0,
    top: '100%',
    borderWidth: 1,
    borderColor: actionVidColor,
    borderRadius: 6,
    paddingHorizontal: 12,
    width: width / 3,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },

  actionVidText: {
    fontSize: 15,
  },
});

export default HeaderVideoEdited;
