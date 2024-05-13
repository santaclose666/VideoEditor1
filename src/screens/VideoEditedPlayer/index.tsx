import {Share, StyleSheet, View} from 'react-native';
import React from 'react';
import HeaderVideoEdited from './HeaderVideoEditedPlayer';
import VideoPlayer from '../../components/VideoPlayer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {videoStickerPath, width} from '../../constants/orther';
import {useRealm} from '@realm/react';
import {MediaProps} from '../../types';

const VideoEditedPlayer = ({navigation, route}: any) => {
  const data: MediaProps = route.params;
  const {name} = data;
  const uri = videoStickerPath + name;

  const realm = useRealm();

  const {bottom} = useSafeAreaInsets();

  const removeObj = () => {
    realm.write(() => {
      realm.delete(data);
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = () => {
    Share.share({
      message: 'Share my edited video',
      url: uri,
    });
  };

  const handleRemove = () => {
    removeObj();

    handleBack();
  };

  return (
    <View style={styles.container}>
      <HeaderVideoEdited
        onBack={handleBack}
        onShare={handleShare}
        onRemove={handleRemove}
      />

      <VideoPlayer
        uri={uri}
        progressStyle={styles.transparentBg}
        controlStyle={styles.transparentBg}
        controlContainerStyle={{
          ...styles.controlContainer,
          paddingBottom: bottom,
        }}
        vidContainerStyle={styles.vidContainer}
        vidStyle={styles.vidStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },

  transparentBg: {
    backgroundColor: 'transparent',
  },

  vidContainer: {
    flex: 1,
  },

  controlContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  vidStyle: {
    height: width * (11 / 16),
  },
});

export default VideoEditedPlayer;
