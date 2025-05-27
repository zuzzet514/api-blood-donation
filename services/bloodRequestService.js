import BloodRequest from '../models/BloodRequest.js';
import Application from '../models/Application.js';

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

    const application = await Application.findOne({ request_id: requestId });

    return {
        ...request.toObject(),
        applicants: application?.applicants || []
    } ;
};

export const updateBloodRequest = async (requestId, data) => {
    await BloodRequest.findByIdAndUpdate(requestId, data);
    const updated = await BloodRequest.findById(requestId);
    if (!updated) throw new Error(`${errorOrigin} Request not found`);
    return updated;
};

export const deleteBloodRequest = async (requestId) => {
    const deleted = await BloodRequest.findByIdAndDelete(requestId);
    if (!deleted) throw new Error(`${errorOrigin} Request not found`);
    return { message: 'Blood request deleted successfully' };
};

export const searchBloodRequests = async ({ bloodType, urgency, state }) => {
    const query = {};

    if (bloodType) query.bloodType = bloodType;
    if (urgency) query.urgency = urgency;

    const requests = await BloodRequest.find(query).populate({
        path: 'requester',
        select: 'address'
    });

    if (state) {
        return requests.filter(req => req.requester?.address?.state === state);
    }

    return requests;
};
