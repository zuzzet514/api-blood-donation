import Application from '../models/Application.js';
import BloodRequest from '../models/BloodRequest.js';
import Person from '../models/Person.js';

const errorOrigin = '[ApplicationService]';

export const applyToBloodRequest = async (requestId, accountId) => {
    const person = await Person.findOne({ account_id: accountId });

    if (!person) throw new Error(`${errorOrigin} Person not found`);
    if (!person.donor_info?.is_eligible) {
        throw new Error(`${errorOrigin} Person is not an eligible donor`);
    }

    const request = await BloodRequest.findById(requestId);
    if (!request) throw new Error(`${errorOrigin} Blood request not found`);

    if (request.bloodType !== person.blood_type) {
        throw new Error(`${errorOrigin} Donor blood type does not match request`);
    }

    const application = await Application.findOneAndUpdate(
        { request_id: requestId },
        { $addToSet: { applicants: person._id } }, // avoid duplicates
        { new: true, upsert: true }
    );

    return { message: 'Applied successfully', application };
};
