const express = require('express');
const router = express.Router();

// GET /api/stats
router.get('/', async (req, res) => {
    try {
        const pool = require('../config/db');

        const [donorResult] = await pool.query('SELECT COUNT(*) AS count FROM users WHERE role = ?', ['donor']);
        const [requestResult] = await pool.query('SELECT COUNT(*) AS count FROM blood_requests');
        const [fulfilledResult] = await pool.query('SELECT COUNT(DISTINCT request_id) AS count FROM donations');
        const [unitsResult] = await pool.query('SELECT COUNT(*) AS count FROM donations WHERE status = ?', ['completed']);

        const donors = donorResult[0].count;
        const requests = requestResult[0].count;
        const fulfilled = fulfilledResult[0].count;
        const units = unitsResult[0].count;

        const livesSaved = fulfilled * 3; // Typically 1 donation saves 3 lives

        res.json({
            donors,
            requests,
            fulfilled,
            livesSaved: livesSaved > 0 ? livesSaved : 0,
            units
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
