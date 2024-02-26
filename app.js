const express = require('express');
const bodyParser = require('body-parser');
const adData = require('./src/data/anuncios.json');
const adRoutes = require('./src/routes/adRoutes');
const cors = require('cors');
const errorHandler = require('./errorHandler');
const path = require('path'); 
const app = express();

// Importa la configuración de mongoose
const { connection } = require('./connectMongoose');

// Configuración de Express
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes

// Importar ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use('/images', express.static(path.join(__dirname, 'src/images')));

// Definir ruta para renderizar la vista
app.get('/', (_req, res) => {
    res.render('index', { adData: adData });
});

app.use('/api/ads', adRoutes);
 


connection.once('open', () => {
    app.listen(3000, () => {
        console.log('Servidor iniciado en el puerto 3000');
        adData;
    });
});



// Middleware de manejo de errores
app.use(errorHandler);

