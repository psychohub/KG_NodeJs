const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Middleware pre('save') para hashear la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  const user = this;

  // Verificar si la contraseña ha sido modificada
  if (!user.isModified('password')) {
    return next();
  }

  try {
    // Generar el hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

// Método para comparar la contraseña
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;