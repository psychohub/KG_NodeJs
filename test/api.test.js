const request = require('supertest');
const app = require('../app'); 
const jwt = require('jsonwebtoken');
const User = require('../src/models/userModel');
const path = require('path');
const fs = require('fs');
const timestamp = Date.now();
const email = `user_${timestamp}@test.com`;
const user = new User({ email, password: '1234' });

describe('API de Anuncios', () => {
  let token;

  beforeAll(async () => {
    await User.deleteOne({ email: 'user@test.com' });
    const user = new User({ email: 'user@test.com', password: '1234' });
    await user.save();
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'user@test.com' });
  });

  it('debería responder con una lista de anuncios', (done) => {
    request(app)
      .get('/api/ads/anuncios')
      .set('Cookie', `token=${token}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeInstanceOf(Array);
        done();
      });
  });

  it('debería crear un nuevo anuncio con una imagen ficticia', (done) => {
    const newAd = {
      nombre: 'Nuevo anuncio',
      venta: true,
      precio: 100,
      tags: ['work', 'lifestyle']
    };
    const imagePath = path.join(__dirname, 'fixtures', 'test.jpg');
    if (!fs.existsSync(imagePath)) {
      fs.writeFileSync(imagePath, 'test'); 
    }

    request(app)
      .post('/api/ads/anuncios/registrar')
      .set('Cookie', `token=${token}`)
      .set('Accept', 'application/json')
      .field('nombre', newAd.nombre)
      .field('venta', newAd.venta)
      .field('precio', newAd.precio)
      .field('tags', newAd.tags.join(','))
      .attach('foto', imagePath)
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).toBe(true);
        expect(res.body.data.nombre).toBe(newAd.nombre);
        expect(res.body.data.precio).toBe(newAd.precio);
        done();
      });
  });
});
