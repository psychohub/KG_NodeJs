require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const i18n = require('i18n');
const cors = require('cors');
const multer = require('multer');
const { body } = require('express-validator');
const app = express();

const adController = require('./src/controller/adController');
const adRoutes = require('./src/routes/adRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { requireAuth } = require('./src/middleware/authMiddleware');
const errorHandler = require('./errorHandler');
const { connection } = require('./connectMongoose');
const { uploadDir } = require('./config');
const { swaggerUi, swaggerSpec } = require('./lib/swaggerMiddleware');

// Configuración de Express
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de ejs para vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

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
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

app.use((req, res, next) => {
  const language = req.cookies.language || 'en';
  req.setLocale(language);
  next();
});

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

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.get('/api/login', (req, res) => {
  res.render('login');
});

app.use('/api/auth', authRoutes);

// Rutas de anuncios protegidas por autenticación
app.use('/api/ads', requireAuth, adRoutes);

// Ruta para registrar un nuevo anuncio con validaciones
app.post(
  '/api/ads/anuncios/registrar',
  upload.single('foto'),
  [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('precio').isNumeric().withMessage('El precio debe ser un número válido'),
  ],
  adController.registrarAnuncio
);

// Ruta para servir imágenes específicas
app.get('/images/:imageName', adController.getImage);

// Filtrado de anuncios (protegido)
app.get('/anuncios/filtro', requireAuth, adController.getFilteredAds);

// Ruta principal redirigiendo a anuncios
app.get('/', (req, res) => {
  res.redirect('/api/ads/anuncios');
});

// Ruta de confirmación
app.get('/confirmacion', async function (req, res) {
  const ads = await Ad.find();
  const successMessage = req.__('Anuncio registrado correctamente');
  res.render('index', { adData: { anuncios: ads }, success: successMessage, req });
});

// Conexión a la base de datos y levantamiento del servidor
connection.once('open', () => {
  app.listen(3001, () => {
    console.log('Servidor iniciado en el puerto 3001');
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;
