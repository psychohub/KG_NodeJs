const connectMongoose = require('./connectMongoose');
const Ad = require('./src/models/adModel');
const adData = require('./src/data/anuncios.json');

const initDB = async () => {
  try {
    await connectMongoose;

    // Borrar todas las entradas existentes
    await Ad.deleteMany({});

    // Insertar nuevos anuncios desde el archivo anuncios.json
    await Ad.insertMany(adData.anuncios);

    console.log('Base de datos inicializada con éxito');
    process.exit(0);
  } catch (error) {
    console.error(`Error inicializando la base de datos: ${error}`);
    process.exit(1);
  }
};

initDB();