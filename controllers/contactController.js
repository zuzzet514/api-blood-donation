import Person from '../models/Person.js';
import Institution from '../models/Institution.js';

export const getContactLink = async (req, res) => {
    try {
        const { targetId, targetType } = req.query;

        if (!targetId || !targetType) {
            return res.status(400).json({ error: 'Missing targetId or targetType' });
        }

        let target;
        if (targetType === 'person') {
            target = await Person.findById(targetId);
        } else if (targetType === 'institution') {
            target = await Institution.findById(targetId);
        } else {
            return res.status(400).json({ error: 'Invalid targetType' });
        }

        if (!target) {
            return res.status(404).json({ error: 'Target not found' });
        }

        const rawPhone = target.phone.replace(/\D/g, '');
        const link = `https://wa.me/${rawPhone}?hy3${target.address.zip_code}`;

        res.status(200).json({ link });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
