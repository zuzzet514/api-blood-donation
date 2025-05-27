import {
    createBloodRequest,
    getAllBloodRequests,
    getBloodRequestById,
    updateBloodRequest,
    deleteBloodRequest, searchBloodRequests
} from '../services/bloodRequestService.js';
import Person from '../models/Person.js';
import Institution from '../models/Institution.js';


const errorOrigin = "[From bloodRequestController]"

export const createRequest = async (req, res) => {
    try {
        const accountId = req.user.id;
        if (!accountId) {
            return res.status(401).json({ error: `${errorOrigin} Unauthorized: missing account ID` });
        }

        let requesterModel = 'Person';
        let requester = await Person.findOne({ account_id: accountId });

        if (!requester) {
            requesterModel = 'Institution';
            requester = await Institution.findOne({ account_id: accountId });
        }

        if (!requester) {
            return res.status(404).json({ error: `${errorOrigin} No profile found for this account` });
        }

        const requestData = {
            ...req.body,
            requester: requester._id,
            requesterModel
        };

        const result = await createBloodRequest(requestData);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllRequests = async (req, res) => {
    try {
        const accountId = req.user?.id;
        if (!accountId) return res.status(401).json({ error: `${errorOrigin} Unauthorized` });

        let profile = await Person.findOne({ account_id: accountId });
        let model = 'Person';

        if (!profile) {
            profile = await Institution.findOne({ account_id: accountId });
            model = 'Institution';
        }

        if (!profile) return res.status(404).json({ error: `${errorOrigin} No associated profile found` });

        const requests = await getAllBloodRequests(profile._id, model);
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRequestById = async (req, res) => {
    try {
        const result = await getBloodRequestById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const updateRequest = async (req, res) => {
    try {
        const result = await updateBloodRequest(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteRequest = async (req, res) => {
    try {
        const result = await deleteBloodRequest(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};


export const searchRequests = async (req, res) => {
    try {
        const filters = {
            blood_type: req.query.bloodType,
            urgency: req.query.urgency,
            state: req.query.state
        };

        const results = await searchBloodRequests(filters);
        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};