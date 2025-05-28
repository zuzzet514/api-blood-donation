import { jest } from '@jest/globals';
import * as authService from '../../services/authService.js';
import Account from '../../models/Account.js';
import Person from '../../models/Person.js';
import Institution from '../../models/Institution.js';
import Session from '../../models/Session.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

Account.findOne = jest.fn();
Account.create = jest.fn();
Person.create = jest.fn();
Institution.create = jest.fn();
Session.deleteMany = jest.fn();
Session.create = jest.fn();
Session.findOneAndDelete = jest.fn();

bcrypt.compare = jest.fn();
jwt.sign = jest.fn();

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerAccount', () => {
    it('debería registrar correctamente una cuenta tipo person', async () => {
      Account.findOne.mockResolvedValue(null);
      Account.create.mockResolvedValue({ _id: 'mock-id', email: 'test@mail.com' });
      Person.create.mockResolvedValue({ _id: 'person-id' });

      const result = await authService.registerAccount({
        username: "testuser",
        email: "unit@mail.com",
        password: "12345678",
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
      });

      expect(result).toHaveProperty('message', 'Account and profile created successfully');
    });

    it('debería registrar correctamente una cuenta tipo institution', async () => {
      Account.findOne.mockResolvedValue(null);
      Account.create.mockResolvedValue({ _id: 'mock-id', email: 'institution@mail.com' });
      Institution.create.mockResolvedValue({ _id: 'institution-id' });

      const result = await authService.registerAccount({
        username: "instuser",
        email: "institution@mail.com",
        password: "12345678",
        type: "institution",
        institutionData: {
          name: "Cruz Roja",
          phone: "9999999999",
          address: {
            street: "Av. Central",
            city: "Coatzacoalcos",
            state: "Veracruz",
            zip_code: "96400",
            country: "México"
          }
        }
      });

      expect(result).toHaveProperty('message', 'Account and profile created successfully');
    });

    it('debería lanzar error si el correo ya existe', async () => {
      Account.findOne.mockResolvedValue({ email: "duplicate_test@mail.com" });

      await expect(authService.registerAccount({
        username: "dupuser2",
        email: "duplicate_test@mail.com",
        password: "87654321",
        type: "person",
        personData: {}
      })).rejects.toThrow(/Email already in use/);
    });
  });

  describe('loginAccount', () => {
    it('debería iniciar sesión correctamente con credenciales válidas', async () => {
      const mockAccount = { _id: 'mock-id', email: 'user@mail.com', password: 'hashed', username: 'user' };
      Account.findOne.mockResolvedValue(mockAccount);
      bcrypt.compare.mockResolvedValue(true);
      Session.deleteMany.mockResolvedValue();
      Session.create.mockResolvedValue({ _id: 'session-id' });
      jwt.sign.mockReturnValue('mock_token');

      const result = await authService.loginAccount({
        identifier: 'user@mail.com',
        password: '123456'
      });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('message', 'Login successful');
    });

    it('debería lanzar error si el correo no está registrado', async () => {
      Account.findOne.mockResolvedValue(null);

      await expect(authService.loginAccount({
        identifier: 'missing@mail.com',
        password: '123456'
      })).rejects.toThrow(/Account not found/);
    });

    it('debería lanzar error si la contraseña es incorrecta', async () => {
      Account.findOne.mockResolvedValue({ _id: 'mock-id', password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.loginAccount({
        identifier: 'user@mail.com',
        password: 'wrongpass'
      })).rejects.toThrow(/Incorrect password/);
    });
  });

  describe('logoutAccount', () => {
    it('debería cerrar sesión correctamente', async () => {
      Session.findOneAndDelete.mockResolvedValue({ _id: 'session-id' });

      const result = await authService.logoutAccount('mock-id');

      expect(result).toHaveProperty('message', 'Logout successful');
    });

    it('debería lanzar error si no existe la sesión al cerrar sesión', async () => {
      Session.findOneAndDelete.mockResolvedValue(null);

      await expect(authService.logoutAccount('invalid-id'))
        .rejects.toThrow(/Logout Session not found/);
    });
  });
});
