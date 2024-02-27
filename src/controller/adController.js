const Ad = require('../models/adModel');
const fs = require('fs');
const path = require('path');
const { uploadDir } = require('../../config');


// Obtener lista de anuncios sin filtros
exports.getAds = async (req, res) => {
  try {
    const ads = await Ad.find();
    res.json({ success: true, data: ads });
  } catch (error) {
    console.error(`Error obteniendo la lista de anuncios: ${error}`);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// Registrar un nuevo anuncio
exports.registrarAnuncio = async (req, res) => {
  try {
    const { nombre, precio, tags } = req.body;
    const venta = req.body.venta === 'on'; 
    const tempFilePath = req.file.path;
    const imageFileName = `${Date.now()}_${req.file.originalname}`;
    const imagePath = path.join(uploadDir, imageFileName);
    const fileBuffer = fs.readFileSync(tempFilePath);
    fs.writeFileSync(imagePath, fileBuffer);

    fs.unlinkSync(tempFilePath);

    const nuevoAnuncio = new Ad({
      nombre,
      venta,
      precio,
      foto: `/images/${imageFileName}`,
      tags: Array.isArray(tags) ? tags : [tags],
    });

    // Guarda el anuncio en la base de datos
    await nuevoAnuncio.save();

  // Mensaje de éxito
    const successMessage = 'Anuncio registrado correctamente';
    
    // Si la solicitud es AJAX, envía la respuesta JSON
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.status(200).json({ success: true, message: successMessage });
    } else {
      // Si no es una solicitud AJAX, redirige y pasa el mensaje como parámetro de consulta
      res.redirect(`/?success=${encodeURIComponent(successMessage)}`);
    }
  } catch (error) {
    console.error(`Error al registrar el anuncio: ${error}`);
    // Si hay un error, redirige y pasa el mensaje de error como parámetro de consulta
    res.redirect(`/?error=${encodeURIComponent('Error interno del servidor')}`);
  }
};


