const mysql = require('mysql2'); 
require('dotenv').config();

// Create connection pool for better performance and connection management
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER,
    port: process.env.MYSQL_PORT || 3306,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
}).promise();

// Test database connection
const testConnection = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
};

// Initialize connection test
testConnection();

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers
    
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Add school function with improved error handling
const addSchool = async (name, address, latitude, longitude) => {
    try {
        // Check if school already exists at the same location
        const checkSql = 'SELECT id FROM school WHERE latitude = ? AND longitude = ? LIMIT 1';
        const [existing] = await pool.query(checkSql, [latitude, longitude]);
        
        if (existing.length > 0) {
            return {
                success: false,
                message: 'A school already exists at this location'
            };
        }
        
        const sql = 'INSERT INTO school (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(sql, [name, address, latitude, longitude]);
        
        console.log(`✅ School added successfully with ID: ${result.insertId}`);
        return {
            success: true,
            schoolId: result.insertId,
            message: 'School added successfully'
        };
    } catch (error) {
        console.error('❌ Error adding school:', error);
        return {
            success: false,
            message: 'Database error occurred while adding school'
        };
    }
};

// List nearest schools with radius filtering and improved performance
const listNearestSchool = async (latitude, longitude, radius = 50, limit = 10) => {
    try {
        const sql = 'SELECT id, name, address, latitude, longitude FROM school';
        const [schools] = await pool.query(sql);
        
        if (schools.length === 0) {
            return {
                success: true,
                schools: [],
                message: 'No schools found in database'
            };
        }
        
        // Calculate distances and filter by radius
        const schoolsWithDistance = schools
            .map((school) => ({
                id: school.id,
                name: school.name,
                address: school.address,
                latitude: school.latitude,
                longitude: school.longitude,
                distance: calculateDistance(latitude, longitude, school.latitude, school.longitude)
            }))
            .filter(school => school.distance <= radius) // Filter by radius
            .sort((a, b) => a.distance - b.distance) // Sort by distance
            .slice(0, limit) // Limit results
            .map(school => ({
                ...school,
                distance: `${school.distance.toFixed(2)} km`
            }));
        
        console.log(`✅ Found ${schoolsWithDistance.length} schools within ${radius}km radius`);
        return {
            success: true,
            schools: schoolsWithDistance,
            message: `Found ${schoolsWithDistance.length} schools within ${radius}km radius`
        };
    } catch (error) {
        console.error('❌ Error listing nearest schools:', error);
        return {
            success: false,
            message: 'Database error occurred while retrieving schools'
        };
    }
};

// Get all schools from database
const getAllSchoolsFromDB = async () => {
    try {
        const sql = 'SELECT id, name, address, latitude, longitude FROM school ORDER BY name';
        const [schools] = await pool.query(sql);
        
        console.log(`✅ Retrieved ${schools.length} schools from database`);
        return {
            success: true,
            schools: schools,
            message: `Retrieved ${schools.length} schools successfully`
        };
    } catch (error) {
        console.error('❌ Error getting all schools:', error);
        return {
            success: false,
            message: 'Database error occurred while retrieving schools'
        };
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🔄 Closing database connections...');
    await pool.end();
    console.log('✅ Database connections closed');
    process.exit(0);
});

module.exports = { 
    addSchool, 
    listNearestSchool, 
    getAllSchoolsFromDB 
};