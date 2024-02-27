const express = require('express');
const router = express.Router();
const adController = require('../controller/adController');

  // Ruta para obtener la lista de anuncios sin filtros
  router.get('/apiv1/anuncios', adController.getAds);
  
// Ruta para registrar un nuevo anuncio
router.post('/api/ads/registrar', adController.registrarAnuncio);

module.exports = router;