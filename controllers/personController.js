import { becomeDonor, getEligibleDonors } from '../services/personService.js';
import Person from "../models/Person.js";
import Institution from "../models/Institution.js";

const errorOrigin = "[From personController]";

export const requestDonorEligibility = async (req, res) => {
    try {
        const accountId = req.user?.id;
        if (!accountId) return res.status(401).json({ error: `${errorOrigin} Unauthorized` });

        const result = await becomeDonor(accountId, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const searchEligibleDonors = async (req, res) => {
    try {
        const filters = {
            blood_type: req.query.blood_type,
            state: req.query.state,
            city: req.query.city,
            min_age: req.query.min_age,
            max_age: req.query.max_age
        };

        const donors = await getEligibleDonors(filters);
        res.status(200).json(donors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};