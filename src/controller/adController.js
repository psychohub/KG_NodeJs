const Ad = require('../models/adModel');
const fs = require('fs');
const path = require('path');
const pathModule = require('path');
const { uploadDir } = require('../../config');


// Obtener lista de anuncios sin filtros
exports.getAds = async (req, res) => {
  try {
    const ads = await Ad.find();

   
    const data = {
      adData: { anuncios: ads },
      tag: '', 
      nombre: '',
      venta: '',
      precioMin: '',
      precioMax: '',

    };

    // Verificar si es una solicitud de API o no
    const isApiRequest = req.headers.accept && req.headers.accept.includes('json');

    if (isApiRequest) {
      res.json({ success: true, data: ads });
    } else {
     
      res.render('index', data);
    }
  } catch (error) {
    console.error(`Error obteniendo la lista de anuncios: ${error}`);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};


// Obtener lista de anuncios con filtros
exports.getFilteredAds = async (req, res) => {
  try {
    const { tag, venta, nombre, precioMin, precioMax, start, limit, sort } = req.query;

    const filters = {};

   // Filtro por tag, venta, nombre
   if (tag) filters.tags = tag;
   if (venta !== undefined) filters.venta = venta === 'true';
   if (nombre) filters.nombre = new RegExp(nombre, 'i');

   // Filtro por rango de precio
   if (precioMin || precioMax) {
     const precioFilter = {};
     if (precioMin) precioFilter.$gte = parseFloat(precioMin);
     if (precioMax) precioFilter.$lte = parseFloat(precioMax);
     filters.precio = precioFilter;
   }

  

    // Filtro por nombre de artículo
    if (nombre) {
      filters.nombre = new RegExp(nombre, 'i');
    }


    // Elimina propiedades con valores falsy (undefined, null, "")
    Object.keys(filters).forEach((key) => filters[key] === undefined && delete filters[key]);

    // Implementa lógica para aplicar los filtros a la consulta
    const ads = await Ad.find(filters); // Asegúrate de que esto coincida con tu lógica de filtrado actual.

    const isApiRequest = req.headers.accept && req.headers.accept.includes('json');

    if (isApiRequest) {
      res.json({ success: true, data: ads });
    } else {
      // Modificar para renderizar una vista con los anuncios filtrados
      res.render('filtered-ads', { adData: { anuncios: ads } }); // Asegúrate de tener una vista 'filtered-ads.ejs'
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




