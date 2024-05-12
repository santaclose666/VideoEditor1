import RNFS from 'react-native-fs';
import {generateId} from './uuid';
import {FFmpegKit} from 'ffmpeg-kit-react-native';
import {getVideoDuration} from 'react-native-video-duration';
import {vidH, vidW} from '../constants/orther';

const generateBase64Img = async (path: string) => {
  const thumbnail = await RNFS.readFile('file://' + path, 'base64');
  await RNFS.unlink(path);

  return thumbnail;
};

export const getVidDuration = async (uri: string) => {
  const result = await getVideoDuration(uri);

  return Math.floor(result) * 1000;
};

export const convertVidDuration = (duration: number) => {
  const milsOfMinute = 60;
  const time = Math.floor(duration);

  const minutes = Math.floor(time / milsOfMinute);
  const seconds = time % milsOfMinute;

  return {
    minutes: minutes > 9 ? `${minutes}` : `0${minutes}`,
    seconds: seconds > 9 ? `${seconds}` : `0${seconds}`,
  };
};

export const generateThumbnail = async (uri: string, duration: number) => {
  const mediaDestination = RNFS.CachesDirectoryPath + `/${generateId()}.jpg`;

  const cmd = `-i ${uri} -ss 00:00:${duration} -frames:v 1 ${mediaDestination}`;

  await FFmpegKit.execute(cmd);

  const base64Img = await generateBase64Img(mediaDestination);

  return base64Img;
};

export const aspectRatioResize = (w: number, h: number) => {
  const isWGreaterH = w > h;

  const newW = isWGreaterH ? vidW : w / (h / vidH);
  const newH = isWGreaterH ? h / (w / vidW) : vidH;

  return {width: Math.floor(newW), height: Math.floor(newH)};
};
