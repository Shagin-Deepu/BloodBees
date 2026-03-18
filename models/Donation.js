const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    request_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    donation_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
