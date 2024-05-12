import {StyleSheet, View, ActivityIndicator} from 'react-native';
import React from 'react';
import TextCustom from './TextCustom';
import colors from '../constants/colors';

interface LoadingCustom {
  isVisable: boolean;
  text?: string;
}

const LoadingCustom = (props: LoadingCustom) => {
  const {isVisable, text} = props;

  if (!isVisable) {
    return;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primaryYellow} size={'large'} />
      {text && <TextCustom text={text} textSize={18} style={{marginTop: 6}} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default LoadingCustom;
