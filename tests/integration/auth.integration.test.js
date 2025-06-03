import request from 'supertest';
import initializeApp from '../../app.js';
import mongoose from 'mongoose';

let app, server;

const timestamp = Date.now();

const personEmail = `maria${timestamp}@example.com`;
const personUsername = `maria${timestamp}`;
const personPassword = 'securePassword123';

const institutionEmail = `clinica${timestamp}@example.com`;
const institutionUsername = `clinica${timestamp}`;
const institutionPassword = 'ClaveFuerte456';

beforeAll(async () => {
  const init = await initializeApp();
  app = init.app;
  server = init.server;
});

afterAll(async () => {
  await mongoose.disconnect(); // Desconexión segura de la BD
  await new Promise((resolve, reject) => {
    server.close(err => {
      if (err) return reject(err);
      resolve();
    });
  });
});

describe('Auth Integration Tests', () => {
  let personRefreshToken = '';
  let institutionRefreshToken = '';

  describe('POST /api/auth/register', () => {
    it('debería registrar una cuenta tipo person', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: personUsername,
        email: personEmail,
        password: personPassword,
        type: 'person',
        personData: {
          name: 'María',
          last_name: 'González',
          age: 28,
          sex: 'F',
          phone: '2222344567',
          blood_type: 'A+',
          address: {
            street: 'Calle de las Flores 123',
            city: 'Puebla',
            state: 'Puebla',
            zip_code: '72000',
            country: 'México'
          }
        }
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message');
    });

    it('debería registrar una cuenta tipo institution', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: institutionUsername,
        email: institutionEmail,
        password: institutionPassword,
        type: 'institution',
        institutionData: {
          name: 'Clínica Nuevo Amanecer',
          phone: '2299442107',
          fax: '7742661471',
          website: 'https://nuevomecoz.org',
          address: {
            street: 'Av. Reforma 456',
            city: 'Toluca',
            state: 'Estado de México',
            zip_code: '50200',
            country: 'México'
          }
        }
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    it('debería iniciar sesión con person', async () => {
      const res = await request(app).post('/api/auth/login').send({
        identifier: personEmail,
        password: personPassword
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('refresh_token');
      personRefreshToken = res.body.refresh_token;
    });

    it('debería iniciar sesión con institution', async () => {
      const res = await request(app).post('/api/auth/login').send({
        identifier: institutionUsername,
        password: institutionPassword
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('refresh_token');
      institutionRefreshToken = res.body.refresh_token;
    });
  });

  describe('POST /api/auth/token/access-token', () => {
    it('debería generar un nuevo access token para person', async () => {
      const res = await request(app).post('/api/auth/token/access-token').send({
        refresh_token: personRefreshToken
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token');
    });

    it('debería generar un nuevo access token para institution', async () => {
      const res = await request(app).post('/api/auth/token/access-token').send({
        refresh_token: institutionRefreshToken
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('debería cerrar sesión de person', async () => {
      const login = await request(app).post('/api/auth/login').send({
        identifier: personEmail,
        password: personPassword
      });
      const accessToken = login.body.access_token;

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Logout successful');
    });
  });
});
