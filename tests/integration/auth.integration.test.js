import request from 'supertest';
import mongoose from 'mongoose';
import initializeApp from '../../app.js';

let app, server;

beforeAll(async () => {
  const result = await initializeApp();
  app = result.app;
  server = result.server;
});

afterAll(async () => {
  await mongoose.connection.collection('accounts').deleteMany({});
  await mongoose.connection.collection('people').deleteMany({});
  await mongoose.connection.collection('sessions').deleteMany({});
  await mongoose.connection.close();
  await server.close();
});

describe('Auth Integration Tests', () => {
  const email = `test_${Date.now()}_${Math.random().toString(36).substring(2)}@mail.com`;
  const password = "12345678";

  const payload = {
    username: "integrationUser",
    email,
    password,
    type: "person",
    personData: {
      name: "Unit",
      last_name: "Tester",
      age: 25,
      sex: "M",
      phone: "1234567890",
      blood_type: "O+",
      address: {
        street: "Av. Universidad",
        city: "Minatitlán",
        state: "Veracruz",
        zip_code: "96360",
        country: "México"
      }
    }
  };

  it('debería registrar una cuenta correctamente vía /auth/register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Account and profile created successfully');
  });

  it('debería hacer login exitoso con /auth/login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: email,
        password: password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('refresh_token');
    expect(res.body).toHaveProperty('account');
  });

  it('debería fallar login con contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: email,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(400); 
  });
});
