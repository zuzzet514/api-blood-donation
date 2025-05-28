import { jest } from '@jest/globals';
import * as bloodService from '../../services/bloodRequestService.js';
import BloodRequest from '../../models/BloodRequest.js';
import Application from '../../models/Application.js';

BloodRequest.create = jest.fn();
BloodRequest.find = jest.fn();
BloodRequest.findById = jest.fn();
BloodRequest.findByIdAndUpdate = jest.fn();
BloodRequest.findByIdAndDelete = jest.fn();

Application.findOne = jest.fn();

describe('BloodRequestService', () => {
  const mockId = 'req123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear una solicitud de sangre', async () => {
    BloodRequest.create.mockResolvedValue({
      _id: mockId,
      bloodType: 'O+',
      urgency: 'high',
      status: 'open'
    });

    const result = await bloodService.createBloodRequest({
      requester: 'person-id',
      requesterModel: "Person",
      bloodType: "O+",
      medicalCondition: "Anemia severa",
      urgency: "high",
      amountRequiredML: 500,
      deadline: new Date(),
      description: "Urgente"
    });

    expect(result).toHaveProperty('_id', mockId);
    expect(result).toHaveProperty('urgency', 'high');
  });

  it('debería obtener todas las solicitudes de un usuario', async () => {
    BloodRequest.find.mockResolvedValue([
      { _id: '1', requester: 'x', urgency: 'high' },
      { _id: '2', requester: 'x', urgency: 'medium' }
    ]);

    const result = await bloodService.getAllBloodRequests('x', 'Person');
    expect(result).toHaveLength(2);
  });

  it('debería obtener una solicitud por ID e incluir applicants', async () => {
    BloodRequest.findById.mockResolvedValue({ _id: mockId, toObject: () => ({ _id: mockId }) });
    Application.findOne.mockResolvedValue({ applicants: ['a1', 'a2'] });

    const result = await bloodService.getBloodRequestById(mockId);
    expect(result).toHaveProperty('applicants');
    expect(result.applicants).toEqual(['a1', 'a2']);
  });

  it('debería lanzar error si la solicitud no existe', async () => {
    BloodRequest.findById.mockResolvedValue(null);

    await expect(bloodService.getBloodRequestById('not-found'))
      .rejects.toThrow(/Request not found/);
  });

  it('debería actualizar una solicitud', async () => {
    BloodRequest.findByIdAndUpdate.mockResolvedValue({ _id: mockId, urgency: 'medium' });

    const updated = await bloodService.updateBloodRequest(mockId, { urgency: 'medium' });
    expect(updated).toHaveProperty('urgency', 'medium');
  });

  it('debería lanzar error si no se puede actualizar', async () => {
    BloodRequest.findByIdAndUpdate.mockResolvedValue(null);

    await expect(bloodService.updateBloodRequest('invalid', {}))
      .rejects.toThrow(/Request not found/);
  });

  it('debería eliminar la solicitud', async () => {
    BloodRequest.findByIdAndDelete.mockResolvedValue({ _id: mockId });

    const result = await bloodService.deleteBloodRequest(mockId);
    expect(result).toHaveProperty('message', 'Blood request deleted successfully');
  });

  it('debería lanzar error si no existe la solicitud al eliminar', async () => {
    BloodRequest.findByIdAndDelete.mockResolvedValue(null);

    await expect(bloodService.deleteBloodRequest('bad-id'))
      .rejects.toThrow(/Request not found/);
  });

  it('debería buscar solicitudes filtradas por tipo de sangre y urgencia', async () => {
    BloodRequest.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        {
          requester: { address: { state: 'Veracruz' } },
          bloodType: 'O+',
          urgency: 'high'
        },
        {
          requester: { address: { state: 'CDMX' } },
          bloodType: 'O+',
          urgency: 'high'
        }
      ])
    });

    const result = await bloodService.searchBloodRequests({
      bloodType: 'O+',
      urgency: 'high',
      state: 'Veracruz'
    });

    expect(result.length).toBe(1);
    expect(result[0].requester.address.state).toBe('Veracruz');
  });

});
