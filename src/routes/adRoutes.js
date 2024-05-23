const express = require('express');
const router = express.Router();
const adController = require('../controller/adController');
const { requireAuth } = require('../middleware/authMiddleware');
const multer = require('multer');
const { uploadDir } = require('../../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });
  
  const upload = multer({ storage: storage });



// Ruta para obtener la lista de anuncios sin filtros
router.get('/anuncios', requireAuth, adController.getAds);

// Ruta para registrar un nuevo anuncio
router.post('/anuncios/registrar', requireAuth, upload.single('foto'), adController.validateRegistroAnuncio, adController.registrarAnuncio);

// Ruta para obtener la lista de anuncios con filtros
router.get('/anuncios/filtro', requireAuth, adController.getFilteredAds);

module.exports = router;
