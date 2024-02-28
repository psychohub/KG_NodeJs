const express = require('express');
const axios = require('axios');
const adController = require('./src/controller/adController');
const multer = require('multer');
const bodyParser = require('body-parser');
const adData = require('./src/data/anuncios.json');
const adRoutes = require('./src/routes/adRoutes');
const cors = require('cors');
const errorHandler = require('./errorHandler');
const path = require('path'); 
const Ad = require('./src/models/adModel');
const app = express();

// Importa la configuración de mongoose
const { connection } = require('./connectMongoose');
const { uploadDir } = require(path.join(__dirname, 'config'));

// Configuración de Express
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importar ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use('/images', express.static(path.join(__dirname, 'src/images')));


app.use('/api/ads', adRoutes);


// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

const upload = multer({ storage: storage });

// Filtrado de anuncios
app.get('/anuncios/filtro', adController.getFilteredAds);


// Obtiene lista de anuncios

app.get('/api/ads/anuncios', adController.getAds);

// Registrar un nuevo anuncio
app.post('/api/ads/registrar', upload.single('foto'), adController.registrarAnuncio);

app.get('/confirmacion', async function(req, res) {
    // lista actualizada de anuncios
    const ads = await Ad.find();
  
    const successMessage = 'Anuncio registrado correctamente';
  
    // Renderiza la vista con la lista actualizada de anuncios y el mensaje de éxito
    res.render('index', { adData: { anuncios: ads }, success: successMessage });
  });



 // Redirección de la ruta principal
 app.get('/', (req, res) => {
  res.redirect('/api/ads/anuncios');
});


connection.once('open', () => {
    app.listen(3000, () => {
        console.log('Servidor iniciado en el puerto 3000');
    });
});

// Middleware de manejo de errores
app.use(errorHandler);
