# Node JS Assignment: School Management API

## Task: Develop Node.js APIs for School Management

### Objective:
The goal of this project is to implement a set of APIs using Node.js, Express.js, and MySQL to manage school data. The system will allow users to:
- Add new schools to the database.
- Retrieve a list of schools sorted by proximity to a user-specified location (latitude and longitude).

---

## Database Setup

### Schools Table:

Create a MySQL table named `schools` with the following fields:
- `id` (Primary Key, AUTO_INCREMENT)
- `name` (VARCHAR)
- `address` (VARCHAR)
- `latitude` (FLOAT)
- `longitude` (FLOAT)


# MY SQL
  CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);

## API Endpoints
### 1. Add School API
Endpoint: /addSchool
Method: POST
Payload Example:
json
Copy code
```{
  "name": "KIET School",
  "address": "Muradnagar, Uttar Pradesh 201206",
  "latitude": 28.8100,
  "longitude": 77.4931
}
```
Description:

This API accepts data for a new school and adds it to the MySQL database.
It validates the input data to ensure that all fields are non-empty and contain the correct data types (e.g., latitude and longitude must be valid float values).
The request must include:
name: Name of the school
address: Full address of the school
latitude: Latitude of the school
longitude: Longitude of the school
Sample Request:

URL: https://school-api-byhemantsingh.vercel.app/addSchool
Method: POST
Body:
json
Copy code
```{
  "name": "KIET School",
  "address": "Muradnagar, Uttar Pradesh 201206",
  "latitude": 28.8100,
  "longitude": 77.4931
}
```
Response:
Success: 201 Created
Error (Missing Fields): 400 Bad Request
### 2. List Schools API
Endpoint: /listSchools

Method: GET

Query Parameters:

latitude (float) - The user's latitude.
longitude (float) - The user's longitude.
Description:

This API fetches all schools from the database and sorts them based on their proximity to the provided user's coordinates (latitude and longitude).
The proximity is calculated using the Haversine formula, which computes the great-circle distance between two points (specified by their latitude and longitude).
Sample Request:

URL: https://school-api-byhemantsingh.vercel.app/listSchools
Method: GET
Body (Query Parameters):
json
Copy code
```{
  "latitude": 20.8100,
  "longitude": 70.4931
}
```
Response:
Success: Returns a list of schools, sorted by proximity to the provided coordinates.
Error (Missing Parameters): 400 Bad Request
Error (Invalid Coordinates): 422 Unprocessable Entity
Example API Calls
1. Add School Example
Request:

POST https://school-api-byhemantsingh.vercel.app/addSchool
Body:

json
Copy code
```
{
  "name": "KIET School",
  "address": "Muradnagar, Uttar Pradesh 201206",
  "latitude": 28.8100,
  "longitude": 77.4931
}
```
Response:

json
Copy code
```
{
  "message": "School added successfully."
}
```
2. List Schools Example
Request:

GET https://school-api-byhemantsingh.vercel.app/listSchools?latitude=20.8100&longitude=70.4931

Response:

json
Copy code
```
[
  {
    "id": 1,
    "name": "KIET School",
    "address": "Muradnagar, Uttar Pradesh 201206",
    "latitude": 28.8100,
    "longitude": 77.4931,
    "distance": "150.2 km"
  },
  {
    "id": 2,
    "name": "ABC School",
    "address": "Somewhere, Uttar Pradesh",
    "latitude": 28.5000,
    "longitude": 77.6000,
    "distance": "200.5 km"
  }
]

```