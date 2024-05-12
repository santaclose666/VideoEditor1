import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {width} from '../../constants/orther';
import colors from '../../constants/colors';
import {fontsList} from '../../constants/list';
import {FontPickerProps} from '../../types';

interface FontFamilyListProps {
  currFont: string;
  onFontPicker: (f: string) => void;
}

const FontFamilyList = (props: FontFamilyListProps) => {
  const {currFont, onFontPicker} = props;

  const length = fontsList.length;

  const handleFontPicker = (item: string) => {
    onFontPicker(item);
  };

  const renderFontFamily = ({item}: {item: FontPickerProps}) => {
    const {name, font} = item;

    const isPicker = font === currFont;

    return (
      <Pressable
        onPress={() => {
          handleFontPicker(font);
        }}
        style={[
          styles.textFontBtn,
          {
            width: width / length,
          },
        ]}>
        <View
          style={[
            styles.textFontContainer,
            {
              borderWidth: isPicker ? 2 : 0,
              borderColor: isPicker ? colors.bluePicker : 'transparent',
            },
          ]}>
          <Text style={[styles.textFont, {fontFamily: font}]}>Aa</Text>
        </View>
        <Text style={styles.textName}>{name}</Text>
      </Pressable>
    );
  };

  return (
    <View>
      <FlatList
        data={fontsList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderFontFamily}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},

  textFontBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  textFontContainer: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#6e6e6e',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textFont: {
    color: 'white',
    fontSize: 18,
  },

  textName: {
    color: 'white',
    marginTop: 3,
  },
});

export default FontFamilyList;
