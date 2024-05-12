import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {PenColor} from '../../constants/svg';
import colors from '../../constants/colors';
import {colorsList} from '../../constants/list';

interface FontBackgroundListProps {
  currBgColor: string;
  onColorBgPicker: (f: string) => void;
}

const FontBackgroundList = (props: FontBackgroundListProps) => {
  const {currBgColor, onColorBgPicker} = props;

  const handlePickColor = (item: string) => {
    onColorBgPicker(item);
  };

  const renderFontBg = ({item}: any) => {
    const isPicker = item === currBgColor;

    return (
      <Pressable
        onPress={() => {
          handlePickColor(item);
        }}
        style={[
          styles.fontBgContainer,
          {
            backgroundColor: item,
            borderWidth: isPicker ? 3 : 0,
            borderColor: isPicker ? colors.bluePicker : 'transparent',
          },
        ]}>
        <Text
          style={[
            styles.textBg,
            {color: item === '#FFFFFF' ? 'black' : 'white'},
          ]}>
          Aa
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.penContainer}>
        <PenColor />
      </View>

      <FlatList
        data={colorsList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderFontBg}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{alignItems: 'center'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  penContainer: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryGray,
    borderRadius: 5,
    marginHorizontal: '3%',
  },

  fontBgContainer: {
    padding: 9,
    marginRight: 10,
    borderRadius: 6,
  },

  textBg: {
    fontSize: 16,
  },
});

export default FontBackgroundList;
