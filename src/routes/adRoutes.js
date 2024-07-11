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

router.get('/anuncios', requireAuth, adController.getAds);
router.post('/anuncios/registrar', requireAuth, upload.single('foto'), adController.validateRegistroAnuncio, adController.registrarAnuncio);
router.get('/anuncios/filtro', requireAuth, adController.getFilteredAds);

module.exports = router;
