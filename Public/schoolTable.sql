CREATE DATABASE schoolSetup;
USE schoolSetup;
CREATE TABLE school(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    latitude FLOAT,
    longitude FLOAT
);
