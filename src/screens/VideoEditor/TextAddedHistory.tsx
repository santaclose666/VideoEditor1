import {Pressable, StyleSheet, View} from 'react-native';
import React, {forwardRef, useMemo, useRef} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import colors from '../../constants/colors';
import {FlatList} from 'react-native-gesture-handler';
import {TextProps} from '../../types';
import TextAdded from './TextAdded';
import {height, width} from '../../constants/orther';
import TextCustom from '../../components/TextCustom';
import {Dismiss, Editer} from '../../constants/svg';
import font from '../../constants/font';

interface TextAddedHistoryProps {
  data: TextProps[];
  onAddText: (t: TextProps) => void;
  onRemoveText: (i: number) => void;
  onEditText: (t: TextProps, i: number) => void;
}

const TextAddedHistory = (props: TextAddedHistoryProps, ref: any) => {
  const {data, onAddText, onRemoveText, onEditText} = props;

  const inputRef = useRef(null);

  const snapPoint = useMemo(() => ['53%'], []);

  const handleRemoveText = (index: number) => {
    onRemoveText(index);
  };

  const openEditText = (item: TextProps, idx: number) => {
    onEditText(item, idx);
  };

  const blurInput = () => {
    inputRef.current?.blur();
  };

  const renderTextHistory = ({
    item,
    index,
  }: {
    item: TextProps;
    index: number;
  }) => {
    const {text, fontFamily, fontColor, type} = item;

    if (type !== 'text') {
      return;
    }

    return (
      <View style={styles.textHistoryContainer}>
        <TextCustom
          text={`0${index + 1}`}
          color={colors.primaryBlue}
          style={styles.indexText}
        />

        <View style={styles.textAddContainer}>
          <TextCustom
            text={text}
            style={styles.textAdd}
            color={fontColor}
            textFont={fontFamily}
          />
        </View>

        <View style={styles.textActionContainer}>
          <Pressable
            style={styles.acitonBtn}
            onPress={() => {
              openEditText(item, index);
            }}>
            <Editer />
          </Pressable>

          <View style={styles.seperate} />

          <Pressable
            style={styles.acitonBtn}
            onPress={() => {
              handleRemoveText(index);
            }}>
            <Dismiss fill={colors.primaryBlue} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoint}
      backgroundStyle={{
        backgroundColor: colors.primaryYellow,
      }}>
      <Pressable style={styles.container} onPress={blurInput}>
        <TextAdded onAddText={onAddText} ref={inputRef} />

        <FlatList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderTextHistory}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{marginTop: 6}}
        />
      </Pressable>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.12,
  },

  textHistoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBlue,
    marginBottom: 10,
    padding: 8,
  },

  indexText: {
    width: '15%',
    fontSize: 24,
    fontWeight: 'bold',
  },

  textAddContainer: {width: '65%'},

  textInputAdd: {
    fontFamily: font.primaryFont,
    color: 'white',
  },

  textAdd: {width: '100%', fontSize: 17},

  textActionContainer: {
    width: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  acitonBtn: {
    padding: 4,
  },

  seperate: {
    borderRightWidth: 1,
    borderRightColor: colors.primaryBlue,
    height: height * 0.036,
  },
});

export default forwardRef(TextAddedHistory);
