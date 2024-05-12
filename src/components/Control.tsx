import {Pressable, StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import {Back10s, Next10s, Pause, Resume} from '../constants/svg';
import {convertVidDuration} from '../util/video';

interface ControlProps {
  isPlay: boolean;
  currTime: number;
  duration: number;
  style?: ViewStyle;
  onResumeStop: () => void;
  onSeekVid: (t: number) => void;
}

const Control = (props: ControlProps) => {
  const {isPlay, currTime, duration, style, onResumeStop, onSeekVid} = props;

  const curr = convertVidDuration(currTime);
  const allTime = convertVidDuration(duration);

  const handleSeekVid = (time: number) => {
    onSeekVid(time);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.controlContainer}>
        <Text style={styles.timeText}>
          {curr.minutes}:{curr.seconds}/{allTime.minutes}:{allTime.seconds}
        </Text>
      </View>
      <View style={[styles.controlContainer, {width: '40%'}]}>
        <Pressable
          onPress={() => {
            handleSeekVid(-10);
          }}>
          <Back10s width={20} height={20} />
        </Pressable>
        <Pressable onPress={onResumeStop}>
          {isPlay ? <Resume /> : <Pause width={28} height={28} />}
        </Pressable>
        <Pressable
          onPress={() => {
            handleSeekVid(10);
          }}>
          <Next10s width={20} height={20} />
        </Pressable>
      </View>
      <View style={styles.controlContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    backgroundColor: '#D9D9D9',
  },

  controlContainer: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  timeText: {
    color: '#6e6e6e',
    fontSize: 13,
  },
});

export default Control;
