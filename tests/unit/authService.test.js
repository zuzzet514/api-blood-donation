import { jest } from '@jest/globals';
import * as authService from '../../services/authService.js';
import Account from '../../models/Account.js';
import Person from '../../models/Person.js';

Account.findOne = jest.fn();
Account.create = jest.fn();
Person.create = jest.fn();

describe('AuthService - registerAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería registrar correctamente una cuenta tipo person', async () => {
    Account.findOne.mockResolvedValue(null);
    Account.create.mockResolvedValue({ id: 'mock-id', email: 'test@mail.com' });
    Person.create.mockResolvedValue({ id: 'person-id' });

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
