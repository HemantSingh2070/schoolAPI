-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS schoolSetup;
USE schoolSetup;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS school;

-- Create schools table with improved structure
CREATE TABLE school (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Add indexes for better performance
    INDEX idx_coordinates (latitude, longitude),
    INDEX idx_name (name),
    
    -- Add constraints
    CONSTRAINT chk_latitude CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT chk_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

-- Insert sample data
INSERT INTO school (name, address, latitude, longitude) VALUES
('KIET School', 'Muradnagar, Uttar Pradesh 201206', 28.8100, 77.4931),
('Delhi Public School', 'Mathura Road, New Delhi 110076', 28.5244, 77.2479),
('St. Xavier High School', 'Fort, Mumbai 400001', 18.9220, 72.8347),
('Bishop Cotton School', 'Shimla, Himachal Pradesh 171001', 31.1048, 77.1734),
('The Doon School', 'Dehradun, Uttarakhand 248001', 30.3165, 78.0322);

-- Display inserted data
SELECT * FROM school;
