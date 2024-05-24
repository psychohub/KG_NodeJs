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


/**
 * @swagger
 * /api/ads/anuncios:
 *   get:
 *     summary: Obtener lista de anuncios sin filtros
 *     responses:
 *       200:
 *         description: Lista de anuncios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ad'
 *       500:
 *         description: Error interno del servidor
 */
// Ruta para obtener la lista de anuncios sin filtros
router.get('/anuncios', requireAuth, adController.getAds);

/**
 * @swagger
 * /api/ads/anuncios/registrar:
 *   post:
 *     summary: Registrar un nuevo anuncio
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               venta:
 *                 type: boolean
 *               precio:
 *                 type: number
 *               foto:
 *                 type: string
 *                 format: binary
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Anuncio registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Ad'
 *       400:
 *         description: Error en los datos de entrada
 *       500:
 *         description: Error interno del servidor
 */
// Ruta para registrar un nuevo anuncio
router.post('/anuncios/registrar', requireAuth, upload.single('foto'), adController.validateRegistroAnuncio, adController.registrarAnuncio);

/**
 * @swagger
 * /api/ads/anuncios/filtro:
 *   get:
 *     summary: Obtener lista de anuncios con filtros
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filtrar por tag
 *       - in: query
 *         name: venta
 *         schema:
 *           type: boolean
 *         description: Filtrar por tipo de anuncio (venta o búsqueda)
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de artículo
 *       - in: query
 *         name: precioMin
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: precioMax
 *         schema:
 *           type: number
 *         description: Precio máximo
 *     responses:
 *       200:
 *         description: Lista de anuncios filtrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ad'
 *       500:
 *         description: Error interno del servidor
 */
// Ruta para obtener la lista de anuncios con filtros
router.get('/anuncios/filtro', requireAuth, adController.getFilteredAds);

module.exports = router;
