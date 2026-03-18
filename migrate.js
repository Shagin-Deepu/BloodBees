require('dotenv').config();
const pool = require('./config/db');

async function migrate() {
    try {
        await pool.query('ALTER TABLE users ADD COLUMN is_profile_visible TINYINT(1) DEFAULT 1;');
        console.log('Added is_profile_visible column');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('is_profile_visible already exists');
        } else {
            console.error(e);
        }
    }

    try {
        await pool.query('ALTER TABLE users ADD COLUMN last_donation_date TIMESTAMP NULL;');
        console.log('Added last_donation_date column');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('last_donation_date already exists');
        } else {
            console.error(e);
        }
    }
    process.exit(0);
}

migrate();
