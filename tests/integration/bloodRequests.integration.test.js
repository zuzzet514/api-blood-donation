import request from 'supertest';
import mongoose from 'mongoose';
import initializeApp from '../../app.js';

let app, server;
let token;
let requestId;

beforeAll(async () => {
  const result = await initializeApp();
  app = result.app;
  server = result.server;

  const email = `req_test_${Date.now()}@mail.com`;
  const password = "12345678";

  await request(app).post('/api/auth/register').send({
    username: "bloodUser",
    email,
    password,
    type: "person",
    personData: {
      name: "Test",
      last_name: "User",
      age: 30,
      sex: "M",
      phone: "1234567890",
      blood_type: "O+",
      address: {
        street: "Calle 1",
        city: "Ciudad",
        state: "Estado",
        zip_code: "12345",
        country: "MX"
      }
    }
  });

  const loginRes = await request(app).post('/api/auth/login').send({ identifier: email, password });
  token = loginRes.body.access_token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await server.close();
});

describe('BloodRequest Integration Tests', () => {
  it('debería crear una solicitud de sangre', async () => {
    const res = await request(app)
      .post('/api/blood-request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        bloodType: "O+",
        medicalCondition: "Surgery",
        urgency: "high",
        amountRequiredML: 500,
        deadline: "2025-12-31",
        description: "Necesitamos sangre urgente"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    requestId = res.body._id;
  });

  it('debería obtener las solicitudes del usuario', async () => {
    const res = await request(app)
      .get('/api/blood-request')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
