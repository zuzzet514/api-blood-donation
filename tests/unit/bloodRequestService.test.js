import { jest } from '@jest/globals';
import * as bloodService from '../../services/bloodRequestService.js';
import BloodRequest from '../../models/BloodRequest.js';

BloodRequest.create = jest.fn();
BloodRequest.findById = jest.fn();
BloodRequest.findByIdAndUpdate = jest.fn();
BloodRequest.findByIdAndDelete = jest.fn();

describe('BloodRequestService', () => {
  const mockId = 'req123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear una solicitud de sangre', async () => {
    BloodRequest.create.mockResolvedValue({ _id: mockId, bloodType: 'O+', urgency: 'high' });

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

  it('debería obtener la solicitud por ID', async () => {
    BloodRequest.findById.mockResolvedValue({ _id: mockId });
    const found = await bloodService.getBloodRequestById(mockId);
    expect(found).toHaveProperty('_id');
  });

  it('debería actualizar la solicitud', async () => {
    BloodRequest.findByIdAndUpdate.mockResolvedValue({ _id: mockId, urgency: 'medium' });
    const updated = await bloodService.updateBloodRequest(mockId, { urgency: 'medium' });
    expect(updated.urgency).toBe('medium');
  });

  it('debería eliminar la solicitud', async () => {
    BloodRequest.findByIdAndDelete.mockResolvedValue({ _id: mockId });
    const deleted = await bloodService.deleteBloodRequest(mockId);
    expect(deleted).toHaveProperty('message');
  });
});
