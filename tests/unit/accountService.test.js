import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import Account from '../../models/Account.js';

jest.unstable_mockModule('../../services/personService.js', () => ({
  deletePersonByAccountId: jest.fn(),
  updatePerson: jest.fn()
}));

jest.unstable_mockModule('../../services/institutionService.js', () => ({
  deleteInstitutionByAccountId: jest.fn()
}));

const accountService = await import('../../services/accountService.js');
const personService = await import('../../services/personService.js');
const institutionService = await import('../../services/institutionService.js');

Account.findOne = jest.fn();
Account.create = jest.fn();
Account.find = jest.fn();
Account.findById = jest.fn();
Account.findByIdAndUpdate = jest.fn();
Account.findByIdAndDelete = jest.fn();
bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');

describe('AccountService', () => {
  const mockId = 'mock-id-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear una nueva cuenta si no existe email o username duplicado', async () => {
    Account.findOne.mockResolvedValue(null);
    Account.create.mockResolvedValue({ _id: mockId, email: 'new@mail.com' });

    const result = await accountService.createAccount({
      username: 'newUser',
      email: 'new@mail.com',
      password: '12345678',
    });

    expect(Account.findOne).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(Account.create).toHaveBeenCalled();
    expect(result).toHaveProperty('_id', mockId);
  });

  it('debería lanzar error si ya existe email o username', async () => {
    Account.findOne.mockResolvedValue({ email: 'existing@mail.com' });

    await expect(accountService.createAccount({
      username: 'duplicateUser',
      email: 'existing@mail.com',
      password: '12345678',
    })).rejects.toThrow(/Email or username already in use/);
  });

  it('debería retornar todas las cuentas', async () => {
    Account.find.mockResolvedValue([{ email: 'a@mail.com' }, { email: 'b@mail.com' }]);
    const result = await accountService.getAllAccounts();
    expect(Array.isArray(result)).toBe(true);
    expect(Account.find).toHaveBeenCalled();
  });

  it('debería obtener cuenta por ID', async () => {
    Account.findById.mockResolvedValue({ _id: mockId, email: 'one@mail.com' });
    const result = await accountService.getAccountById(mockId);
    expect(result).toHaveProperty('_id', mockId);
  });

  it('debería lanzar error si no encuentra la cuenta por ID', async () => {
    Account.findById.mockResolvedValue(null);
    await expect(accountService.getAccountById('invalid')).rejects.toThrow(/Account not found/);
  });

  it('debería actualizar una cuenta existente', async () => {
    Account.findByIdAndUpdate.mockResolvedValue({ _id: mockId, username: 'updatedUser' });

    const result = await accountService.updateAccount(mockId, {
      username: 'updatedUser',
      password: 'newpass',
    });

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(result).toHaveProperty('username', 'updatedUser');
  });

  it('debería lanzar error si no se puede actualizar', async () => {
    Account.findByIdAndUpdate.mockResolvedValue(null);
    await expect(accountService.updateAccount('invalid', {})).rejects.toThrow(/Account not found/);
  });

  it('debería eliminar una cuenta y sus datos asociados', async () => {
    Account.findById.mockResolvedValue({ _id: mockId });
    Account.findByIdAndDelete.mockResolvedValue({});
    personService.deletePersonByAccountId.mockResolvedValue({});
    institutionService.deleteInstitutionByAccountId.mockResolvedValue({});

    const result = await accountService.deleteAccount(mockId);

    expect(Account.findById).toHaveBeenCalled();
    expect(personService.deletePersonByAccountId).toHaveBeenCalled();
    expect(institutionService.deleteInstitutionByAccountId).toHaveBeenCalled();
    expect(Account.findByIdAndDelete).toHaveBeenCalled();
    expect(result).toHaveProperty('message');
  });

  it('debería lanzar error al intentar eliminar una cuenta inexistente', async () => {
    Account.findById.mockResolvedValue(null);
    await expect(accountService.deleteAccount('invalid')).rejects.toThrow(/Account not found/);
  });
});
