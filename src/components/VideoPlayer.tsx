import {FlatList, StyleSheet, View, ViewStyle} from 'react-native';
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import Video from 'react-native-video';
import {vidH, vidW, iconSize} from '../constants/orther';
import Progress from './Progress';
import Control from './Control';
import colors from '../constants/colors';
import {TextProps} from '../types';
import ItemPander from '../screens/VideoEditor/ItemPander';

interface VideoProps {
  uri: string;
  pickerList?: any[];
  isHideRemoveItem?: boolean;
  vidContainerStyle?: ViewStyle;
  progressStyle?: ViewStyle;
  controlStyle?: ViewStyle;
  controlContainerStyle?: ViewStyle;
  vidStyle?: ViewStyle;
  onItemMove?: (coor: {x: number; y: number}, i: number) => void;
  onRemovePicker?: (idx: number) => void;
  onEditText?: (obj: TextProps, index: number) => void;
}

const VideoPlayer = (props: VideoProps, ref: any) => {
  const {
    uri,
    controlStyle,
    progressStyle,
    controlContainerStyle,
    vidContainerStyle,
    vidStyle,
    pickerList,
    isHideRemoveItem = false,
    onRemovePicker,
    onEditText,
    onItemMove,
  } = props;

  const videoRef = useRef(null);
  const [vidOriginDimension, setVidOriginDimension] = useState({
    w: vidW,
    h: vidH,
  });
  const [isPlay, setIsPlay] = useState(true);
  const [currTime, setCurrTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useImperativeHandle(
    ref,
    () => {
      return {
        getNaturalVideoSize() {
          return vidOriginDimension;
        },
      };
    },
    [vidOriginDimension],
  );

  const handleLoad = (data: any) => {
    const {width, height} = data.naturalSize;
    setVidOriginDimension({w: width, h: height});

    setCurrTime(data.currentTime);
    setDuration(data.duration);
  };

  const handleProgress = (data: any) => {
    setCurrTime(data.currentTime);
  };

  const handleResumeStop = () => {
    setIsPlay(!isPlay);
  };

  const seekVideo = (time: number) => {
    videoRef.current?.seek(time);
  };

  const handleSeekVid = (time: number) => {
    seekVideo(time);
  };

  const handleRewindVid = (time: number) => {
    seekVideo(currTime + time);
  };

  return (
    <View style={vidContainerStyle}>
      <View style={[styles.vidContainer, vidStyle]}>
        <Video
          ref={videoRef}
          source={{uri: uri}}
          style={styles.videoStyle}
          controls={false}
          resizeMode="contain"
          paused={!isPlay}
          repeat={true}
          onLoad={handleLoad}
          onProgress={handleProgress}
        />

        <View style={styles.textStickerContainer}>
          <FlatList
            data={pickerList}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => (
              <ItemPander
                item={item}
                index={index}
                isHideRemoveItem={isHideRemoveItem}
                onEditText={onEditText}
                onRemovePicker={onRemovePicker}
                onEndMoveItem={onItemMove}
              />
            )}
            scrollEnabled={false}
            initialNumToRender={66}
            contentContainerStyle={styles.listPickerContainer}
          />
        </View>
      </View>
      <View style={controlContainerStyle}>
        <Progress
          currTime={currTime}
          duration={duration}
          onSliceSeek={handleSeekVid}
          style={progressStyle}
        />
        <Control
          isPlay={isPlay}
          currTime={currTime}
          duration={duration}
          onResumeStop={handleResumeStop}
          onSeekVid={handleRewindVid}
          style={controlStyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  vidContainer: {
    width: vidW,
    height: vidH,
    backgroundColor: 'black',
  },

  videoStyle: {
    width: '100%',
    height: '100%',
  },

  textStickerContainer: {
    ...StyleSheet.absoluteFillObject,
  },

  listPickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stickerImgContainer: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.primaryYellow,
    backgroundColor: 'rgba(253, 252, 252, 0.33)',
  },

  textContainer: {
    position: 'absolute',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },

  stickerImg: {
    width: iconSize,
    height: iconSize,
    resizeMode: 'contain',
  },

  closeBtn: {
    ...StyleSheet.absoluteFillObject,
    top: -12,
    left: '75%',
  },
});

export default forwardRef(VideoPlayer);
