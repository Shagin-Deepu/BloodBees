const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/donations - Pledge to donate
router.post('/', async (req, res) => {
    const { donor_id, request_id } = req.body;

    if (!donor_id || !request_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Validation: donor blood group must match request blood group
        const [donors] = await pool.query('SELECT blood_group, name, phone FROM users WHERE id = ?', [donor_id]);
        if (donors.length === 0) return res.status(404).json({ error: 'Donor not found' });
        const donor = donors[0];

        const [requests] = await pool.query('SELECT requester_id, hospital_name, blood_group, urgency FROM blood_requests WHERE id = ?', [request_id]);
        if (requests.length === 0) return res.status(404).json({ error: 'Request not found' });
        const request = requests[0];

        if (donor.blood_group !== request.blood_group) {
            return res.status(400).json({ error: 'Blood group mismatch.' });
        }

        // Check for duplicate pledge
        const [existing] = await pool.query('SELECT id FROM donations WHERE donor_id = ? AND request_id = ?', [donor_id, request_id]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'You have already pledged for this request.' });
        }

        // Create donation
        await pool.query('INSERT INTO donations (donor_id, request_id, status) VALUES (?, ?, "scheduled")', [donor_id, request_id]);

        // Timer Logic Logging
        const timerHours = request.urgency === 'critical' ? 2 : 24;
        console.log(`[Timer Event] Fulfillment Timer started for Donor ${donor_id} on Request ${request_id}. Urgency: ${request.urgency.toUpperCase()}. Window: ${timerHours} hours.`);

        // Notify requester
        const message = `${donor.name} has pledged to donate for your request at ${request.hospital_name}. Contact: ${donor.phone}`;
        await pool.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [request.requester_id, message]);

        res.status(201).json({ success: true, message: 'Donation pledged successfully!' });

    } catch (error) {
        console.error('Error creating donation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// PATCH /api/donations/:id/complete - Mark donation as completed (Legacy/fallback if no proof req, though we will override via upload-proof)
router.patch('/:id/complete', async (req, res) => {
    const donationId = req.params.id;

    try {
        const [donations] = await pool.query('SELECT donor_id, status FROM donations WHERE id = ?', [donationId]);
        if (donations.length === 0) return res.status(404).json({ error: 'Donation not found' });

        const donation = donations[0];
        if (donation.status === 'completed') {
            return res.status(400).json({ error: 'Donation is already completed' });
        }

        // Update donation status
        await pool.query('UPDATE donations SET status = "completed" WHERE id = ?', [donationId]);

        // Update donor's last_donation_date (for 3-month cool-off)
        await pool.query('UPDATE users SET last_donation_date = CURRENT_TIMESTAMP WHERE id = ?', [donation.donor_id]);
        console.log(`[Timer Event] Cool-off Timer started (90-days) for Donor ${donation.donor_id}.`);

        res.json({ success: true, message: 'Donation marked as completed and cool-off timer started.' });
    } catch (error) {
        console.error('Error completing donation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/donations/:id/upload-proof - Upload physical proof to complete donation
router.post('/:id/upload-proof', upload.single('certificate'), async (req, res) => {
    const donationId = req.params.id;

    if (!req.file) {
        return res.status(400).json({ error: 'No certificate file or image provided.' });
    }

    try {
        // Validation
        const [donations] = await pool.query('SELECT donor_id, request_id, status FROM donations WHERE id = ?', [donationId]);
        if (donations.length === 0) return res.status(404).json({ error: 'Donation not found' });

        const donation = donations[0];
        if (donation.status === 'completed') {
            return res.status(400).json({ error: 'Donation is already completed.' });
        }

        // Note: Using 'received' as the intermediate check could be implemented here, but typically we just allow the transition if they have proof.
        const filePath = `/uploads/${req.file.filename}`;

        // 1. Database Update: donations table
        await pool.query('UPDATE donations SET status = "completed", certificate_proof_url = ? WHERE id = ?', [filePath, donationId]);

        // 2. Linked Request Update
        await pool.query('UPDATE blood_requests SET status = "completed" WHERE id = ?', [donation.request_id]);

        // 3. Status Update (Cool-off) 
        await pool.query('UPDATE users SET last_donation_date = CURRENT_TIMESTAMP WHERE id = ?', [donation.donor_id]);

        // Fetch Donor Name for logging
        const [donors] = await pool.query('SELECT name FROM users WHERE id = ?', [donation.donor_id]);
        const userName = donors.length > 0 ? donors[0].name : 'Unknown';

        // 4. Logging requirement exactly as stated
        console.log(`[PROOF RECEIVED] Donor ${userName} uploaded certificate ${filePath} for Donation ID ${donationId} - Completion Successful.`);

        // 5. Statistics Increment logic (lives saved happens implicitly in GET profile via donationsCount * 3, we don't need a specific stats table increment unless required by a different route).
        // Let's verify if there is a global stats table.
        const [statsTables] = await pool.query("SHOW TABLES LIKE 'platform_stats'");
        if (statsTables.length > 0) {
            await pool.query("UPDATE platform_stats SET total_donations = total_donations + 1, lives_saved = lives_saved + 3 WHERE id = 1");
        }
        res.status(200).json({ success: true, message: 'File uploaded and donation completed successfully.', file_path: filePath });

    } catch (error) {
        console.error('Error uploading proof:', error);
        res.status(500).json({ error: 'Internal Server Error during upload processing.' });
    }
});

module.exports = router;
