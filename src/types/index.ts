type textStickerType = 'text' | 'sticker';

export interface MediaProps {
  id?: string;
  name: string;
  minutes: string;
  seconds: string;
  timeCreate: number;
  thumbnail: string;
}

export interface TextProps {
  text: string;
  fontFamily: string;
  fontColor: string;
  fontBg: string;
  x: number;
  y: number;
  type: textStickerType;
}

export interface TextPickerProps {
  data: TextProps;
  index: number;
}

export interface StickerProps {
  sticker: any;
  x: number;
  y: number;
  type: textStickerType;
}

export interface FontPickerProps {
  name?: string;
  font: string;
}
