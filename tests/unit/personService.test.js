import { jest } from '@jest/globals';
import Person from '../../models/Person.js';
import {
  becomeDonor,
  getEligibleDonors
} from '../../services/personService.js';

Person.findOne = jest.fn();
Person.find = jest.fn();

describe('PersonService - becomeDonor', () => {
  const mockAccountId = 'account123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería marcar como elegible a un donador válido', async () => {
    const mockPerson = { _id: 'person1', save: jest.fn(), age: 30, sex: 'M' };
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
    const mockPerson = { _id: 'person1', save: jest.fn(), age: 40, sex: 'M' };
    Person.findOne.mockResolvedValue(mockPerson);

    const result = await becomeDonor(mockAccountId, {
      last_surgery_date: new Date(),
      last_tattoo_or_piercing_date: new Date(),
      is_pregnant: false,
      has_heart_disease: true,
      has_disqualifying_conditions: true
    });

    expect(result).toHaveProperty('message', 'Not eligible to become a donor.');
    expect(Array.isArray(result.reasons)).toBe(true);
  });

  it('debería lanzar error si no se encuentra la persona', async () => {
    Person.findOne.mockResolvedValue(null);
    await expect(becomeDonor(mockAccountId, {})).rejects.toThrow(/Person not found/);
  });
});

  describe('PersonService - getEligibleDonors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar todos los donadores elegibles sin filtros', async () => {
    const mockDonors = [
      { name: 'Ana', donor_info: { is_eligible: true } },
      { name: 'Carlos', donor_info: { is_eligible: true } }
    ];

    Person.find.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockDonors)
    });

    const result = await getEligibleDonors();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
  });

  it('debería aplicar correctamente los filtros: blood_type, state y edad', async () => {
    Person.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([
        { name: 'Donador1', blood_type: 'O+', address: { state: 'Veracruz' }, age: 30 }
      ])
    });

    const filters = {
      blood_type: 'O+',
      state: 'Veracruz',
      min_age: 25,
      max_age: 35
    };

    const result = await getEligibleDonors(filters);

    expect(Array.isArray(result)).toBe(true);
    expect(Person.find).toHaveBeenCalledWith({
      "donor_info.is_eligible": true,
      blood_type: 'O+',
      "address.state": 'Veracruz',
      age: { $gte: 25, $lte: 35 }
    });
  });

  it('debería incluir filtro de ciudad si se proporciona', async () => {
    Person.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([
        { name: 'Donador2', address: { city: 'Monterrey' } }
      ])
    });

    const filters = {
      city: 'Monterrey'
    };

    const result = await getEligibleDonors(filters);

    expect(Person.find).toHaveBeenCalledWith(expect.objectContaining({
      "address.city": 'Monterrey'
    }));
  });
});
