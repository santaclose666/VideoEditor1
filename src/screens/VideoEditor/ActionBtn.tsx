import {StyleSheet, View} from 'react-native';
import React from 'react';
import TextBtnCustom from '../../components/TextBtnCustom';
import colors from '../../constants/colors';

interface ActionBtnProps {
  onAddSticker: () => void;
  onAddText: () => void;
  disableExportBtn?: boolean;
  onExportMp4: () => void;
}

const ActionBtn = (props: ActionBtnProps) => {
  const {disableExportBtn, onAddSticker, onAddText, onExportMp4} = props;
  return (
    <View style={styles.container}>
      <TextBtnCustom
        onEvent={onAddText}
        btnColor={colors.primaryBlue}
        text={'ADD TEXT'}
      />

      <TextBtnCustom
        onEvent={onAddSticker}
        btnColor={colors.primaryOrange}
        text={'ADD STICKER'}
        style={{marginVertical: 12}}
      />

      <TextBtnCustom
        isDisable={disableExportBtn}
        onEvent={onExportMp4}
        btnColor={disableExportBtn ? colors.primaryGray : colors.primaryYellow}
        text={'EXPORT MP4'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default ActionBtn;
