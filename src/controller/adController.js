const Ad = require('../models/adModel');
const fs = require('fs');
const path = require('path');
const pathModule = require('path');
const { uploadDir } = require('../../config');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const cote = require('cote');
const requester = new cote.Requester({ name: 'thumbnail requester' });
const { body, validationResult } = require('express-validator');

// Registrar un nuevo anuncio
exports.registrarAnuncio = async (req, res) => {
  const isApiRequest = req.headers.accept && req.headers.accept.includes('json');

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      if (isApiRequest) {
        return res.status(400).json({ error: 'No se ha enviado ningún archivo' });
      } else {
        return res.redirect(`/?error=${encodeURIComponent('No se ha enviado ningún archivo')}`);
      }
    }

    const { nombre, precio, tags } = req.body;
    const venta = req.body.venta === 'on';
    const tempFilePath = req.file.path;
    const imageFileName = `${Date.now()}_${req.file.originalname}`;
    const imagePath = path.join(uploadDir, imageFileName);
    const fileBuffer = fs.readFileSync(tempFilePath);
    fs.writeFileSync(imagePath, fileBuffer);
    fs.unlinkSync(tempFilePath);
    requester.send({ type: 'createThumbnail', imagePath });

    const nuevoAnuncio = new Ad({
      nombre,
      venta,
      precio,
      foto: `/images/${imageFileName}`,
      tags: Array.isArray(tags) ? tags : [tags],
    });

    await nuevoAnuncio.save();

    if (isApiRequest) {
      return res.status(201).json({ success: true, message: 'Anuncio registrado correctamente', data: nuevoAnuncio });
    } else {
      return res.redirect('/confirmacion');
    }
  } catch (error) {
    console.error(`Error al registrar el anuncio: ${error}`);
    if (isApiRequest) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      return res.redirect(`/?error=${encodeURIComponent(error.message)}`);
    }
  }
};

// Reglas de validación para el registro de anuncios
exports.validateRegistroAnuncio = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('precio').isNumeric().withMessage('El precio debe ser un número válido'),
];

// Obtener lista de anuncios sin filtros
exports.getAds = async (req, res) => {
  try {
    const ads = await Ad.find();
    const isApiRequest = req.headers.accept && req.headers.accept.includes('json');

    if (isApiRequest) {
      return res.json({ success: true, data: ads });
    } else {
      const data = {
        adData: { anuncios: ads },
        tag: '',
        nombre: '',
        venta: '',
        precioMin: '',
        precioMax: '',
      };
      return res.render('index', { ...data, req });
    }
  } catch (error) {
    console.error(`Error obteniendo la lista de anuncios: ${error}`);
    if (req.headers.accept && req.headers.accept.includes('json')) {
      return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    } else {
      return res.status(500).render('error', { error: 'Error interno del servidor' });
    }
  }
};

// Obtener lista de anuncios con filtros
exports.getFilteredAds = async (req, res) => {
  try {
    const { tag, venta, nombre, precioMin, precioMax } = req.query;

    const filters = {};

    if (tag) filters.tags = tag;
    if (venta !== undefined) filters.venta = venta === 'true';
    if (nombre) filters.nombre = new RegExp(nombre, 'i');

    if (precioMin || precioMax) {
      const precioFilter = {};
      if (precioMin) precioFilter.$gte = parseFloat(precioMin);
      if (precioMax) precioFilter.$lte = parseFloat(precioMax);
      filters.precio = precioFilter;
    }

    if (nombre) {
      filters.nombre = new RegExp(nombre, 'i');
    }

    Object.keys(filters).forEach((key) => filters[key] === undefined && delete filters[key]);

    const ads = await Ad.find(filters);

    const isApiRequest = req.headers.accept && req.headers.accept.includes('json');

    if (isApiRequest) {
      res.json({ success: true, data: ads });
    } else {
      res.render('filtered-ads', { adData: { anuncios: ads }, req });
    }
  } catch (error) {
    console.error(`Error obteniendo la lista de anuncios: ${error}`);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// Función para manejar las solicitudes de imágenes
exports.getImage = (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = pathModule.join(__dirname, '..', '..', 'src', 'images', imageName);

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send('Imagen no encontrada');
    }
  });
};
