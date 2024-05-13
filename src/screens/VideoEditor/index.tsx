import {Alert, StyleSheet, View} from 'react-native';
import React, {useRef, useState} from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import HeaderVideoEditor from './HeaderVideoEditor';
import ActionBtn from './ActionBtn';
import StickerBottomSheet from './StickerBottomSheet';
import Mp4Exporter from './Mp4Exporter';
import {
  TextProps,
  TextPickerProps,
  MediaProps,
  StickerProps,
} from '../../types';
import TextAddedHistory from './TextAddedHistory';
import EditorMode from './EditorMode';
import {useRealm} from '@realm/react';
import {MediaEdited} from '../../database/models';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {handleItemIntoVideo} from '../../util/ffmpeg';
import {generateThumbnail} from '../../util/video';
import {videoPickerPath, videoStickerPath} from '../../constants/orther';
import {getTimeStamp} from '../../util/time';
import {generateId} from '../../util/uuid';
import LoadingCustom from '../../components/LoadingCustom';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

interface VideoEditorProps {
  navigation: any;
  route: any;
}

const VideoEditor: React.FC<VideoEditorProps> = ({navigation, route}) => {
  const data: MediaProps = route.params;

  const {name, seconds, minutes} = data;
  const url = videoPickerPath + name;

  const realm = useRealm();
  const {top} = useSafeAreaInsets();

  const videoPlayerRef = useRef(null);
  const stickerRef = useRef(null);
  const textHistoryRef = useRef(null);

  const [toggleEditorMode, setToggleEditorMode] = useState(false);
  const [textPicker, setTextPicker] = useState<TextPickerProps | null>(null);
  const [pickerList, setPickerList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionState, setActionState] = useState<'default' | 'mp4export'>(
    'default',
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const createVideoEdited = (obj: MediaProps) => {
    realm.write(() => {
      realm.create(MediaEdited, obj);
    });

    Alert.alert('Video is already stored');
  };

  const handleSaveToGallery = async (path: string) => {
    try {
      await CameraRoll.save(path, {type: 'video'});
    } catch (error) {
      Alert.alert('Has some error while save to gallery!');
    }
  };

  const handleSaveOnApp = async (name?: string) => {
    closeStickerBottom();
    closeTextBottom();

    const {videoEdited, videoName} = await handleProcessVid(name);

    createVideoEdited(videoEdited);

    return videoStickerPath + videoName;
  };

  const handleProcessVid = async (
    name?: string,
  ): Promise<{videoEdited: MediaProps; videoName: string}> => {
    setIsLoading(true);
    try {
      const currVidSize = videoPlayerRef.current?.getNaturalVideoSize();
      const videoName = await handleItemIntoVideo(
        url,
        pickerList,
        name,
        currVidSize,
      );

      const uri = videoStickerPath + videoName;
      const thumbnail = await generateThumbnail(
        uri,
        Number(minutes) > 10 ? 10 : Math.floor(Number(seconds) * 0.1),
      );

      const videoEdited: MediaProps = {
        id: generateId(),
        name: '/' + videoName,
        minutes: minutes,
        seconds: seconds,
        thumbnail,
        timeCreated: getTimeStamp(),
      };

      return {videoEdited, videoName};
    } catch (error) {
      Alert.alert('Has some error occured');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditMode = () => {
    setToggleEditorMode(true);
  };
  const closeEditMode = () => {
    setToggleEditorMode(false);
  };

  const openTextBottom = () => {
    textHistoryRef.current?.present(0);
  };
  const closeTextBottom = () => {
    textHistoryRef.current?.dismiss();
  };

  const handleOpenEditText = (obj: TextProps, index: number) => {
    setTextPicker({data: obj, index: index});

    closeTextBottom();
    openEditMode();
  };
  const handleAddText = (obj: TextProps) => {
    const newTextList = [...pickerList];
    newTextList.push(obj);

    setTextPicker({data: obj, index: newTextList.length - 1});
    setPickerList(newTextList);

    closeTextBottom();
    openEditMode();
  };
  const handleRemovePicker = (index: number) => {
    let newTextList = [...pickerList];

    newTextList.splice(index, 1);

    setPickerList(newTextList);
  };
  const handleEditText = (obj: TextProps, index: number) => {
    let newTextList = [...pickerList];

    newTextList.splice(index, 1, obj);

    setPickerList(newTextList);
  };
  const saveTextEditor = (obj: TextProps, idx: number) => {
    handleEditText(obj, idx);

    closeEditMode();
    openTextBottom();
  };

  const openStickerBottom = () => {
    stickerRef.current?.present(0);
  };
  const closeStickerBottom = () => {
    stickerRef.current?.dismiss();
  };
  const handlePickSticker = (item: StickerProps) => {
    setPickerList([...pickerList, item]);
  };

  const handleItemMove = (coor: {x: number; y: number}, idx: number) => {
    const {x, y} = coor;

    const newPickerList = [...pickerList];

    const updateObj = {
      ...newPickerList[idx],
      x,
      y,
    };

    newPickerList.splice(idx, 1, updateObj);

    setPickerList(newPickerList);
  };

  const openExportMp4 = () => {
    setActionState('mp4export');
  };
  const closeExportMp4 = () => {
    setActionState('default');
  };
  const handleExportMp4 = async (name: string) => {
    try {
      const url = await handleSaveOnApp(name);
      await handleSaveToGallery(url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <HeaderVideoEditor
        disableSave={pickerList.length === 0}
        onBack={handleBack}
        onSaveOnApp={() => {
          handleSaveOnApp();
        }}
      />

      <VideoPlayer
        ref={videoPlayerRef}
        uri={url}
        pickerList={pickerList}
        isHideRemoveItem={actionState === 'mp4export'}
        onRemovePicker={handleRemovePicker}
        onEditText={handleOpenEditText}
        onItemMove={handleItemMove}
      />

      {actionState === 'default' && (
        <ActionBtn
          disableExportBtn={pickerList.length === 0}
          onAddSticker={openStickerBottom}
          onAddText={openTextBottom}
          onExportMp4={openExportMp4}
        />
      )}

      {actionState === 'mp4export' && (
        <Mp4Exporter onExportVid={handleExportMp4} onClose={closeExportMp4} />
      )}

      <StickerBottomSheet
        ref={stickerRef}
        onStickerPicker={handlePickSticker}
      />

      <TextAddedHistory
        ref={textHistoryRef}
        data={pickerList}
        onAddText={handleAddText}
        onRemoveText={handleRemovePicker}
        onEditText={handleOpenEditText}
      />

      <EditorMode
        isVisable={toggleEditorMode}
        data={textPicker}
        onClose={closeEditMode}
        onSaveText={saveTextEditor}
      />

      <LoadingCustom isVisable={isLoading} text={'Processing video'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
});

export default VideoEditor;
