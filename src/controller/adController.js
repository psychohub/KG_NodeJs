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

// Obtener lista de anuncios con filtros
exports.getFilteredAds = async (req, res) => {
  try {
    const { tag, venta, nombre, precio, start, limit, sort } = req.query;

    const filters = {};

    // Filtro por tag
    if (tag) {
      filters.tags = tag;
    }

    // Filtro por tipo de anuncio (venta o búsqueda)
    if (venta !== undefined) {
      filters.venta = venta === 'true';
    }

    // Filtro por rango de precio
    if (precio) {
      const precioParts = precio.split('-');
      if (precioParts.length === 1) {
        filters.precio = { $eq: parseFloat(precioParts[0]) };
      } else if (precioParts.length === 2) {
        const precioFilter = {};
        if (precioParts[0]) precioFilter.$gte = parseFloat(precioParts[0]);
        if (precioParts[1]) precioFilter.$lte = parseFloat(precioParts[1]);
        filters.precio = precioFilter;
      }
    }

    // Filtro por nombre de artículo
    if (nombre) {
      filters.nombre = new RegExp(nombre, 'i');
    }

    // Agregar más filtros según sea necesario

    // Elimina propiedades con valores falsy (undefined, null, "")
    Object.keys(filters).forEach((key) => filters[key] === undefined && delete filters[key]);

    // Implementa lógica para aplicar los filtros a la consulta
    const ads = await Ad.find(filters)
      .skip(parseInt(start) || 0)
      .limit(parseInt(limit) || 10)
      .sort(sort || 'createdAt');

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



