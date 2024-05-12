import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import TextCustom from '../../components/TextCustom';
import TextBtnCustom from '../../components/TextBtnCustom';
import colors from '../../constants/colors';
import font from '../../constants/font';
import {Dismiss} from '../../constants/svg';

interface Mp4ExporterProps {
  onExportVid: (n: string) => void;
  onClose: () => void;
}

const Mp4Exporter = (props: Mp4ExporterProps) => {
  const {onExportVid, onClose} = props;

  const inputRef = useRef(null);

  const [input, setInput] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleExportVid = () => {
    onExportVid(input);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerIcon} />
        <TextCustom text={'EXPORT MP4'} style={{width: '40%', fontSize: 18}} />
        <Pressable style={styles.headerIcon} onPress={onClose}>
          <Dismiss fill={'#ffffff'} />
        </Pressable>
      </View>

      <TextInput
        ref={inputRef}
        value={input}
        onChangeText={setInput}
        placeholder="Enter Name"
        style={styles.textInputStyle}
        placeholderTextColor={'white'}
      />

      <TextBtnCustom
        isDisable={input.length === 0}
        text={'EXPORT'}
        btnColor={input.length === 0 ? colors.primaryGray : colors.primaryBlue}
        style={styles.textBtnStyle}
        onEvent={handleExportVid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '10%',
    backgroundColor: colors.secoondOrange,
    width: '70%',
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },

  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },

  headerIcon: {
    width: '30%',
    alignItems: 'flex-end',
  },

  textInputStyle: {
    backgroundColor: 'rgba(217,217,217,0.27)',
    padding: 6,
    borderRadius: 10,
    width: '80%',
    marginVertical: 22,
    fontFamily: font.primaryFont,
    color: 'white',
  },

  textBtnStyle: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 25,
  },
});

export default Mp4Exporter;
