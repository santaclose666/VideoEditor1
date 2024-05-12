import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {Back, CheckBtn} from '../../constants/svg';
import colors from '../../constants/colors';

interface HeaderVideoEditorProps {
  disableSave?: boolean;
  onBack: () => void;
  onSaveOnApp: () => void;
}

const iconSize = 32;

const HeaderVideoEditor = (props: HeaderVideoEditorProps) => {
  const {disableSave = false, onBack, onSaveOnApp} = props;

  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={onBack}>
        <Back width={iconSize} height={iconSize} fill={'#FAC90A'} />
      </Pressable>
      <Pressable onPress={onSaveOnApp} disabled={disableSave}>
        <CheckBtn
          width={iconSize}
          height={iconSize}
          fill={disableSave ? colors.primaryGray : '#FAC90A'}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export default HeaderVideoEditor;
