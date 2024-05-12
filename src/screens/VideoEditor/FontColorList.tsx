import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {PenColor} from '../../constants/svg';
import colors from '../../constants/colors';
import {colorsList} from '../../constants/list';
interface FontColorListProps {
  currColor: string;
  onColorPicker: (f: string) => void;
}

const FontColorList = (props: FontColorListProps) => {
  const {currColor, onColorPicker} = props;

  const handleColorPicker = (item: string) => {
    onColorPicker(item);
  };

  const renderColor = ({item}: any) => {
    const isPicker = item === currColor;

    return (
      <Pressable
        onPress={() => {
          handleColorPicker(item);
        }}
        style={[
          styles.color,
          {
            backgroundColor: item,
            borderColor: isPicker ? colors.bluePicker : 'transparent',
            borderWidth: isPicker ? 2 : 0,
          },
        ]}
      />
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
        renderItem={renderColor}
        horizontal
        showsHorizontalScrollIndicator={false}
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
    backgroundColor: colors.primaryBlue,
    padding: 10,
    borderRadius: 50,
    marginHorizontal: '3%',
  },

  color: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginLeft: 8,
  },
});

export default FontColorList;
