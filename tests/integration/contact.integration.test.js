import request from 'supertest';
import initializeApp from '../../app.js';
import mongoose from 'mongoose';

let app, server;
let accessToken = '';
let personId = '';
let institutionId = '';

beforeAll(async () => {
  const init = await initializeApp();
  app = init.app;
  server = init.server;

  await request(app).post('/api/auth/register').send({
    username: "contactperson",
    email: "contactperson@example.com",
    password: "12345678",
    type: "person",
    personData: {
      name: "Link",
      last_name: "Tester",
      age: 30,
      sex: "M",
      phone: "5551234567",
      blood_type: "O+",
      address: {
        street: "Av. Central",
        city: "CDMX",
        state: "CDMX",
        zip_code: "01000",
        country: "México"
      }
    }
  });

  const loginRes = await request(app).post('/api/auth/login').send({
    identifier: "contactperson@example.com",
    password: "12345678"
  });

  accessToken = loginRes.body.access_token;

  const meRes = await request(app)
    .get('/api/account/me')
    .set('Authorization', `Bearer ${accessToken}`);

  personId = meRes.body.personalData?._id;

  await request(app).post('/api/auth/register').send({
    username: "contactclinic",
    email: "contactclinic@example.com",
    password: "12345678",
    type: "institution",
    institutionData: {
      name: "Clínica Contacto",
      phone: "5559876543",
      fax: "0000000000",
      website: "https://contacto.org",
      address: {
        street: "Av. Salud",
        city: "GDL",
        state: "Jalisco",
        zip_code: "44100",
        country: "México"
      }
    }
  });

  const loginClinic = await request(app).post('/api/auth/login').send({
    identifier: "contactclinic",
    password: "12345678"
  });

  const instMe = await request(app)
    .get('/api/account/me')
    .set('Authorization', `Bearer ${loginClinic.body.access_token}`);

  institutionId = instMe.body.personalData?._id;
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});

describe('Contact Integration Tests', () => {
  it('GET /api/contact/whatsapp → debería devolver el link de contacto para una persona', async () => {
    const res = await request(app)
      .get(`/api/contact/whatsapp?targetId=${personId}&targetType=person`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('link');
    expect(res.body.link).toMatch(/^https:\/\/wa\.me\/\d+/);
  });

  it('GET /api/contact/whatsapp → debería devolver el link de contacto para una institución', async () => {
    const res = await request(app)
      .get(`/api/contact/whatsapp?targetId=${institutionId}&targetType=institution`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('link');
    expect(res.body.link).toMatch(/^https:\/\/wa\.me\/\d+/);
  });

  it('GET /api/contact/whatsapp → debería fallar si falta targetId', async () => {
    const res = await request(app)
      .get(`/api/contact/whatsapp?targetType=person`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /api/contact/whatsapp → debería fallar si el tipo es inválido', async () => {
    const res = await request(app)
      .get(`/api/contact/whatsapp?targetId=${personId}&targetType=alien`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /api/contact/whatsapp → debería fallar si el targetId no existe', async () => {
    const res = await request(app)
      .get(`/api/contact/whatsapp?targetId=666666666666666666666666&targetType=person`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
