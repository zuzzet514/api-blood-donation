import BloodRequest from '../models/BloodRequest.js';

const errorOrigin = '[From bloodRequestService]';

export const createBloodRequest = async (data) => {
    const {
        requester,
        requesterModel,
        bloodType,
        medicalCondition,
        urgency,
        amountRequiredML,
        deadline,
        description
    } = data;

    return await BloodRequest.create({
        requester,
        requesterModel,
        bloodType,
        medicalCondition,
        urgency,
        amountRequiredML,
        deadline,
        description
    });
};

export const getAllBloodRequests = async (requesterId, modelName) => {
    return BloodRequest.find({
        requester: requesterId,
        requesterModel: modelName
    });
};

export const getBloodRequestById = async (requestId) => {
    const request = await BloodRequest.findById(requestId);
    if (!request) throw new Error(`${errorOrigin} Request not found`);
    return request;
};

export const updateBloodRequest = async (requestId, data) => {
    const updated = await BloodRequest.findByIdAndUpdate(requestId, data);
    if (!updated) throw new Error(`${errorOrigin} Request not found`);
    return updated;
};

export const deleteBloodRequest = async (requestId) => {
    const deleted = await BloodRequest.findByIdAndDelete(requestId);
    if (!deleted) throw new Error(`${errorOrigin} Request not found`);
    return { message: 'Blood request deleted successfully' };
};
