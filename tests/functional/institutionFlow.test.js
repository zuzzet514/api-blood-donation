import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import initializeApp from '../../app.js';
import crypto from 'crypto';

dotenv.config();

let app, server, dbConnection;
let accessToken = '';
let requestId = '';

beforeAll(async () => {
  const result = await initializeApp();
  app = result.app;
  server = result.server;
  dbConnection = result.dbConnection;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await server.close();
});

describe('Prueba funcional completa - flujo usuario tipo institución', () => {
  const uuid = crypto.randomUUID();
  const email = `inst_${uuid}@mail.com`;
  const password = '12345678';

  it('1. debería registrar una cuenta de tipo institución', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: `inst_user_${uuid}`,
      email,
      password,
      type: 'institution',
      institutionData: {
        name: 'Centro Médico XYZ',
        address: {
          street: 'Av. Salud',
          city: 'Ciudad Salud',
          state: 'Veracruz',
          zip_code: '99999',
          country: 'MX'
        },
        phone: '1234567890',
        fax: '11112222',
        website: 'https://centromedicoxyz.mx'
      }
    });

    expect(res.statusCode).toBe(201);
  });

  it('2. debería iniciar sesión correctamente y obtener token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      identifier: email,
      password
    });

    expect(res.statusCode).toBe(200);
    accessToken = res.body.access_token;
    expect(accessToken).toBeDefined();
  });

  it('3. debería crear una solicitud de sangre', async () => {
    const res = await request(app)
      .post('/api/blood-request')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        bloodType: 'A+',
        medicalCondition: 'Emergencia quirúrgica',
        urgency: 'high',
        amountRequiredML: 700,
        deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
        description: 'Paciente necesita transfusión inmediata'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    requestId = res.body._id;
  });

  it('4. debería listar las solicitudes y contener la creada', async () => {
    const res = await request(app)
      .get('/api/blood-request')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find(req => req._id === requestId);
    expect(found).toBeDefined();
  });
});
