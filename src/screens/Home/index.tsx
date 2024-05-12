import {Pressable, StyleSheet, View, FlatList, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Gallery, LayoutL, File} from '../../constants/svg';
import {base64Img, fontsPath, width} from '../../constants/orther';
import TextCustom from '../../components/TextCustom';
import colors from '../../constants/colors';
import ImagePicker from 'react-native-image-crop-picker';
import {pick, types} from 'react-native-document-picker';
import {useQuery, useRealm} from '@realm/react';
import {MediaEdited, MediaPicker} from '../../database/models';
import {
  convertVidDuration,
  generateThumbnail,
  getVidDuration,
} from '../../util/video';
import {getTimeStamp} from '../../util/time';
import {MediaProps} from '../../types';
import {generateId} from '../../util/uuid';
import images from '../../constants/images';
import RNFS from 'react-native-fs';

const rootDimension = {
  w: 402,
  h: 470,
};
const columns = 3;
const bannerW = width - 20;
const bannerH = bannerW + bannerW * (1 - rootDimension.w / rootDimension.h);

interface HomeProps {
  navigation: any;
}

const Home = ({navigation}: HomeProps) => {
  const realm = useRealm();
  const videoPicker = useQuery(MediaPicker);
  const videoEdited = useQuery(MediaEdited);

  const [isUploadTab, setIsUploadTab] = useState(true);

  const handleChangeTab = (state: boolean) => {
    setIsUploadTab(state);
  };

  const createMediaPicker = (data: MediaProps[]) => {
    realm.write(() => {
      for (let item of data) {
        realm.create(MediaPicker, item);
      }
    });
  };

  const getVidObj = async (uri: string, duration: number) => {
    const {minutes, seconds} = convertVidDuration(duration / 1000);
    const thumbnail = await generateThumbnail(
      uri,
      Number(minutes) > 10 ? 10 : Math.floor(Number(seconds) * 0.1),
    );

    return {minutes, seconds, thumbnail};
  };

  const pickMediaFromLibrary = async () => {
    const data = await ImagePicker.openPicker({
      multiple: true,
      mediaType: 'video',
    });

    let allVid: MediaProps[] = [];

    for (let item of data) {
      const {duration, path} = item;

      const {minutes, seconds, thumbnail} = await getVidObj(path, duration);

      allVid.push({
        id: generateId(),
        uri: path,
        minutes,
        seconds,
        timeCreated: getTimeStamp(),
        thumbnail,
      });
    }

    createMediaPicker(allVid);
  };

  const pickMediaFromSystem = async () => {
    const data = await pick({
      allowMultiSelection: true,
      type: [types.video],
      copyTo: 'cachesDirectory',
    });

    const allVid: MediaProps[] = [];
    for (let item of data) {
      const {fileCopyUri} = item;

      const duration = await getVidDuration(fileCopyUri);

      const {minutes, seconds, thumbnail} = await getVidObj(
        fileCopyUri,
        duration,
      );

      allVid.push({
        id: generateId(),
        uri: fileCopyUri,
        minutes,
        seconds,
        timeCreated: getTimeStamp(),
        thumbnail,
      });
    }

    createMediaPicker(allVid);
  };

  const handleNavigation = (screen: string, item: MediaProps) => {
    navigation.navigate(screen, item);
  };

  const renderVideo = ({item}: {item: MediaProps}) => {
    const {minutes, seconds, thumbnail} = item;

    return (
      <Pressable
        onPress={() => {
          handleNavigation(
            isUploadTab ? 'VideoEditor' : 'VideoEditedPlayer',
            item,
          );
        }}
        style={styles.mediaContainer}>
        <Image source={{uri: base64Img + thumbnail}} style={styles.mediaImg} />

        <View style={styles.durationContainer}>
          <TextCustom text={`${minutes}:`} style={styles.durationText} />
          <TextCustom text={seconds} style={styles.durationText} />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <LayoutL width={bannerW} height={bannerH} />

        <Image source={images.person} style={styles.personImg} />
        <View style={styles.mainBtnContainer}>
          <Pressable
            onPress={pickMediaFromLibrary}
            style={[styles.mainBtn, {backgroundColor: colors.primaryBlue}]}>
            <Gallery />
            <TextCustom text="Photo Library" />
          </Pressable>
          <Pressable
            onPress={pickMediaFromSystem}
            style={[
              styles.mainBtn,
              {
                backgroundColor: colors.primaryOrange,
                marginTop: bannerH * 0.03,
                marginBottom: bannerH * 0.006,
              },
            ]}>
            <File />
            <TextCustom text="File Picker" />
          </Pressable>
        </View>
      </View>

      <View style={styles.tabsBtnContainer}>
        <Pressable
          style={[
            styles.videoBtn,
            {
              backgroundColor: isUploadTab
                ? colors.primaryBlue
                : colors.primaryGray,
            },
          ]}
          disabled={isUploadTab}
          onPress={() => {
            handleChangeTab(true);
          }}>
          <TextCustom text="Uploaded videos" style={styles.btnText} />
        </Pressable>
        <Pressable
          style={[
            styles.videoBtn,
            {
              backgroundColor: !isUploadTab
                ? colors.primaryBlue
                : colors.primaryGray,
            },
          ]}
          disabled={!isUploadTab}
          onPress={() => {
            handleChangeTab(false);
          }}>
          <TextCustom text="Edited videos" style={styles.btnText} />
        </Pressable>
      </View>

      <FlatList
        data={isUploadTab ? videoPicker : videoEdited}
        keyExtractor={(item: MediaProps) => item.id}
        renderItem={renderVideo}
        numColumns={columns}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{marginBottom: 10}}
        ListEmptyComponent={() => (
          <TextCustom
            text={'No Media found'}
            color={colors.primaryYellow}
            textSize={22}
            style={styles.emptyText}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },

  personImg: {
    position: 'absolute',
    right: 0,
    height: bannerH,
    width: bannerW / 2,
  },

  mainBtnContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: bannerW / 1.8,
    height: bannerH * 0.66,
    justifyContent: 'flex-end',
    paddingLeft: bannerW * 0.02,
  },

  mainBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '45%',
    width: '90%',
    borderRadius: 20,
  },

  tabsBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginVertical: 16,
  },

  videoBtn: {
    padding: 12,
    borderRadius: 50,
    width: '44%',
    alignItems: 'center',
  },

  btnText: {
    fontSize: 16,
  },

  mediaContainer: {
    width: bannerW / columns,
    height: bannerW / columns,
  },

  mediaImg: {
    width: '95%',
    height: '95%',
    borderRadius: 16,
  },

  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: '8%',
    bottom: '8%',
  },

  durationText: {
    fontSize: 16,
    color: '#f5e23d',
  },

  emptyText: {textAlign: 'center'},
});

export default Home;
