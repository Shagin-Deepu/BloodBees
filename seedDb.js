require('dotenv').config();
// const connectDB = require('./config/db'); // Removed to prevent MySQL connection from keeping process alive
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');
const BloodRequest = require('./models/BloodRequest');
const Donation = require('./models/Donation');
const Notification = require('./models/Notification');

const seed = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect('mongodb://localhost:27017/bloodbees');

        console.log('Clearing existing data...');
        // Clear collections instead of DELETE FROM tables
        await User.deleteMany({});
        await BloodRequest.deleteMany({});
        await Donation.deleteMany({});
        await Notification.deleteMany({});

        console.log('Seeding database...');

        // 1. Create Users (Donors & Recipients)
        const passwordHash = await bcrypt.hash('password123', 10);

        const userData = [
            { name: 'Rahul Sharma', email: 'rahul.s@example.com', password_hash: passwordHash, role: 'donor', blood_group: 'O+', location: 'Kochi', phone: '9876543210' },
            { name: 'Priya Nair', email: 'priya.nair@example.com', password_hash: passwordHash, role: 'donor', blood_group: 'A-', location: 'Trivandrum', phone: '9123456780' },
            { name: 'Arjun Menon', email: 'arjun.m@example.com', password_hash: passwordHash, role: 'recipient', blood_group: 'B+', location: 'Kozhikode', phone: '9447012345' },
            { name: 'Anjali Desai', email: 'anjali.d@example.com', password_hash: passwordHash, role: 'donor', blood_group: 'AB+', location: 'Thrissur', phone: '9944332211' },
            { name: 'Admin User', email: 'admin@bloodbees.com', password_hash: passwordHash, role: 'admin', blood_group: 'O-', location: 'Kochi', phone: '9898989898' }
        ];

        const createdUsers = await User.insertMany(userData);
        console.log('Users seeded.');

        // 2. Create Blood Requests
        const recipient = createdUsers.find(u => u.role === 'recipient') || createdUsers[0];

        const requestData = [
            { requester_id: recipient._id, patient_name: 'Lakshmi Amma', bystander_name: 'Vinod Kumar', bystander_contact: '9447012345', blood_group: 'A+', urgency: 'medium', hospital_name: 'Aster Medcity', location: 'Kochi', status: 'pending' },
            { requester_id: recipient._id, patient_name: 'Suresh Gopi', bystander_name: 'Arjun Menon', bystander_contact: '9447012345', blood_group: 'O-', urgency: 'critical', hospital_name: 'KIMS Health', location: 'Trivandrum', status: 'pending' },
            { requester_id: recipient._id, patient_name: 'Devika Raj', bystander_name: 'Kiran', bystander_contact: '9123456000', blood_group: 'B+', urgency: 'low', hospital_name: 'Amrita Hospital', location: 'Kochi', status: 'completed' } // One completed for "Lives Saved" stats
        ];

        const createdRequests = await BloodRequest.insertMany(requestData);
        console.log('Blood requests seeded.');

        // 3. Create Donations (for "Units Collected")
        // Find a completed request for the donation
        const completedRequest = createdRequests.find(r => r.status === 'completed') || createdRequests[0];
        const donor = createdUsers.find(u => u.role === 'donor') || createdUsers[0];

        if (completedRequest) {
            await Donation.create({
                donor_id: donor._id,
                request_id: completedRequest._id,
                status: 'completed'
            });
            console.log('Donations seeded.');
        }

        console.log('Database seeding completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
