const express = require('express');
const bodyParser = require('body-parser');
const adRoutes = require('./src/routes/adRoutes');
const cors = require('cors');
const errorHandler = require('./errorHandler');
const app = express();

// Importa la configuración de mongoose
const { connection } = require('./connectMongoose');

// Configuración de Express
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes

app.get('/', (req, res) => {
    res.send('Test node API');
});


/**
app.use('/api/ads', adRoutes);
 */


connection.once('open', () => {
    app.listen(3000, () => {
        console.log('Servidor iniciado en el puerto 3000');
    });
});



// Middleware de manejo de errores
app.use(errorHandler);

