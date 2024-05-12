import {FlatList, Image, Pressable, StyleSheet} from 'react-native';
import React, {forwardRef, useMemo} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import colors from '../../constants/colors';
import {stickerList} from '../../constants/list';
import {vidH, vidW, iconSize as iconS, width} from '../../constants/orther';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StickerProps} from '../../types';

interface StickerBottomSheetProps {
  onStickerPicker: (s: StickerProps) => void;
}

const iconSize = width * 0.15;

const StickerBottomSheet = (props: StickerBottomSheetProps, ref: any) => {
  const {onStickerPicker} = props;

  const {bottom} = useSafeAreaInsets();

  const snapPoint = useMemo(() => ['53%'], []);

  const handleStickerPicker = (item: any) => {
    const stickerObj: StickerProps = {
      sticker: item,
      x: vidW / 2 - iconS,
      y: vidH / 2 - iconS,
      type: 'sticker',
    };

    onStickerPicker(stickerObj);
  };

  const renderSticker = ({item}: any) => {
    return (
      <Pressable
        onPress={() => {
          handleStickerPicker(item);
        }}
        style={styles.sticker}>
        <Image source={item} style={styles.stickerImg} />
      </Pressable>
    );
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoint}
      backgroundStyle={{backgroundColor: colors.primaryYellow}}>
      <FlatList
        data={stickerList}
        keyExtractor={(_, index) => index.toString()}
        numColumns={5}
        renderItem={renderSticker}
        contentContainerStyle={{paddingHorizontal: 12, paddingBottom: bottom}}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
        }}
      />
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {},

  sticker: {
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stickerImg: {
    flex: 1,
    width: iconSize,
    height: iconSize,
    resizeMode: 'contain',
  },
});

export default forwardRef(StickerBottomSheet);
