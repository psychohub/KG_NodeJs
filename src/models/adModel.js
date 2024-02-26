const mongoose = require('mongoose');

const anuncioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    venta: { type: Boolean, required: true },
    precio: { type: Number, required: true },
    foto: { type: String, required: true },
    tags: { type: [String], enum: ['work', 'lifestyle', 'motor', 'mobile'], required: true }
});

const Ad = mongoose.model('Ad', anuncioSchema);

module.exports = Ad;