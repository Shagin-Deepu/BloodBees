const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /api/users/donors - Fetch all donors
router.get('/donors', async (req, res) => {
    try {
        const [donors] = await pool.query('SELECT id, name, email, blood_group, location, phone, status_note, is_online, created_at, is_profile_visible, last_donation_date FROM users WHERE role = "donor" AND is_profile_visible = 1');
        res.json(donors);
    } catch (error) {
        console.error('Error fetching donors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/users/:id/profile
router.get('/:id/profile', async (req, res) => {
    const userId = req.params.id;

    try {
        // 1. Fetch User
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        const user = users[0];

        // 2. Stats
        const [donationsResult] = await pool.query('SELECT COUNT(*) as count FROM donations WHERE donor_id = ? AND status = "completed"', [userId]);
        const donationsCount = donationsResult[0].count;
        const livesSaved = donationsCount * 3;

        const [pendingResult] = await pool.query('SELECT COUNT(*) as count FROM blood_requests WHERE requester_id = ? AND status = "pending"', [userId]);
        const pendingRequestsCount = pendingResult[0].count;

        // 3. Donation History (with hospital/location from blood_requests via JOIN)
        const [historyRows] = await pool.query(`
            SELECT d.id, d.donation_date, r.hospital_name, r.location, r.blood_group, d.status 
            FROM donations d
            JOIN blood_requests r ON d.request_id = r.id
            WHERE d.donor_id = ?
            ORDER BY d.donation_date DESC LIMIT 5
        `, [userId]);

        const history = historyRows.map(d => ({
            id: d.id,
            donation_date: d.donation_date,
            hospital_name: d.hospital_name || 'Unknown',
            location: d.location || 'Unknown',
            blood_group: d.blood_group || 'Unknown',
            status: d.status
        }));

        res.json({
            user: {
                ...user,
                joinDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            },
            stats: {
                totalDonations: donationsCount,
                livesSaved,
                pendingRequests: pendingRequestsCount
            },
            history
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PATCH /api/users/:id/status - Update status note and online status
router.patch('/:id/status', async (req, res) => {
    const userId = req.params.id;
    const { status_note, is_online, is_profile_visible } = req.body;
    try {
        if (is_profile_visible !== undefined) {
            await pool.query('UPDATE users SET status_note = ?, is_online = ?, is_profile_visible = ? WHERE id = ?', [status_note, is_online, is_profile_visible, userId]);
            console.log(`[Visibility Log] User ${userId} changed profile visibility to: ${is_profile_visible ? 'Visible' : 'Hidden'}`);
        } else {
            await pool.query('UPDATE users SET status_note = ?, is_online = ? WHERE id = ?', [status_note, is_online, userId]);
        }
        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /api/users/:id - Delete account
router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- NEW PROFILE EDIT ENDPOINTS ---

// PUT /api/users/:id/profile - Update basic info
router.put('/:id/profile', async (req, res) => {
    const userId = req.params.id;
    const { phone, location, blood_group } = req.body;
    try {
        await pool.query(
            'UPDATE users SET phone = ?, location = ?, blood_group = ? WHERE id = ?',
            [phone, location, blood_group, userId]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/users/:id/password - Change password
router.put('/:id/password', async (req, res) => {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;
    try {
        const [users] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });

        const user = users[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });

        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/users/:id/avatar - Update profile picture
router.put('/:id/avatar', async (req, res) => {
    const userId = req.params.id;
    const { profile_picture } = req.body;
    try {
        await pool.query('UPDATE users SET profile_picture = ? WHERE id = ?', [profile_picture, userId]);
        res.json({ message: 'Profile picture updated successfully' });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
