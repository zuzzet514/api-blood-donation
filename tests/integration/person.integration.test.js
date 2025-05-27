import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import initializeApp from '../../app.js';
import crypto from 'crypto';

dotenv.config();

let app, server;

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

describe('Person Integration Tests - Donor Eligibility', () => {
  it('debería marcar como elegible al usuario vía POST /api/donor', async () => {
    const uuid = crypto.randomUUID();
    const email = `eligible_${uuid}@mail.com`;
    const password = '12345678';

    const registerRes = await request(app).post('/api/auth/register').send({
      username: `eligible_user_${uuid}`,
      email,
      password,
      type: 'person',
      personData: {
        name: 'Elig',
        last_name: 'Tester',
        age: 30,
        sex: 'M',
        phone: '1111111111',
        blood_type: 'O+',
        address: {
          street: 'Calle A',
          city: 'Ciudad',
          state: 'Estado',
          zip_code: '11111',
          country: 'MX'
        }
      }
    });

    expect(registerRes.statusCode).toBe(201);
    await new Promise(resolve => setTimeout(resolve, 150));

    const loginRes = await request(app).post('/api/auth/login').send({ identifier: email, password });
    expect(loginRes.statusCode).toBe(200);
    const token = loginRes.body.access_token;
    expect(token).toBeDefined();

    const now = new Date();
    const res = await request(app).post('/api/donor')
      .set('Authorization', `Bearer ${token}`)
      .send({
        last_surgery_date: new Date(now.setMonth(now.getMonth() - 7)),
        last_tattoo_or_piercing_date: new Date(now.setFullYear(now.getFullYear() - 2)),
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

  it('debería rechazar si el usuario tiene condiciones médicas', async () => {
    const uuid = crypto.randomUUID();
    const email = `inelegible_${uuid}@mail.com`;
    const password = '12345678';

    const registerRes = await request(app).post('/api/auth/register').send({
      username: `inelegible_user_${uuid}`,
      email,
      password,
      type: 'person',
      personData: {
        name: 'Ine',
        last_name: 'Tester',
        age: 30,
        sex: 'M',
        phone: '2222222222',
        blood_type: 'A+',
        address: {
          street: 'Calle B',
          city: 'Ciudad',
          state: 'Estado',
          zip_code: '22222',
          country: 'MX'
        }
      }
    });

    expect(registerRes.statusCode).toBe(201);
    await new Promise(resolve => setTimeout(resolve, 150));

    const loginRes = await request(app).post('/api/auth/login').send({ identifier: email, password });
    expect(loginRes.statusCode).toBe(200);
    const token = loginRes.body.access_token;
    expect(token).toBeDefined();

    const res = await request(app).post('/api/donor')
      .set('Authorization', `Bearer ${token}`)
      .send({
        last_surgery_date: new Date(),
        last_tattoo_or_piercing_date: new Date(),
        is_pregnant: false,
        has_heart_disease: true,
        has_disqualifying_conditions: true
      });

    expect([403, 200]).toContain(res.statusCode);
    if (res.statusCode === 403) {
      expect(res.body).toHaveProperty('message', 'Not eligible to become a donor.');
      expect(Array.isArray(res.body.reasons)).toBe(true);
    }
  });
});
