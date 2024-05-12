import {Keyboard, Pressable, StyleSheet, View, TextInput} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Back, FontBg, FontColor, FontStyle} from '../../constants/svg';
import colors from '../../constants/colors';
import TextBtnCustom from '../../components/TextBtnCustom';
import {TextProps, TextPickerProps} from '../../types';
import font from '../../constants/font';
import FontFamilyList from './FontFamilyList';
import FontColorList from './FontColorList';
import FontBackgroundList from './FontBackgroundList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface EditorModeProps {
  isVisable: boolean;
  data: TextPickerProps;
  onClose: () => void;
  onSaveText: (t: TextProps, n: number) => void;
}

type toolType = 'fontFamily' | 'fontBg' | 'fontColor';

const EditorMode = (props: EditorModeProps) => {
  const {data, isVisable = false, onClose, onSaveText} = props;
  const textProps = data?.data;

  const inputRef = useRef(null);

  const {top, bottom} = useSafeAreaInsets();

  const [input, setInput] = useState('');
  const [fontPicker, setFontPicker] = useState('');
  const [colorBgPicker, setColorBgPicker] = useState('#ffffff00');
  const [colorPicker, setColorPicker] = useState('#ffffff');
  const [toolState, setToolState] = useState<toolType>('fontFamily');
  const [keyboardH, setKeyboardH] = useState(bottom);

  useEffect(() => {
    inputRef.current?.focus();

    textProps?.text.length > 0 && setInput(textProps.text);
    textProps?.fontFamily.length > 0 && setFontPicker(textProps.fontFamily);
    textProps?.fontBg.length > 0 && setColorBgPicker(textProps.fontBg);
    textProps?.fontColor.length > 0 && setColorPicker(textProps.fontColor);

    const showKBListener = Keyboard.addListener('keyboardWillShow', e => {
      const {height} = e.endCoordinates;

      setKeyboardH(height + 6);
    });

    const hideKBListener = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardH(bottom);
    });

    return () => {
      showKBListener.remove();
      hideKBListener.remove();
    };
  }, [data]);

  const handlePickFont = (font: string) => {
    setFontPicker(font);
  };

  const handlePickBgColor = (color: string) => {
    setColorBgPicker(color);
  };

  const handlePickColor = (color: string) => {
    setColorPicker(color);
  };

  const handleSaveText = () => {
    const textObj: TextProps = {
      ...textProps,
      text: input,
      fontColor: colorPicker,
      fontFamily: fontPicker,
      fontBg: colorBgPicker,
      type: 'text',
    };

    onSaveText(textObj, data.index);
  };

  const toolChange = (state: toolType) => {
    setToolState(state);
  };

  if (!isVisable) {
    return;
  }

  return (
    <View
      style={{...styles.container, paddingBottom: keyboardH, paddingTop: top}}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.saveBtn} onPress={onClose}>
          <Back fill={colors.primaryOrange} />
        </Pressable>

        <View style={styles.headerToolContainer}>
          <Pressable
            style={styles.headerBtn}
            onPress={() => {
              toolChange('fontFamily');
            }}>
            <FontStyle
              fill={
                toolState === 'fontFamily'
                  ? colors.primaryOrange
                  : colors.primaryGray
              }
            />
          </Pressable>
          <Pressable
            style={styles.headerBtn}
            onPress={() => {
              toolChange('fontBg');
            }}>
            <FontBg
              fill={
                toolState === 'fontBg'
                  ? colors.primaryOrange
                  : colors.primaryGray
              }
            />
          </Pressable>
          <Pressable
            style={styles.headerBtn}
            onPress={() => {
              toolChange('fontColor');
            }}>
            <FontColor
              fill={
                toolState === 'fontColor'
                  ? colors.primaryOrange
                  : colors.primaryGray
              }
            />
          </Pressable>
        </View>

        <TextBtnCustom
          text={'Save'}
          textSize={13}
          style={styles.saveBtn}
          btnColor={colors.primaryOrange}
          onEvent={handleSaveText}
        />
      </View>

      <View style={styles.textInputContainer}>
        <TextInput
          ref={inputRef}
          value={input}
          onChangeText={setInput}
          style={[
            styles.inputStyle,
            {
              color: colorPicker,
              fontFamily: fontPicker,
              backgroundColor: colorBgPicker,
            },
          ]}
        />
      </View>

      {toolState === 'fontFamily' && (
        <FontFamilyList currFont={fontPicker} onFontPicker={handlePickFont} />
      )}

      {toolState === 'fontBg' && (
        <FontBackgroundList
          currBgColor={colorBgPicker}
          onColorBgPicker={handlePickBgColor}
        />
      )}

      {toolState === 'fontColor' && (
        <FontColorList
          currColor={colorPicker}
          onColorPicker={handlePickColor}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,26,0.75)',
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  headerToolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '60%',
  },

  headerBtn: {
    padding: 6,
  },

  saveBtn: {
    width: '16%',
    paddingVertical: 5,
    borderRadius: 16,
  },

  textInputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputStyle: {
    fontSize: 30,
    color: 'white',
    fontFamily: font.primaryFont,
  },
});

export default EditorMode;
