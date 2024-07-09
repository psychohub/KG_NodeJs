const mongoose = require('mongoose');

mongoose.connect('mongodb://admin:password123@127.0.0.1:27017/parsedb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Conexión a la base de datos establecida con éxito');
});

mongoose.connection.on('error', (err) => {
    console.error(`Error de conexión a la base de datos: ${err}`);
});

module.exports = { mongoose, connection: mongoose.connection };

