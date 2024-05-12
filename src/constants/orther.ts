import {Dimensions} from 'react-native';
import RNFS from 'react-native-fs';

const {width, height} = Dimensions.get('window');
const base64Img = 'data:image/jpeg;base64,';
const vidW = Math.floor(width - 24);
const vidH = Math.floor(width * (9 / 16));
const iconSize = Math.floor(vidW * 0.1);
const fontSize = Math.floor(vidW * 0.04);
const videoStickerPath = RNFS.DocumentDirectoryPath + '/stickerVideo';
const fontsPath = RNFS.DocumentDirectoryPath + '/fonts';

export {
  width,
  height,
  base64Img,
  vidW,
  vidH,
  videoStickerPath,
  fontsPath,
  iconSize,
  fontSize,
};
