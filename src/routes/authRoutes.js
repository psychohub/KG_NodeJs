const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

/**
 * @swagger
 * /api/auth/authenticate:
 *   post:
 *     summary: Autenticar usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error interno del servidor
 */
router.post('/authenticate', authController.authenticate);

module.exports = router;
