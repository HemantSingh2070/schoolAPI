const Joi = require('joi');

// Validation schemas
const addSchoolSchema = Joi.object({
    name: Joi.string().trim().min(1).max(255).required().messages({
        'string.empty': 'School name is required',
        'string.min': 'School name must not be empty',
        'string.max': 'School name must not exceed 255 characters'
    }),
    address: Joi.string().trim().min(1).max(500).required().messages({
        'string.empty': 'Address is required',
        'string.min': 'Address must not be empty',
        'string.max': 'Address must not exceed 500 characters'
    }),
    latitude: Joi.number().min(-90).max(90).required().messages({
        'number.base': 'Latitude must be a number',
        'number.min': 'Latitude must be between -90 and 90',
        'number.max': 'Latitude must be between -90 and 90'
    }),
    longitude: Joi.number().min(-180).max(180).required().messages({
        'number.base': 'Longitude must be a number',
        'number.min': 'Longitude must be between -180 and 180',
        'number.max': 'Longitude must be between -180 and 180'
    })
});

const nearbySchoolsSchema = Joi.object({
    latitude: Joi.number().min(-90).max(90).required().messages({
        'number.base': 'Latitude must be a number',
        'number.min': 'Latitude must be between -90 and 90',
        'number.max': 'Latitude must be between -90 and 90'
    }),
    longitude: Joi.number().min(-180).max(180).required().messages({
        'number.base': 'Longitude must be a number',
        'number.min': 'Longitude must be between -180 and 180',
        'number.max': 'Longitude must be between -180 and 180'
    }),
    radius: Joi.number().min(1).max(1000).optional().default(50).messages({
        'number.base': 'Radius must be a number',
        'number.min': 'Radius must be at least 1 km',
        'number.max': 'Radius must not exceed 1000 km'
    }),
    limit: Joi.number().min(1).max(100).optional().default(10).messages({
        'number.base': 'Limit must be a number',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit must not exceed 100'
    })
});

// Validation middleware
const validateAddSchool = (req, res, next) => {
    const { error } = addSchoolSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: 'Validation Error',
            message: error.details[0].message,
            details: error.details
        });
    }
    next();
};

const validateNearbySchools = (req, res, next) => {
    // Handle both query parameters and body
    const data = req.method === 'GET' ? req.query : req.body;
    
    // Convert string parameters to numbers for GET requests
    if (req.method === 'GET') {
        if (data.latitude) data.latitude = parseFloat(data.latitude);
        if (data.longitude) data.longitude = parseFloat(data.longitude);
        if (data.radius) data.radius = parseInt(data.radius);
        if (data.limit) data.limit = parseInt(data.limit);
    }
    
    const { error, value } = nearbySchoolsSchema.validate(data);
    if (error) {
        return res.status(400).json({
            error: 'Validation Error',
            message: error.details[0].message,
            details: error.details
        });
    }
    
    // Attach validated data to request
    req.validatedData = value;
    next();
};

module.exports = {
    validateAddSchool,
    validateNearbySchools
};
