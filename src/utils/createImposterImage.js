const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const createImposterImage = async (name) => {
  const width = 960;
  const height = 540;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const image = await loadImage(
    path.resolve(__dirname, '../assets/imposter-background.png'),
  );

  ctx.drawImage(image, 0, 0, width, height);

  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, width / 2, height / 2 + 180);

  return canvas.toBuffer();
};

module.exports = createImposterImage;
