const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

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
exports.authenticate = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(`Usuario encontrado: ${user}`);
    
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('Contraseña candidata:', password);
    console.log('Contraseña almacenada:', user.password);
    console.log('¿Contraseña coincide?:', isMatch);

    if (!isMatch) {
      console.log('Credenciales incorrectas');
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(`Token generado: ${token}`);
    res.json({ token });
  } catch (error) {
    console.error(`Error interno del servidor: ${error}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
