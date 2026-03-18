const pool = require('../config/db');

// Return all users from the DB
const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
        res.json(users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            blood_group: u.blood_group,
            location: u.location,
            phone: u.phone,
            created_at: u.created_at
        })));
    } catch (error) {
        console.error('Admin: error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Return all blood requests — includes joined requester_name, requester_phone
const getAllRequests = async (req, res) => {
    try {
        const [requests] = await pool.query(`
            SELECT r.*, u.name as requester_name, u.phone as requester_phone 
            FROM blood_requests r 
            LEFT JOIN users u ON r.requester_id = u.id 
            ORDER BY r.created_at DESC
        `);
        res.json(requests);
    } catch (error) {
        console.error('Admin: error fetching requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Return all donations — includes joined hospital_name, location, blood_group
const getAllDonations = async (req, res) => {
    try {
        const [donations] = await pool.query(`
            SELECT d.id, d.status, d.donation_date, d.donor_id, d.request_id,
                   u.name AS donor_name,
                   r.patient_name, r.blood_group, r.hospital_name, r.location
            FROM donations d
            LEFT JOIN users u ON d.donor_id = u.id
            LEFT JOIN blood_requests r ON d.request_id = r.id
            ORDER BY d.donation_date DESC
        `);
        res.json(donations);
    } catch (error) {
        console.error('Admin: error fetching donations:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllUsers, getAllRequests, getAllDonations };
