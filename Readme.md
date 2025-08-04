# Node JS Assignment: School Management API

## Overview
A robust Node.js REST API for managing school data with geolocation-based proximity search. Built with Express.js, MySQL, and modern security practices.

## Features
- 🏫 Add new schools to database
- 📍 Find schools by proximity to user location
- 🔒 Comprehensive input validation and security
- 🚀 High-performance database queries with connection pooling
- 📊 Health check endpoints
- 🛡️ Rate limiting and CORS protection
- 📝 Comprehensive error handling and logging

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd schoolAPI
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Create database and tables**
```bash
# Run the SQL script in your MySQL database
mysql -u your_username -p < Public/schoolTable.sql
```

5. **Start the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### Base URL
```
Local: http://localhost:3000/api/v1
Production: https://your-domain.com/api/v1
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-08-04T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 1. Add School
Add a new school to the database.

```http
POST /api/v1/addSchool
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "KIET School",
  "address": "Muradnagar, Uttar Pradesh 201206",
  "latitude": 28.8100,
  "longitude": 77.4931
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "KIET School",
    "address": "Muradnagar, Uttar Pradesh 201206",
    "latitude": 28.8100,
    "longitude": 77.4931
  }
}
```

**Validation Rules:**
- `name`: Required, 1-255 characters
- `address`: Required, 1-500 characters  
- `latitude`: Required, number between -90 and 90
- `longitude`: Required, number between -180 and 180

### 2. List Nearby Schools
Get schools sorted by proximity to a specified location.

#### Option A: GET with Query Parameters
```http
GET /api/v1/listSchools?latitude=28.8100&longitude=77.4931&radius=50&limit=10
```

#### Option B: POST with JSON Body
```http
POST /api/v1/listSchools
Content-Type: application/json
```

**Request Body:**
```json
{
  "latitude": 28.8100,
  "longitude": 77.4931,
  "radius": 50,
  "limit": 10
}
```

**Parameters:**
- `latitude` (required): User's latitude (-90 to 90)
- `longitude` (required): User's longitude (-180 to 180)
- `radius` (optional): Search radius in km (default: 50, max: 1000)
- `limit` (optional): Maximum results (default: 10, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "data": {
    "userLocation": {
      "latitude": 28.8100,
      "longitude": 77.4931
    },
    "searchRadius": 50,
    "totalSchools": 2,
    "schools": [
      {
        "id": 1,
        "name": "KIET School",
        "address": "Muradnagar, Uttar Pradesh 201206",
        "latitude": 28.8100,
        "longitude": 77.4931,
        "distance": "0.00 km"
      },
      {
        "id": 2,
        "name": "Delhi Public School",
        "address": "Mathura Road, New Delhi 110076",
        "latitude": 28.5244,
        "longitude": 77.2479,
        "distance": "35.42 km"
      }
    ]
  }
}
```

### 3. Get All Schools
Retrieve all schools in the database.

```http
GET /api/v1/schools
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All schools retrieved successfully",
  "data": {
    "totalSchools": 5,
    "schools": [
      {
        "id": 1,
        "name": "Bishop Cotton School",
        "address": "Shimla, Himachal Pradesh 171001",
        "latitude": 31.1048,
        "longitude": 77.1734
      }
    ]
  }
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Database Schema

```sql
CREATE TABLE school (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_coordinates (latitude, longitude),
    INDEX idx_name (name),
    
    CONSTRAINT chk_latitude CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT chk_longitude CHECK (longitude >= -180 AND longitude <= 180)
);
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable origin policies
- **Input Validation**: Comprehensive validation using Joi
- **SQL Injection Prevention**: Parameterized queries
- **Helmet.js**: Security headers
- **Request Size Limiting**: 10MB max payload

## Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (to be implemented)
```

### Project Structure
```
├── Controllers/         # Request handlers
├── Services/           # Business logic and database operations
├── Routes/            # API route definitions
├── middleware/        # Custom middleware (validation, etc.)
├── Public/           # Database scripts and static files
├── index.js          # Application entry point
├── package.json      # Dependencies and scripts
├── .env.example      # Environment variables template
└── README.md         # Documentation
```

## Environment Variables

Required environment variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=schoolSetup
MYSQL_PORT=3306
```

## Performance Considerations

- **Connection Pooling**: Optimized MySQL connection management
- **Database Indexing**: Indexed on coordinates and name for fast queries
- **Query Optimization**: Efficient distance calculations
- **Response Caching**: Consider implementing Redis for production
- **Pagination**: Built-in result limiting

## Future Enhancements

- [ ] Unit and integration tests
- [ ] API documentation with Swagger
- [ ] Caching layer (Redis)
- [ ] Geographic indexing for ultra-fast proximity search
- [ ] School categories and filtering
- [ ] User authentication and authorization
- [ ] Audit logging
- [ ] Docker containerization
- [ ] CI/CD pipeline

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact:
- **Author**: Hemant Singh
- **Email**: [Your Email]
- **GitHub**: [Your GitHub Profile]