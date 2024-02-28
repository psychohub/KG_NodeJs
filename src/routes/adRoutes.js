const express = require('express');
const router = express.Router();
const adController = require('../controller/adController');

// Ruta para obtener la lista de anuncios sin filtros
router.get('/anuncios', adController.getAds);
  
// Ruta para registrar un nuevo anuncio
router.post('/registrar', adController.registrarAnuncio);

// Ruta para obtener la lista de anuncios con filtros
router.get('/anuncios/filtro', adController.getFilteredAds);



module.exports = router;