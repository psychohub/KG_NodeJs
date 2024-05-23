const cote = require('cote');
const Jimp = require('jimp');
const path = require('path');

const thumbnailResponder = new cote.Responder({ name: 'thumbnail responder' });

thumbnailResponder.on('createThumbnail', async (req) => {
  const { imagePath } = req;

  try {
    const image = await Jimp.read(imagePath);
    const thumbnailPath = path.join(path.dirname(imagePath), 'thumbnail_' + path.basename(imagePath));

    image.resize(100, 100);
    await image.writeAsync(thumbnailPath);

    console.log('Thumbnail generado:', thumbnailPath);
  } catch (error) {
    console.error('Error al generar el thumbnail:', error);
  }
});