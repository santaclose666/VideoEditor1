import {Keyboard, StyleSheet, View} from 'react-native';
import React, {forwardRef, useState} from 'react';
import colors from '../../constants/colors';
import {TextInput} from 'react-native-gesture-handler';
import font from '../../constants/font';
import TextBtnCustom from '../../components/TextBtnCustom';
import {TextProps} from '../../types';
import {fontSize, vidH, vidW} from '../../constants/orther';

interface TextAddedProps {
  onAddText: (t: TextProps) => void;
}

const TextAdded = (props: TextAddedProps, ref: any) => {
  const {onAddText} = props;

  const [input, setInput] = useState('');

  const handleAddText = () => {
    const defaultObj: TextProps = {
      text: input,
      fontColor: '#FFFFFF',
      fontFamily: font.Oswald,
      fontBg: 'transparent',
      x: vidW / 2 - fontSize,
      y: vidH / 2 - fontSize,
      type: 'text',
    };

    onAddText(defaultObj);

    setInput('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={ref}
        value={input}
        onChangeText={setInput}
        placeholder="Enter Name"
        style={styles.textInputStyle}
        placeholderTextColor={'white'}
      />

      <TextBtnCustom
        isDisable={input.length === 0}
        text={'Add'}
        btnColor={input.length > 0 ? colors.primaryBlue : colors.primaryGray}
        style={styles.textBtnStyle}
        onEvent={handleAddText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '3%',
    backgroundColor: colors.secoondOrange,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    width: '100%',
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

export default forwardRef(TextAdded);
