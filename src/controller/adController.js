const Ad = require('../models/adModel');
const fs = require('fs');
const path = require('path');
const { uploadDir } = require('../../config');


// Obtener lista de anuncios sin filtros
exports.getAds = async (req, res) => {
  try {
    const ads = await Ad.find();

    // Verificar si es una solicitud de API o no
    const isApiRequest = req.headers.accept && req.headers.accept.includes('json');

    if (isApiRequest) {
      res.json({ success: true, data: ads });
    } else {
      // Si no es una solicitud de API, renderizar la vista
      res.render('index', { adData: { anuncios: ads } });
    }
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

    // Obtén la lista actualizada de anuncios
    const ads = await Ad.find();

    const successMessage = 'Anuncio registrado correctamente';

    // Renderiza la vista con la lista actualizada de anuncios y el mensaje de éxito
    res.redirect('/confirmacion');
  } catch (error) {
    console.error(`Error al registrar el anuncio: ${error}`);
    res.redirect(`/?error=${encodeURIComponent('Error interno del servidor')}`);
  }
};



