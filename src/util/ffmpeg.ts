import {FFmpegKit} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import {generateId} from './uuid';
import {fontSize, iconSize, videoStickerPath} from '../constants/orther';
import {StickerProps, TextProps} from '../types';
import {Image} from 'react-native';
import {hexTo0x} from './other';
import {aspectRatioResize} from './video';

const resizeOutputName = 'img';
const overlayOutputName = 'tmp';
const textOutputName = 'vidtext';

const createFolderIfNotExist = async (path: string) => {
  const isPathExist = await RNFS.exists(path);

  if (!isPathExist) {
    await RNFS.mkdir(path);
  }
};

const defineMultiInput = (data: StickerProps[]) => {
  let multiInput = '';

  data.forEach(item => {
    multiInput += `-i ${Image.resolveAssetSource(item.sticker).uri} `;
  });

  return multiInput;
};

const resizeVideo = (rootDimension: {w: number; h: number}) => {
  const {w, h} = rootDimension;
  const {width, height} = aspectRatioResize(w, h);
  const resizeOutput = '[vidResize]';

  const resizeCmd = `[0:v]scale=${width}:${height}[vidscale]; [1:v][vidscale]overlay=(W-w)/2:(H-h)/2:shortest=1${resizeOutput};`;

  return {resizeCmd, resizeOutput};
};

const resizeMultiSticker = (data: StickerProps[]) => {
  let multiResize = '';

  for (let i = 0; i < data.length; i++) {
    const idx = i + 2;
    multiResize += `[${idx}:v]scale=${iconSize}:-1[${resizeOutputName}${idx}];`;
  }

  return multiResize;
};

const overlayMultiSticker = (data: StickerProps[], outputBefore: string) => {
  let multiOverylay = '';
  let overlayOutput = '';

  for (let i = 0; i < data.length; i++) {
    const imgIdx = i + 2;
    const input1 =
      i === 0 ? outputBefore : `[${overlayOutputName}${imgIdx - 1}]`;
    const input2 = `[${resizeOutputName}${imgIdx}]`;
    const output = `[${overlayOutputName}${imgIdx}]`;

    const {x, y} = data[i];

    multiOverylay += `${input1}${input2}overlay=${x}:${y}${output};`;

    if (i === data.length - 1) {
      overlayOutput = output;
    }
  }

  return {multiOverylay, overlayOutput};
};

const drawTextFormat = (data: TextProps[], outputBefore: string) => {
  let multiTextFormat = '';
  let textFormatOutput = '';

  for (let i = 0; i < data.length; i++) {
    const {fontFamily, fontBg, fontColor, text, x, y} = data[i];
    const input = i === 0 ? outputBefore : `[${textOutputName}${i - 1}]`;
    const output = `[${textOutputName}${i}]`;

    multiTextFormat += `${input}drawtext=text='${text}':fontfile=${
      RNFS.MainBundlePath
    }/${fontFamily}.ttf:fontcolor=${hexTo0x(
      fontColor,
    )}:fontsize=${fontSize}:box=1:boxcolor=${hexTo0x(
      fontBg,
    )}:x=${x}:y=${y}${output};`;

    if (i === data.length - 1) {
      textFormatOutput = output;
    }
  }

  return {multiTextFormat, textFormatOutput};
};

export const handleItemIntoVideo = async (
  uri: string,
  data: any[],
  vidName?: string,
  vidDimension: {w: number; h: number},
) => {
  const newVidName = `/${vidName || generateId()}.mp4`;
  const output = videoStickerPath + newVidName;
  const stickerData: StickerProps[] = data.filter(item => item.type !== 'text');
  const textData: TextProps[] = data.filter(item => item.type !== 'sticker');

  createFolderIfNotExist(videoStickerPath);

  const multiInput = defineMultiInput(stickerData);
  const multiResize = resizeMultiSticker(stickerData);
  const {resizeCmd, resizeOutput} = resizeVideo(vidDimension);
  const {overlayOutput, multiOverylay} = overlayMultiSticker(
    stickerData,
    resizeOutput,
  );
  const {textFormatOutput, multiTextFormat} = drawTextFormat(
    textData,
    stickerData.length === 0 ? resizeOutput : overlayOutput,
  );

  const cmd = `-i ${uri} -f lavfi -i color=black:s=400x250 ${multiInput} -filter_complex "${resizeCmd}${multiResize}${multiOverylay}${multiTextFormat}" -map "${
    textFormatOutput || overlayOutput
  }" -c:a copy ${output}`;

  console.log(cmd);

  await FFmpegKit.execute(cmd);

  return newVidName;
};
