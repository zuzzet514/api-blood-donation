import Person from '../models/Person.js';
import account from "../models/Account.js";

const errorOrigin = '[From personService]';

export const createPerson = async (data) => {
    const { account_id, name, last_name, age, sex, address, phone, blood_type } = data;

    const person = await Person.create({
        account_id,
        name,
        last_name,
        age,
        sex,
        address,
        phone,
        blood_type
    });

    return person;
};

export const getAllPeople = async () => {
    return Person.find().populate('account_id', 'username email');
};

export const getPersonById = async (personId) => {
    const person = await Person.findById(personId).populate('account_id', 'username email');
    if (!person) throw new Error(`${errorOrigin} Person not found`);
    return person;
};

export const updatePerson = async (personId, data) => {
    const updated = await Person.findByIdAndUpdate(personId, data);
    if (!updated) throw new Error(`${errorOrigin} Person not found`);
    return updated;
};

export const deletePerson = async (personId) => {
    const deleted = await Person.findByIdAndDelete(personId);
    if (!deleted) throw new Error(`${errorOrigin} Person not found`);
    return { message: 'Person deleted successfully' };
};

export const deletePersonByAccountId = async (accountId) => {
    await Person.deleteOne({ account_id: accountId });
};

export const becomeDonor = async (accountId, {
    last_surgery_date,
    last_tattoo_or_piercing_date,
    is_pregnant,
    has_heart_disease,
    has_disqualifying_conditions
}) => {
    const person = await Person.findOne({ account_id: accountId });
    if (!person) throw new Error(`${errorOrigin} Person not found`);

    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    let isEligible = true;
    const reasons = [];

    if (person.age < 18 || person.age > 65) {
        isEligible = false;
        reasons.push('Age must be between 18 and 65.');
    }

    if (new Date(last_surgery_date) > sixMonthsAgo) {
        isEligible = false;
        reasons.push('At least 6 months must have passed since last surgery.');
    }

    if (person.sex === 'F' && is_pregnant === true) {
        isEligible = false;
        reasons.push('Currently pregnant.');
    }

    if (new Date(last_tattoo_or_piercing_date) > oneYearAgo) {
        isEligible = false;
        reasons.push('At least 1 year must have passed since last tattoo/piercing/acupuncture.');
    }

    if (has_disqualifying_conditions) {
        isEligible = false;
        reasons.push('Has disqualifying medical conditions.');
    }

    if (has_heart_disease) {
        isEligible = false;
        reasons.push('Has serious heart disease.');
    }

    if (!isEligible) {
        return {
            message: 'Not eligible to become a donor.',
            reasons
        };
    }

    person.donor_info = {
        last_surgery_date,
        last_tattoo_or_piercing_date,
        is_pregnant,
        has_heart_disease,
        has_disqualifying_conditions,
        is_eligible: true
    };

    await person.save();

    return {
        message: 'Donor info saved successfully. You are now eligible to donate.',
        donor_info: person.donor_info
    };
}

