const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/notifications?userId=123
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    try {
        const [notifications] = await pool.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/notifications (internal/demo)
router.post('/', async (req, res) => {
    const { userId, message } = req.body;
    if (!userId || !message) return res.status(400).json({ error: 'User ID and message required' });

    try {
        await pool.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [userId, message]);
        res.status(201).json({ success: true, message: 'Notification created' });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
