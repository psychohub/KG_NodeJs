const mongoose = require('mongoose');

// Configuración de mongoose y conexión a la base de datos
mongoose.connect('mongodb://admin:password123@localhost:27017/parsedb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Conexión exitosa
mongoose.connection.on('connected', () => {
    console.log('Conexión a la base de datos establecida con éxito');
});

// Error de conexión
mongoose.connection.on('error', (err) => {
    console.error(`Error de conexión a la base de datos: ${err}`);
});

module.exports = { mongoose, connection: mongoose.connection };
