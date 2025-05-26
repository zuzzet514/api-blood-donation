import { becomeDonor } from '../services/personService.js';

export const requestDonorEligibility = async (req, res) => {
    try {
        const accountId = req.user?.id;
        if (!accountId) return res.status(401).json({ error: 'Unauthorized' });

        const result = await becomeDonor(accountId, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
