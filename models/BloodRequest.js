const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
    requester_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patient_name: { type: String, required: true },
    blood_group: { type: String, required: true },
    urgency: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
    location: { type: String, required: true },
    hospital_name: { type: String, required: true },
    date_of_requirement: { type: Date },
    bystander_name: { type: String },
    bystander_contact: { type: String },
    note: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
