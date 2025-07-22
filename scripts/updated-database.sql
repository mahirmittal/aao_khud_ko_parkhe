-- Updated database schema for Call Executive Feedback System
CREATE DATABASE IF NOT EXISTS chhattisgarh_call_center;

USE chhattisgarh_call_center;

-- Create Executives table for call center staff
CREATE TABLE IF NOT EXISTS Executives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Create updated feedback table with new fields
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    call_id VARCHAR(50) NOT NULL,
    citizen_mobile VARCHAR(10) NOT NULL,
    citizen_name VARCHAR(100) NOT NULL,
    query_type VARCHAR(100) NOT NULL,
    satisfaction ENUM('satisfied', 'not-satisfied') NOT NULL,
    description TEXT NOT NULL,
    submitted_by VARCHAR(20) NOT NULL, -- Executive Employee ID
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'resolved') DEFAULT 'pending',
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(50) NULL,
    INDEX idx_call_id (call_id),
    INDEX idx_citizen_mobile (citizen_mobile),
    INDEX idx_submitted_by (submitted_by),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at),
    FOREIGN KEY (submitted_by) REFERENCES Executives(employee_id)
);

-- Create admin users table for higher authorities
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    designation VARCHAR(100),
    department VARCHAR(50),
    role ENUM('admin', 'supervisor', 'manager') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Insert sample Executives
INSERT INTO Executives (employee_id, full_name, password_hash, department) VALUES
('EXE001', 'Rajesh Sharma', '$2b$10$rQZ8kHWKQVnqVY8kHWKQVnqVY8kHWKQVnqVY8kHWKQVnqVY8kHWKQ', 'Call Center'),
('EXE002', 'Priya Patel', '$2b$10$rQZ8kHWKQVnqVY8kHWKQVnqVY8kHWKQVnqVY8kHWKQVnqVY8kHWKQ', 'Call Center'),
('EXE003', 'Amit Kumar', '$2b$10$rQZ8kHWKQVnqVY8kHWKQVnqVY8kHWKQVnqVY8kHWKQVnqVY8kHWKQ', 'Call Center')
ON DUPLICATE KEY UPDATE employee_id = employee_id;

-- Insert default admin user
INSERT INTO admin_users (username, password_hash, full_name, designation, role) 
VALUES ('admin', '$2b$10$rQZ8kHWKQVnqVY8kHWKQVnqVY8kHWKQVnqVY8kHWKQVnqVY8kHWKQ', 'System Administrator', 'IT Manager', 'manager')
ON DUPLICATE KEY UPDATE username = username;

-- Create call statistics table for reporting
CREATE TABLE IF NOT EXISTS call_statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    Executive_id VARCHAR(20) NOT NULL,
    total_calls INT DEFAULT 0,
    satisfied_calls INT DEFAULT 0,
    not_satisfied_calls INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date_Executive (date, Executive_id),
    FOREIGN KEY (Executive_id) REFERENCES Executives(employee_id)
);

-- Sample feedback data
INSERT INTO feedback (call_id, citizen_mobile, citizen_name, query_type, satisfaction, description, submitted_by, status) VALUES
('CG001', '9876543210', 'Ramesh Kumar', 'Birth Certificate', 'satisfied', 'Citizen was satisfied with the quick resolution. Birth certificate application was processed successfully.', 'EXE001', 'resolved'),
('CG002', '9876543211', 'Sunita Devi', 'Income Certificate', 'not-satisfied', 'Citizen was not satisfied with the processing time. Requires follow-up with district office.', 'EXE002', 'pending'),
('CG003', '9876543212', 'Mohan Lal', 'Caste Certificate', 'satisfied', 'Query resolved successfully. Citizen was guided through the online application process.', 'EXE001', 'resolved'),
('CG004', '9876543213', 'Kavita Sharma', 'Domicile Certificate', 'not-satisfied', 'Technical issues with online portal. Citizen unable to complete application. Needs technical support.', 'EXE003', 'pending');
