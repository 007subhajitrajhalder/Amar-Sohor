-- =====================================================
-- AMAR SOHOR DATABASE
-- MySQL Database Structure
-- =====================================================

CREATE DATABASE IF NOT EXISTS amar_sohor
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE amar_sohor;


-- =====================================================
-- 1. USERS
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    phone VARCHAR(20) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    role ENUM(
        'ADMIN',
        'USER',
        'AGENT'
    ) NOT NULL DEFAULT 'USER'
);


-- =====================================================
-- 2. AGENCIES
-- =====================================================

CREATE TABLE IF NOT EXISTS agencies (
    agency_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    agency_name VARCHAR(150) NOT NULL UNIQUE,

    department_type VARCHAR(100) NOT NULL
);


-- =====================================================
-- 3. AGENCY MEMBERS
-- =====================================================

CREATE TABLE IF NOT EXISTS agency_members (
    agent_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    agency_id INT UNSIGNED NOT NULL,

    user_id INT UNSIGNED NOT NULL UNIQUE,

    latitude DECIMAL(10, 7),

    longitude DECIMAL(10, 7),

    CONSTRAINT fk_agency_members_agency
        FOREIGN KEY (agency_id)
        REFERENCES agencies(agency_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_agency_members_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


-- =====================================================
-- 4. FACILITY CATEGORIES
-- =====================================================

CREATE TABLE IF NOT EXISTS facility_categories (
    category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    category_name VARCHAR(100) NOT NULL UNIQUE,

    handling_agency INT UNSIGNED NOT NULL,

    CONSTRAINT fk_categories_agency
        FOREIGN KEY (handling_agency)
        REFERENCES agencies(agency_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


-- =====================================================
-- 5. FACILITIES
-- =====================================================

CREATE TABLE IF NOT EXISTS facilities (
    facility_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    facility_name VARCHAR(150) NOT NULL,

    category_id INT UNSIGNED NOT NULL,

    latitude DECIMAL(10, 7) NOT NULL,

    longitude DECIMAL(10, 7) NOT NULL,

    address TEXT NOT NULL,

    added_by INT UNSIGNED NOT NULL,

    status ENUM(
        'SUSPENDED',
        'OPEN',
        'UNDER_REPAIR'
    ) NOT NULL DEFAULT 'OPEN',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    photo_url VARCHAR(1000),

    CONSTRAINT fk_facilities_category
        FOREIGN KEY (category_id)
        REFERENCES facility_categories(category_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_facilities_agent
        FOREIGN KEY (added_by)
        REFERENCES agency_members(agent_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


-- =====================================================
-- 6. RATINGS
-- =====================================================

CREATE TABLE IF NOT EXISTS ratings (
    rating_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    facility_id INT UNSIGNED NOT NULL,

    user_id INT UNSIGNED NOT NULL,

    title VARCHAR(200) NOT NULL,

    rating INT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ratings_facility
        FOREIGN KEY (facility_id)
        REFERENCES facilities(facility_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_ratings_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_rating_range
        CHECK (rating >= 1 AND rating <= 5)
);


-- =====================================================
-- 7. REPORTS
-- =====================================================

CREATE TABLE IF NOT EXISTS reports (
    report_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    facility_id INT UNSIGNED NOT NULL,

    user_id INT UNSIGNED NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT NOT NULL,

    photo_url VARCHAR(1000) NOT NULL,

    status ENUM(
        'PENDING',
        'UNDER_INVESTIGATION',
        'RESOLVED'
    ) NOT NULL DEFAULT 'PENDING',

    assigned_agency INT UNSIGNED NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reports_facility
        FOREIGN KEY (facility_id)
        REFERENCES facilities(facility_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_reports_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_reports_agency
        FOREIGN KEY (assigned_agency)
        REFERENCES agencies(agency_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


-- =====================================================
-- 8. REPORT RESOLUTION SUBMISSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS report_resolution_submissions (
    resolution_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    report_id INT UNSIGNED NOT NULL,

    agent_id INT UNSIGNED NOT NULL,

    resolution_photo VARCHAR(1000) NOT NULL,

    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    verification_status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED'
    ) NOT NULL DEFAULT 'PENDING',

    CONSTRAINT fk_report_resolution_report
        FOREIGN KEY (report_id)
        REFERENCES reports(report_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_report_resolution_agent
        FOREIGN KEY (agent_id)
        REFERENCES agency_members(agent_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


-- =====================================================
-- 9. RECOMMENDATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS recommendations (
    recommendation_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,

    category_id INT UNSIGNED NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT NOT NULL,

    latitude DECIMAL(10, 7),

    longitude DECIMAL(10, 7),

    address TEXT NOT NULL,

    photo_url VARCHAR(1000) NOT NULL,

    status ENUM(
        'PENDING',
        'ALLOCATED',
        'UNDER_INVESTIGATION',
        'APPROVED',
        'REJECTED',
        'INSTALLED'
    ) NOT NULL DEFAULT 'PENDING',

    assigned_agency INT UNSIGNED,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recommendations_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_recommendations_category
        FOREIGN KEY (category_id)
        REFERENCES facility_categories(category_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_recommendations_agency
        FOREIGN KEY (assigned_agency)
        REFERENCES agencies(agency_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


-- =====================================================
-- 10. RECOMMENDATION INVESTIGATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS recommendation_investigations (
    investigation_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    recommendation_id INT UNSIGNED NOT NULL,

    description VARCHAR(1000) NOT NULL,

    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    verification_status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED'
    ) NOT NULL DEFAULT 'PENDING',

    CONSTRAINT fk_investigation_recommendation
        FOREIGN KEY (recommendation_id)
        REFERENCES recommendations(recommendation_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_agency_members_agency
ON agency_members(agency_id);

CREATE INDEX idx_facilities_category
ON facilities(category_id);

CREATE INDEX idx_facilities_status
ON facilities(status);

CREATE INDEX idx_facilities_coordinates
ON facilities(latitude, longitude);

CREATE INDEX idx_ratings_facility
ON ratings(facility_id);

CREATE INDEX idx_reports_user
ON reports(user_id);

CREATE INDEX idx_reports_agency
ON reports(assigned_agency);

CREATE INDEX idx_reports_status
ON reports(status);

CREATE INDEX idx_recommendations_user
ON recommendations(user_id);

CREATE INDEX idx_recommendations_category
ON recommendations(category_id);

CREATE INDEX idx_recommendations_agency
ON recommendations(assigned_agency);

CREATE INDEX idx_recommendations_status
ON recommendations(status);


-- =====================================================
-- INITIAL AGENCY DATA
-- =====================================================

INSERT IGNORE INTO agencies (
    agency_id,
    agency_name,
    department_type
)
VALUES
(
    1,
    'KMC SWM Department',
    'Solid Waste Management'
),
(
    2,
    'KMC Sanitation Department',
    'Public Sanitation'
),
(
    3,
    'KMC Water Department',
    'Water Services'
),
(
    4,
    'Kolkata Police',
    'Parking Management'
);


-- =====================================================
-- INITIAL FACILITY CATEGORY DATA
-- =====================================================

INSERT IGNORE INTO facility_categories (
    category_id,
    category_name,
    handling_agency
)
VALUES
(
    1,
    'DUSTBIN',
    1
),
(
    2,
    'TOILET',
    2
),
(
    3,
    'WATER_POINT',
    3
),
(
    4,
    'PARKING',
    4
);