const readline = require('readline');
const connectMongoose = require('./connectMongoose');
const Ad = require('./src/models/adModel');
const adData = require('./src/data/anuncios.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('¿Estás seguro de que deseas reiniciar la base de datos? Esta acción eliminará todos los datos existentes. (sí/no): ', (answer) => {
  if (answer.toLowerCase() === 'sí' || answer.toLowerCase() === 'si') {
    initDB();
  } else {
    console.log('Operación cancelada');
    rl.close();
    process.exit(0);
  }
});

const initDB = async () => {
  try {
    await connectMongoose.mongoose.connection;

    // Borrar todas las entradas existentes
    const deleteResult = await Ad.deleteMany({});
    console.log(`Registros eliminados con éxito. Total eliminados: ${deleteResult.deletedCount}`);

    // Insertar nuevos anuncios desde el archivo anuncios.json
    await Ad.insertMany(adData.anuncios);

    console.log('Base de datos inicializada con éxito');
    process.exit(0);
  } catch (error) {
    console.error(`Error inicializando la base de datos: ${error}`);
    process.exit(1);
  }
};
