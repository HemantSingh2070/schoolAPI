const { addSchool, listNearestSchool, getAllSchoolsFromDB } = require('../Services/school');

const handleAddSchool = async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;
        
        const result = await addSchool(name, address, latitude, longitude);
        
        if (result && result.success) {
            return res.status(201).json({
                success: true,
                message: 'School added successfully',
                data: {
                    id: result.schoolId,
                    name,
                    address,
                    latitude,
                    longitude
                }
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Failed to add school',
                message: result?.message || 'Unknown error occurred'
            });
        }
    } catch (error) {
        console.error('Error in handleAddSchool:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'An unexpected error occurred while adding the school'
        });
    }
};

const handleNearSchoolList = async (req, res) => {
    try {
        const { latitude, longitude, radius, limit } = req.validatedData;
        
        const result = await listNearestSchool(latitude, longitude, radius, limit);
        
        if (result && result.success) {
            return res.status(200).json({
                success: true,
                message: 'Schools retrieved successfully',
                data: {
                    userLocation: { latitude, longitude },
                    searchRadius: radius,
                    totalSchools: result.schools.length,
                    schools: result.schools
                }
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Failed to retrieve schools',
                message: result?.message || 'Unknown error occurred'
            });
        }
    } catch (error) {
        console.error('Error in handleNearSchoolList:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'An unexpected error occurred while retrieving schools'
        });
    }
};

const getAllSchools = async (req, res) => {
    try {
        const result = await getAllSchoolsFromDB();
        
        if (result && result.success) {
            return res.status(200).json({
                success: true,
                message: 'All schools retrieved successfully',
                data: {
                    totalSchools: result.schools.length,
                    schools: result.schools
                }
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Failed to retrieve schools',
                message: result?.message || 'Unknown error occurred'
            });
        }
    } catch (error) {
        console.error('Error in getAllSchools:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'An unexpected error occurred while retrieving schools'
        });
    }
};

module.exports = { handleAddSchool, handleNearSchoolList, getAllSchools };