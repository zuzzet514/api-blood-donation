import request from 'supertest';
import initializeApp from '../../app.js';
import mongoose from 'mongoose';

let app, server;
let accessToken = '';

beforeAll(async () => {
  const init = await initializeApp();
  app = init.app;
  server = init.server;

  await request(app).post('/api/auth/register').send({
    username: "cuentaprueba1",
    email: "cuenta1@example.com",
    password: "PruebaSegura123",
    type: "person",
    personData: {
      name: "Maria",
      last_name: "González",
      age: 28,
      sex: "F",
      phone: "2222234567",
      blood_type: "A+",
      address: {
        street: "Calle de las Flores 123",
        city: "Puebla",
        state: "Puebla",
        zip_code: "72000",
        country: "México"
      }
    }
  });

  const login = await request(app).post('/api/auth/login').send({
    identifier: "cuenta1@example.com",
    password: "PruebaSegura123"
  });

  accessToken = login.body.access_token;
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});

describe('Account Integration Tests', () => {
  it('GET /api/account/me → debería devolver los datos de la cuenta', async () => {
    const res = await request(app)
      .get('/api/account/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('account');
    expect(res.body).toHaveProperty('personalData');
    expect(res.body.account).toHaveProperty('email', 'cuenta1@example.com');
  });

  it('PUT /api/account/me → debería actualizar los datos de la cuenta y persona', async () => {
    const res = await request(app)
        .put('/api/account/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
        username: 'mariaDB',       
        age: 29                    
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Account and personal data updated successfully');
    expect(res.body.account).toHaveProperty('username', 'mariaDB');
  });


  it('DELETE /api/account/me → debería eliminar la cuenta', async () => {
    const res = await request(app)
      .delete('/api/account/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Account and linked data deleted successfully');
  });
});
