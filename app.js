require('dotenv').config(); 

// Importar rutas y controladores
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const express = require('express');
const i18n = require('i18n');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 
const multer = require('multer');
const { body } = require('express-validator');
const app = express();

const adController = require('./src/controller/adController');
const adRoutes = require('./src/routes/adRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { requireAuth } = require('./src/middleware/authMiddleware');
const errorHandler = require('./errorHandler');
const Ad = require('./src/models/adModel');
const { connection } = require('./connectMongoose');
const { uploadDir } = require(path.join(__dirname, 'config'));

// Configuración de Express
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de ejs para vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use('/images', express.static(path.join(__dirname, 'src/images')));

// Configuración de i18n para el backend
i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  cookie: 'language',
});

app.use(i18n.init);

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(cookieParser());

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('Acceso denegado');
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Token inválido');
  }
}

const upload = multer({ storage: storage });

// Rutas
app.get('/api/login', (req, res) => {
  res.render('login');
});

app.use('/api/auth', authRoutes); 

// Rutas de anuncios protegidas por autenticación
app.use('/api/ads', requireAuth, adRoutes);

// Ruta para registrar un nuevo anuncio con validaciones
app.post('/api/ads/anuncios/registrar',
  upload.single('foto'), 
  [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('precio').isNumeric().withMessage('El precio debe ser un número válido'),
  ],
  adController.registrarAnuncio
);

// Ruta para servir imágenes específicas
app.get('/api/ads/anuncios/:imageName', adController.getImage);

// Filtrado de anuncios (protegido)
app.get('/anuncios/filtro', requireAuth, adController.getFilteredAds);

// Ruta principal redirigiendo a anuncios
app.get('/', (req, res) => {
  res.redirect('/api/ads/anuncios');
});

// Ruta de confirmación
app.get('/confirmacion', async function(req, res) {
  const ads = await Ad.find();
  const successMessage = 'Anuncio registrado correctamente';
  res.render('index', { adData: { anuncios: ads }, success: successMessage });
});

// Conexión a la base de datos y levantamiento del servidor
connection.once('open', () => {
  app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
  });
});

// Middleware de manejo de errores
app.use(errorHandler);
app.use('/api/ads', verifyToken);