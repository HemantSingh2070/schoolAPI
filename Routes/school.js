const express = require('express');
const router = express.Router();
const { handleAddSchool, handleNearSchoolList, getAllSchools } = require('../Controllers/school');
const { validateAddSchool, validateNearbySchools } = require('../middleware/validation');

// Add a new school
router.post('/addSchool', validateAddSchool, handleAddSchool);

// Get nearby schools (supports both GET with query params and POST with body)
router.get('/listSchools', validateNearbySchools, handleNearSchoolList);
router.post('/listSchools', validateNearbySchools, handleNearSchoolList);

// Get all schools
router.get('/schools', getAllSchools);

module.exports = router;