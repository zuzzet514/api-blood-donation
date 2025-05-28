import Account from '../models/Account.js';
import {deletePersonByAccountId, updatePerson} from "./personService.js";
import {deleteInstitutionByAccountId} from "./institutionService.js";
import bcrypt from 'bcryptjs';
import Person from "../models/Person.js";

const errorOrigin = '[From accountService]';

export const createAccount = async ({ username, email, password }) => {
    const existing = await Account.findOne({ $or: [{ email }, { username }] });
    if (existing) throw new Error(`${errorOrigin} Email or username already in use`);

    const hashedPassword = await bcrypt.hash(password, 10);
    const account = await Account.create({ username, email, password: hashedPassword });
    return account;
};

export const getAllAccounts = async () => {
    return Account.find();
};

export const getAccountById = async (accountId) => {
    const account = await Account.findById(accountId);
    if (!account) throw new Error(`${errorOrigin} Account not found`);
    return account;
};

export const updateAccount = async (accountId, data) => {
    const { username, email, password, ...personData } = data;
    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
        updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAccount = await Account.findByIdAndUpdate(accountId, updateData, { new: true });
    if (!updatedAccount) throw new Error(`${errorOrigin} Account not found`);

    if (Object.keys(personData).length > 0) {
        const person = await Person.findOne({ account_id: accountId });
        if (person) {
            await updatePerson(person._id, personData);
        }
    }

    return updatedAccount;
};


export const deleteAccount = async (accountId) => {
    const account = await Account.findById(accountId);
    if (!account) throw new Error(`${errorOrigin} Account not found`);

    // Remove linked Person or Institution
    await deletePersonByAccountId(accountId);
    await deleteInstitutionByAccountId(accountId);

    await Account.findByIdAndDelete(accountId);
    return { message: 'Account and linked data deleted successfully' };
};
