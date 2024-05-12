import {Pressable, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import TextCustom from './TextCustom';

interface TextBtnProps {
  btnColor: string;
  text: string | number;
  textSize?: number;
  isDisable?: boolean;
  style?: ViewStyle;
  onEvent: () => void;
}

const TextBtnCustom = (props: TextBtnProps) => {
  const {
    btnColor = 'transparent',
    text,
    textSize,
    style,
    isDisable = false,
    onEvent,
  } = props;

  return (
    <Pressable
      disabled={isDisable}
      onPress={onEvent}
      style={{...styles.textBtnContainer, backgroundColor: btnColor, ...style}}>
      <TextCustom text={text} textSize={textSize} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  textBtnContainer: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
});

export default TextBtnCustom;
