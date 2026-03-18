-- BloodBees MySQL Schema
-- Run this file once to set up your database:
-- mysql -u root -p < schema.sql

DROP DATABASE IF EXISTS bloodbees;
CREATE DATABASE bloodbees;
USE bloodbees;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    role          ENUM('donor','recipient','admin') DEFAULT 'donor',
    blood_group   VARCHAR(5),
    location      VARCHAR(150),
    phone         VARCHAR(20),
    is_verified   TINYINT(1)   DEFAULT 0,
    is_profile_visible TINYINT(1) DEFAULT 1,
    last_donation_date TIMESTAMP NULL,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Blood requests table
CREATE TABLE IF NOT EXISTS blood_requests (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    requester_id        INT          NOT NULL,
    patient_name        VARCHAR(100) NOT NULL,
    blood_group         VARCHAR(5)   NOT NULL,
    urgency             ENUM('low','medium','high','critical') DEFAULT 'medium',
    location            VARCHAR(150),
    hospital_name       VARCHAR(150),
    date_of_requirement DATE,
    bystander_name      VARCHAR(100),
    bystander_contact   VARCHAR(20),
    note                TEXT,
    status              ENUM('pending','accepted','completed') DEFAULT 'pending',
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    donor_id      INT          NOT NULL,
    request_id    INT          NOT NULL,
    status        ENUM('scheduled','completed','cancelled') DEFAULT 'scheduled',
    donation_date TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id)   REFERENCES users(id)          ON DELETE CASCADE,
    FOREIGN KEY (request_id) REFERENCES blood_requests(id) ON DELETE CASCADE,
    UNIQUE KEY unique_pledge (donor_id, request_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT          NOT NULL,
    message    TEXT         NOT NULL,
    is_read    TINYINT(1)  DEFAULT 0,
    created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
