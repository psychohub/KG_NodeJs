const express = require('express');
const router = express.Router();
const adController = require('../controller/adController');

// Ruta para obtener la lista de anuncios sin filtros
router.get('/apiv1/anuncios', adController.getAds);

module.exports = router;