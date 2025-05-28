import {deleteAccount, updateAccount, getAccountById} from "../services/accountService.js";
import Person from "../models/Person.js";
import Institution from "../models/Institution.js";

export const updateAccountController = async (req, res) => {
    const accountId = req.user.id;
    const data = req.body;

    try {
        const updatedAccount = await updateAccount(accountId, data);
        return res.status(200).json({
            message: 'Account and personal data updated successfully',
            account: updatedAccount
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const getAccountController = async (req, res) => {
    const accountId = req.user.id;

    try {
        const account = await getAccountById(accountId);
        const accountObject = account.toObject();
        delete accountObject.password;

        const person = await Person.findOne({ account_id: accountId });
        const institution = await Institution.findOne({ account_id: accountId });

        return res.status(200).json({
            account: accountObject,
            personalData: person || institution || null
        });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
};

export const deleteAccountController = async (req, res) => {
    const accountId = req.user.id;

    try {
        const result = await deleteAccount(accountId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
