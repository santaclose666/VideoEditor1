export const hexTo0x = (hex: string) => {
  if (hex === 'transparent') {
    return '0x00000000';
  }

  const newColor = hex.replace('#', '');

  return `0x${newColor}`;
};

export const getRandomNumber = (to: number = 1) => {
  return Math.floor(Math.random() * to);
};
