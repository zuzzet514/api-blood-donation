import request from 'supertest';
import initializeApp from '../../app.js';
import mongoose from 'mongoose';

let app, server, dbConnection;
let accessToken = '';
let accountId = '';

beforeAll(async () => {
  const init = await initializeApp();
  app = init.app;
  server = init.server;
  dbConnection = init.dbConnection;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  server.close();
});

describe('Donor Integration Tests', () => {
  it('POST /api/auth/register → debería registrar una cuenta tipo persona', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'donadorprueba',
      email: 'donador@mail.com',
      password: 'donadorpass',
      type: 'person',
      personData: {
        name: 'Carlos',
        last_name: 'Medina',
        age: 40,
        sex: 'M',
        phone: '8187654321',
        blood_type: 'AB-',
        address: {
          street: 'Av. Tecnológico 145',
          city: 'Monterrey',
          state: 'Nuevo León',
          zip_code: '64000',
          country: 'México'
        }
      }
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/Account and profile created successfully/);
  });

  it('POST /api/auth/login → debería iniciar sesión y obtener access token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      identifier: 'donadorprueba',
      password: 'donadorpass'
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    accessToken = res.body.access_token;
    accountId = res.body.account.id;
  });

  it('POST /api/donors → debería registrar información como donador elegible', async () => {
    const res = await request(app)
      .post('/api/donors')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        last_surgery_date: '2023-01-01',
        last_tattoo_or_piercing_date: '2022-01-01',
        is_pregnant: false,
        has_heart_disease: false,
        has_disqualifying_conditions: false
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', expect.stringContaining('eligible'));
    expect(res.body.donor_info.is_eligible).toBe(true);
  });

  it('GET /api/donors/search → debería filtrar donadores por tipo de sangre', async () => {
    const res = await request(app)
      .get('/api/donors/search?blood_type=AB-')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].blood_type).toBe('AB-');
  });
});
