import request from 'supertest';
import initializeApp from '../../app.js';
import mongoose from 'mongoose';

let app, server, dbConnection;
let accessToken;
let requestId;

beforeAll(async () => {
  const init = await initializeApp();
  app = init.app;
  server = init.server;
  dbConnection = init.dbConnection;

  await request(app)
    .post('/api/auth/register')
    .send({
      username: "donador1",
      email: "donador1@example.com",
      password: "donador123",
      type: "person",
      personData: {
        name: "Carlos",
        last_name: "Mendez",
        age: 35,
        sex: "M",
        phone: "1234567890",
        blood_type: "A+",
        address: {
          street: "Calle 1",
          city: "CDMX",
          state: "CDMX",
          zip_code: "00000",
          country: "México"
        }
      }
    });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ identifier: "donador1", password: "donador123" });

  accessToken = loginRes.body.access_token;

  await request(app)
    .post('/api/donors')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      last_surgery_date: "2023-01-01",
      last_tattoo_or_piercing_date: "2022-01-01",
      is_pregnant: false,
      has_heart_disease: false,
      has_disqualifying_conditions: false
    });
});

describe('Blood Request Integration Tests', () => {
  it('POST /api/blood-requests → debería crear una solicitud de sangre', async () => {
    const res = await request(app)
      .post('/api/blood-requests')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        bloodType: "A+",
        requesterModel: "Person",
        medicalCondition: "Emergencia",
        urgency: "high",
        amountRequiredML: 1000,
        deadline: "2025-12-31T00:00:00.000Z",
        description: "Se necesita sangre urgente"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    requestId = res.body._id;
  });

  it('GET /api/blood-requests → debería devolver todas las solicitudes', async () => {
    const res = await request(app)
      .get('/api/blood-requests')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/blood-requests/:id → debería devolver solicitud por ID', async () => {
    const res = await request(app)
      .get(`/api/blood-requests/${requestId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', requestId);
  });

  it('PUT /api/blood-requests/:id → debería actualizar solicitud', async () => {
    const res = await request(app)
      .put(`/api/blood-requests/${requestId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ urgency: 'medium', amountRequiredML: 500 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('urgency', 'medium');
  });

  it('GET /api/blood-requests/search → debería filtrar por tipo, urgencia y estado', async () => {
    const res = await request(app)
      .get('/api/blood-requests/search?blood_type=A%2B&urgency=medium&status=open')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/blood-requests/application/:requestId → debería aplicar a una solicitud', async () => {
    const res = await request(app)
      .post(`/api/blood-requests/application/${requestId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Applied successfully');
  });

  it('DELETE /api/blood-requests/:id → debería eliminar la solicitud', async () => {
    const res = await request(app)
      .delete(`/api/blood-requests/${requestId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Blood request deleted successfully');
  });
});

afterAll(async () => {
  if (dbConnection?.connection?.dropDatabase) {
    await dbConnection.connection.dropDatabase();
    await dbConnection.connection.close();
  }
  await new Promise((resolve) => server.close(resolve));
});
