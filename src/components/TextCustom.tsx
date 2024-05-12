import {Text, TextStyle} from 'react-native';
import React from 'react';
import font from '../constants/font';

interface TextProps {
  text: string | number;
  textSize?: number;
  textFont?: string;
  color?: string;
  style?: TextStyle;
}

const TextCustom = (props: TextProps) => {
  const {
    text,
    style,
    color = 'white',
    textSize = 17,
    textFont = font.primaryFont,
  } = props;

  return (
    <Text
      style={{
        ...style,
        color: color,
        fontSize: textSize,
        fontFamily: textFont,
      }}>
      {text}
    </Text>
  );
};

export default TextCustom;
