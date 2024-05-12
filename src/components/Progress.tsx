import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import Slider from '@react-native-community/slider';
import colors from '../constants/colors';

interface SliderProps {
  currTime: number;
  duration: number;
  style?: ViewStyle;
  onSliceSeek: (t: number) => void;
}

const Progress = (props: SliderProps) => {
  const {currTime, duration, onSliceSeek, style} = props;

  const handleSliceChange = (time: number) => {
    onSliceSeek(time);
  };

  return (
    <View style={[styles.container, style]}>
      <Slider
        value={currTime}
        minimumValue={0}
        maximumValue={duration}
        step={1}
        onValueChange={handleSliceChange}
        maximumTrackTintColor={'#ffffff'}
        minimumTrackTintColor={colors.primaryYellow}
        thumbTintColor={colors.primaryYellow}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    backgroundColor: '#909090',
    width: '100%',
  },
});

export default Progress;
