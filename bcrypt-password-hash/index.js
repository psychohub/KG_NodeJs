const bcrypt = require('bcrypt');

// Hashear una contraseña
const saltRounds = 10;
const plainPassword = '1234';

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    throw err;
  }

  console.log('Contraseña hasheada:', hash);

  // Comparar la contraseña hasheada con la contraseña en texto plano
  bcrypt.compare(plainPassword, hash, (err, result) => {
    if (err) {
      throw err;
    }

    console.log('¿Contraseña coincide?:', result);
  });
});
