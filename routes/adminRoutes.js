const express = require('express');
const router = express.Router();
const { getAllUsers, getAllRequests, getAllDonations } = require('../controllers/adminController');

// All routes here should be protected by an admin middleware ideally,
// but for this MVP, they are open or we assume the frontend hides them.
router.get('/users', getAllUsers);
router.get('/requests', getAllRequests);
router.get('/donations', getAllDonations);

module.exports = router;
