const express = require('express');
const router = express.Router();
const {handleAddSchool,handleNearSchoolList} = require('../Controllers/school')
router.post("/addSchool",handleAddSchool);
router.get("/listSchools",handleNearSchoolList);
module.exports = router;