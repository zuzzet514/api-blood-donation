import { jest } from '@jest/globals';
import mongoose from 'mongoose';

const mockInstitutionModel = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  deleteOne: jest.fn()
};

jest.unstable_mockModule('../../models/Institution.js', () => ({
  __esModule: true,
  default: mockInstitutionModel
}));

const institutionService = await import('../../services/institutionService.js');

jest.setTimeout(15000); 

describe('InstitutionService', () => {
  const mockInstitutionId = new mongoose.Types.ObjectId();
  const mockAccountId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear una institución correctamente', async () => {
    mockInstitutionModel.create.mockResolvedValue({ _id: mockInstitutionId, name: 'Clinica Luz' });

    const result = await institutionService.createInstitution({
      account_id: mockAccountId,
      name: 'Clinica Luz',
      address: {
        street: 'Calle Uno',
        city: 'Ciudad',
        state: 'Estado',
        zip_code: '12345',
        country: 'MX'
      },
      phone: '1234567890',
      fax: '99999999',
      website: 'https://clinicadeluz.com'
    });

    expect(result).toHaveProperty('_id', mockInstitutionId);
    expect(mockInstitutionModel.create).toHaveBeenCalled();
  });

  it('debería obtener todas las instituciones con populate', async () => {
    const mockPopulate = jest.fn().mockResolvedValue([{ name: 'Inst 1' }, { name: 'Inst 2' }]);
    mockInstitutionModel.find.mockReturnValue({ populate: mockPopulate });

    const result = await institutionService.getAllInstitutions();

    expect(mockInstitutionModel.find).toHaveBeenCalled();
    expect(mockPopulate).toHaveBeenCalledWith('account_id', 'username email');
    expect(result).toEqual([{ name: 'Inst 1' }, { name: 'Inst 2' }]);
  });

  it('debería obtener una institución por ID', async () => {
    const mockPopulate = jest.fn().mockResolvedValue({ _id: mockInstitutionId });
    mockInstitutionModel.findById.mockReturnValue({ populate: mockPopulate });

    const result = await institutionService.getInstitutionById(mockInstitutionId);
    expect(mockPopulate).toHaveBeenCalledWith('account_id', 'username email');
    expect(result).toHaveProperty('_id', mockInstitutionId);
  });

  it('debería lanzar error si no encuentra la institución por ID', async () => {
    const mockPopulate = jest.fn().mockResolvedValue(null);
    mockInstitutionModel.findById.mockReturnValue({ populate: mockPopulate });

    await expect(institutionService.getInstitutionById(mockInstitutionId)).rejects.toThrow(/Institution not found/);
  });

  it('debería actualizar una institución', async () => {
    mockInstitutionModel.findByIdAndUpdate.mockResolvedValue({ _id: mockInstitutionId, name: 'Actualizada' });

    const result = await institutionService.updateInstitution(mockInstitutionId, { name: 'Actualizada' });

    expect(result).toHaveProperty('name', 'Actualizada');
    expect(mockInstitutionModel.findByIdAndUpdate).toHaveBeenCalled();
  });

  it('debería lanzar error si no se encuentra la institución al actualizar', async () => {
    mockInstitutionModel.findByIdAndUpdate.mockResolvedValue(null);

    await expect(institutionService.updateInstitution(mockInstitutionId, { name: 'Nada' }))
      .rejects.toThrow(/Institution not found/);
  });

  it('debería eliminar una institución', async () => {
    mockInstitutionModel.findByIdAndDelete.mockResolvedValue({ _id: mockInstitutionId });

    const result = await institutionService.deleteInstitution(mockInstitutionId);
    expect(result).toHaveProperty('message', 'Institution deleted successfully');
  });

  it('debería lanzar error si la institución a eliminar no existe', async () => {
    mockInstitutionModel.findByIdAndDelete.mockResolvedValue(null);

    await expect(institutionService.deleteInstitution(mockInstitutionId)).rejects.toThrow(/Institution not found/);
  });

  it('debería eliminar una institución por account_id', async () => {
    mockInstitutionModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await institutionService.deleteInstitutionByAccountId(mockAccountId);

    expect(mockInstitutionModel.deleteOne).toHaveBeenCalledWith({ account_id: mockAccountId });
  });
});
