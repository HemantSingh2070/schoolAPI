const mysql = require('mysql2'); 
require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    port: 3306,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }).promise();

// Add school function =>

const addSchool = async (name,address,latitude,longitude) => {
try{
    const sql = 'INSERT INTO school (name, address, latitude, longitude)VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(sql, [name, address, latitude, longitude]);
    console.log(result);
    return result.insertId;
}
catch(e){
    console.log(e);  
}
}

// List the nearest school function =>
const listNearestSchool = async (latitude,longitude) => {
    try{
        const sql = 'SELECT id, name, address, latitude, longitude FROM school';
        const [schools] = await pool.query(sql);
        if(schools.length===0) return [];
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const toRadians = (deg) => (deg * Math.PI) / 180;
            const R = 6371;
            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };
        const sortedSchools = schools
            .map((school) => ({
                ...school,
                distance: calculateDistance(latitude, longitude, school.latitude, school.longitude),
            }))
            .sort((a, b) => a.distance - b.distance);

        return sortedSchools;} 
        catch (error) {
        console.error('Error listing nearest schools:', error.message);
        throw error;
    }}

module.exports = {addSchool,listNearestSchool}