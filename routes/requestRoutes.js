const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/requests - Create a new blood request
router.post('/', async (req, res) => {
    const { requester_id, patient_name, blood_group, urgency, location, hospital_name,
        note, date_of_requirement, bystander_name, bystander_contact } = req.body;

    if (!requester_id || !patient_name || !blood_group || !location || !hospital_name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const [result] = await pool.query(`
            INSERT INTO blood_requests 
            (requester_id, patient_name, blood_group, urgency, location, hospital_name, date_of_requirement, bystander_name, bystander_contact, note, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `, [requester_id, patient_name, blood_group, urgency || 'medium', location, hospital_name, date_of_requirement, bystander_name, bystander_contact, note]);

        // Notify matching donors
        const [donors] = await pool.query('SELECT id FROM users WHERE role = "donor" AND blood_group = ?', [blood_group]);
        if (donors.length > 0) {
            const values = donors.map(donor => [donor.id, `Urgent: ${blood_group} blood needed at ${hospital_name} (${location}). Urgency: ${urgency}`]);
            await pool.query('INSERT INTO notifications (user_id, message) VALUES ?', [values]);
        }

        res.status(201).json({ success: true, message: 'Request created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating blood request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/requests - List blood requests with optional filters
router.get('/', async (req, res) => {
    const { blood_group, location, urgency } = req.query;

    let query = `
        SELECT r.*, d.status as donation_status, d.donation_date 
        FROM blood_requests r
        LEFT JOIN donations d ON r.id = d.request_id 
        WHERE r.status = "pending"
    `;
    const params = [];

    if (blood_group) {
        query += ' AND r.blood_group = ?';
        params.push(blood_group);
    }
    if (urgency) {
        query += ' AND r.urgency = ?';
        params.push(urgency);
    }
    if (location) {
        query += ' AND r.location LIKE ?';
        params.push(`%${location}%`);
    }

    try {
        const [requests] = await pool.query(query, params);
        res.json(requests);
    } catch (error) {
        console.error('Error fetching blood requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
