import { jest } from '@jest/globals';
import Person from '../../models/Person.js';
import { becomeDonor } from '../../services/personService.js';

Person.findOne = jest.fn();

describe('PersonService - becomeDonor', () => {
  const mockAccountId = 'account123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería marcar como elegible a un donador válido', async () => {
    const mockPerson = { _id: 'person1', save: jest.fn() };
    Person.findOne.mockResolvedValue(mockPerson);

    const now = new Date();
    const result = await becomeDonor(mockAccountId, {
      last_surgery_date: new Date(now.setMonth(now.getMonth() - 7)),
      last_tattoo_or_piercing_date: new Date(now.setFullYear(now.getFullYear() - 2)),
      is_pregnant: false,
      has_heart_disease: false,
      has_disqualifying_conditions: false
    });

    expect(result).toHaveProperty('donor_info');
    expect(result.donor_info.is_eligible).toBe(true);
  });

  it('debería rechazar si el usuario tiene condiciones descalificantes', async () => {
    const mockPerson = { _id: 'person1', save: jest.fn() };
    Person.findOne.mockResolvedValue(mockPerson);

    const result = await becomeDonor(mockAccountId, {
      last_surgery_date: new Date(),
      last_tattoo_or_piercing_date: new Date(),
      is_pregnant: false,
      has_heart_disease: true,
      has_disqualifying_conditions: true
    });

    expect(result).toHaveProperty('message', 'Not eligible to become a donor.');
    expect(result).toHaveProperty('reasons');
    expect(Array.isArray(result.reasons)).toBe(true);
  });

  it('debería lanzar error si no se encuentra la persona', async () => {
    Person.findOne.mockResolvedValue(null);
    await expect(becomeDonor(mockAccountId, {})).rejects.toThrow(/Person not found/);
  });
});
