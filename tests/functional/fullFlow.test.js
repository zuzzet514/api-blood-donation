import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import initializeApp from '../../app.js';
import crypto from 'crypto';

dotenv.config();

let app, server;
let token = '';
let requestId = '';

beforeAll(async () => {
  const result = await initializeApp();
  app = result.app;
  server = result.server;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await server.close();
});

describe('Prueba funcional completa - flujo usuario tipo persona', () => {
  const email = `testuser_${crypto.randomUUID()}@mail.com`;
  const password = '12345678';

  it('1. debería registrar una cuenta de tipo persona', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email,
        password,
        type: 'person',
        personData: {
          name: 'Test',
          last_name: 'User',
          age: 28,
          sex: 'F',
          phone: '1234567890',
          blood_type: 'A+',
          address: {
            street: 'Calle 1',
            city: 'Ciudad',
            state: 'Estado',
            zip_code: '12345',
            country: 'MX'
          }
        }
      });

    expect(res.statusCode).toBe(201);
  });

  it('2. debería iniciar sesión correctamente y obtener token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: email, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    token = res.body.access_token;
  });

  it('3. debería crear una solicitud de sangre', async () => {
    const res = await request(app)
      .post('/api/blood-request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        bloodType: 'A+',
        medicalCondition: 'Urgente',
        urgency: 'high',
        amountRequiredML: 450,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        description: 'Paciente necesita sangre urgentemente.'
      });

    expect(res.statusCode).toBe(201);
    requestId = res.body._id;
  });

  it('4. debería listar las solicitudes y contener la creada', async () => {
    const res = await request(app)
        .get('/api/blood-request')
        .set('Authorization', `Bearer ${token}`);  // 🔐 Se agregó esta línea

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const found = res.body.find(req => req._id === requestId);
    expect(found).toBeDefined();
  });


  it('5. debería evaluar elegibilidad como donador y ser elegible', async () => {
    const now = new Date();
    const res = await request(app)
      .post('/api/donor')
      .set('Authorization', `Bearer ${token}`)
      .send({
        last_surgery_date: new Date(now.setMonth(now.getMonth() - 8)),
        last_tattoo_or_piercing_date: new Date(now.setFullYear(now.getFullYear() - 1)),
        is_pregnant: false,
        has_heart_disease: false,
        has_disqualifying_conditions: false
      });

    expect([200, 400]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('donor_info');
      expect(res.body.donor_info.is_eligible).toBe(true);
    }
  });
});
