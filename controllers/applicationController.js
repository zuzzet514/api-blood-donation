import { applyToBloodRequest } from '../services/applicationService.js';

export const apply = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const accountId = req.user?.id;

        if (!accountId) return res.status(401).json({ error: 'Unauthorized' });

        const result = await applyToBloodRequest(requestId, accountId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
