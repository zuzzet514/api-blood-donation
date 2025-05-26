import Institution from '../models/Institution.js';

const errorOrigin = '[From institutionService]';

export const createInstitution = async (data) => {
    const { account_id, name, address, phone, fax, website } = data;

    const institution = await Institution.create({
        account_id,
        name,
        address,
        phone,
        fax,
        website
    });

    return institution;
};

export const getAllInstitutions = async () => {
    return Institution.find().populate('account_id', 'username email');
};

export const getInstitutionById = async (institutionId) => {
    const institution = await Institution.findById(institutionId).populate('account_id', 'username email');
    if (!institution) throw new Error(`${errorOrigin} Institution not found`);
    return institution;
};

export const updateInstitution = async (institutionId, data) => {
    const updated = await Institution.findByIdAndUpdate(institutionId, data);
    if (!updated) throw new Error(`${errorOrigin} Institution not found`);
    return updated;
};

export const deleteInstitution = async (institutionId) => {
    const deleted = await Institution.findByIdAndDelete(institutionId);
    if (!deleted) throw new Error(`${errorOrigin} Institution not found`);
    return { message: 'Institution deleted successfully' };
};

export const deleteInstitutionByAccountId = async  (accountId) => {
    await Institution.deleteOne({ account_id: accountId });
};