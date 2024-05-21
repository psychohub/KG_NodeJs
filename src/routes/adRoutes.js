const express = require('express');
const router = express.Router();
const adController = require('../controller/adController');
const { requireAuth } = require('../middleware/authMiddleware');

// Ruta para obtener la lista de anuncios sin filtros
router.get('/anuncios', requireAuth, adController.getAds);

// Ruta para registrar un nuevo anuncio
router.post('/anuncios/registrar', requireAuth, adController.registrarAnuncio);

// Ruta para obtener la lista de anuncios con filtros
router.get('/anuncios/filtro', requireAuth, adController.getFilteredAds);

module.exports = router;
