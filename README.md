# Employee Management Dashboard

A full-stack Employee Management Dashboard with a React (Vite) frontend and a Node.js/Express REST API backend using MongoDB and Mongoose for persistent employee data.

## Tech Stack

### Frontend
- React 19
- React Router
- Vite
- Framer Motion
- React Toastify
- React Icons

### Backend
- Node.js
- Express.js
- Mongoose
- MongoDB
- Multer
- file-type
- CORS
- dotenv

### Development Tools
- Nodemon
- Oxlint

---

## Project Structure

```text
project-root/
├── client/                       # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── mappers/
│   │   ├── utils/
│   │   ├── data/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
│
├── server/                       # Express REST API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
|   |   ├── data/
|   |   |   └── seedEmployees.js
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   │   └── employees/            # Uploaded profile images (git-ignored)
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Installation

The project contains separate frontend and backend applications.

### Backend

```bash
cd server
npm install
```

### Frontend

Open another terminal:

```bash
cd client
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server/` directory.

Example:

```env
PORT=5000
MONGODBURI=your_mongodb_connection_string
```

### Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port on which the Express server runs |
| `MONGODBURI` | MongoDB connection string |

> **Security:** Never commit your real MongoDB connection string, password, API keys, or other credentials to version control. The `.env` file is excluded through `.gitignore`.

---

## Running the Application

The backend and frontend should run simultaneously in separate terminals.

### Terminal 1 — Backend

```bash
cd server
npm start
```

For development with automatic restart:

```bash
cd server
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Terminal 2 — Frontend

```bash
cd client
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## Seed Data

To seed the database with sample employee data:

cd server
npm run seed

The seed script clears the existing employee data and inserts the sample employees into MongoDB.

Employee records can be created through:

- The frontend employee creation form
- The REST API using `POST /api/employees`

Example:

```http
POST /api/employees
```

See the request examples below for the required request body.

---

# API Documentation

Base API URL:

```text
http://localhost:5000/api
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | Get paginated employees (`page`, `limit`, `sort`) |
| GET | `/api/employees/:id` | Get an employee by MongoDB ID |
| POST | `/api/employees` | Create a new employee |
| PUT | `/api/employees/:id` | Update an employee |
| DELETE | `/api/employees/:id` | Delete an employee |
| GET | `/api/employees/search` | Search employees |
| GET | `/api/employees/statistics` | Get employee statistics |
| POST | `/api/employees/:id/profile-image` | Upload a profile image for an employee |
| DELETE | `/api/employees/:id/profile-image` | Delete an employee's profile image |

---

# Pagination

The employee list and search endpoints are paginated so the frontend never loads the entire employee collection at once.

## List Endpoint

```http
GET /api/employees?page=1&limit=10
```

### Query Parameters

| Parameter | Default | Validation |
|---|---|---|
| `page` | `1` | Integer `>= 1` |
| `limit` | `10` | Integer between `1` and `100` |
| `sort` | none | Optional. Prefix `-` for descending (e.g. `-createdAt`), no prefix for ascending. Whitelisted fields: `name`, `email`, `department`, `salary`, `status`, `location`, `startDate`, `createdAt`, `updatedAt` |

Invalid `page` or `limit` values return `400 Bad Request`.

### Example

```http
GET /api/employees?page=2&limit=10
```

### How Pagination Works

With `limit=10`:

```http
GET /api/employees?page=1&limit=10
```
→ Returns the first 10 employees.

```http
GET /api/employees?page=2&limit=10
```
→ Skips the first 10 employees and returns the next 10 employees.

```http
GET /api/employees?page=3&limit=10
```
→ Skips the first 20 employees and returns the next 10 employees.

The number of records skipped is calculated as `skip = (page - 1) * limit`, so:

- `page` 1 starts from the first record
- `page` 2 skips the first `limit` records
- `page` 3 skips the first `2 × limit` records

### Pagination Response

Every paginated endpoint returns the same metadata shape:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalEmployees": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

| Field | Description |
|---|---|
| `page` | Current page number |
| `limit` | Records per page |
| `totalEmployees` | Total matching records in the database (not just the current page) |
| `totalPages` | Total number of pages |
| `hasNextPage` | Whether a next page exists |
| `hasPreviousPage` | Whether a previous page exists |

Object IDs are order-preserving, so `-createdAt` (or default natural order combined with `skip`/`limit`) is used to keep pagination stable across page requests.

---

# Search Employees

The search endpoint uses MongoDB queries and performs case-insensitive searches.

## Search by Name

```http
GET /api/employees/search?name=rahul
```

## Search by Email

```http
GET /api/employees/search?email=rahul@gmail.com
```

## Search by Department

```http
GET /api/employees/search?department=Backend
```

Search is case-insensitive.

For example:

```text
rahul
RAHUL
RahUl
```

will match the same employee names.

### Multiple Search Parameters

Multiple supported parameters can be combined:

```http
GET /api/employees/search?name=rahul&department=Backend
```

When multiple parameters are provided, employees matching all specified conditions are returned.

## Search with Pagination

The search endpoint supports the same pagination query parameters:

```http
GET /api/employees/search?query=rahul&page=1&limit=10
GET /api/employees/search?query=rahul&department=Backend&status=Active&page=2&limit=10
```

Invalid `page` or `limit` values return `400 Bad Request`. Paginated search responses include the same `pagination` metadata object as the list endpoint.

---

# Employee Data Model

| Field | Type | Required | Validation |
|---|---|---:|---|
| `name` | String | Yes | Trimmed |
| `email` | String | Yes | Unique, lowercase, trimmed, valid email format |
| `department` | String | Yes | Trimmed |
| `salary` | Number | Yes | Minimum `0.01` |
| `status` | String | Yes | `Active` or `Inactive` |
| `phone` | String | Yes | 10 digits starting with 6–9 |
| `location` | String | Yes | Trimmed |
| `startDate` | Date | Yes | Valid date |
| `profileImage` | String | No | Path to the stored profile image; defaults to `""` |
| `createdAt` | Date | Auto | Managed by Mongoose timestamps |
| `updatedAt` | Date | Auto | Managed by Mongoose timestamps |

---

# Employee Profile Image Upload

Employees can have a single profile image. The image is uploaded and stored on the server filesystem, while MongoDB stores only the path reference to the file.

## How File Upload Works

1. An admin selects a profile image from the Employee Add/Edit form.
2. The frontend validates the selected file type and size before upload.
3. In the browser, the selected image is kept as a `File` object and previewed using `URL.createObjectURL()`.
4. On form submission, the employee is first created or updated through the standard employee endpoints.
5. The selected image is then uploaded using `multipart/form-data`.
6. The backend receives the file through **Multer**.
7. The uploaded file is validated both by its **MIME type** and by its **actual file signature/content**.
8. A server-generated unique filename is used for storage.
9. The file is stored on the server filesystem.
10. Only the generated `/uploads/employees/<filename>` path is stored in MongoDB.
11. The image is served through the `/uploads` static route.
12. When replacing an existing image, the old image file is deleted from the filesystem.
13. When deleting an image, the database path is cleared and the file is removed from the filesystem.

## Allowed File Types

The profile image upload accepts the following image formats:

| Format | MIME type |
|---|---|
| JPG / JPEG | `image/jpeg` |
| PNG | `image/png` |
| WEBP | `image/webp` |

Actual file content/signature validation is also performed on the uploaded file. The file's real content is checked, so the declared MIME type alone is not trusted as proof of file type.

## Maximum File Size

- **Maximum:** 5 MB
- **Exact backend limit:** `5 * 1024 * 1024` bytes

Files larger than this limit are rejected.

## Upload Endpoint

```http
POST /api/employees/:id/profile-image
```

Requirements:

- Authentication required
- Admin role required
- Request must use `multipart/form-data`
- File field name: `profileImage`

### Example

```http
POST /api/employees/65f000000000000000000001/profile-image
Content-Type: multipart/form-data
```

Form data field:

| Field name | Type | Description |
|---|---|---|
| `profileImage` | File | The image file to upload for the employee |

## Delete Endpoint

```http
DELETE /api/employees/:id/profile-image
```

Requirements:

- Authentication required
- Admin role required
- Deletes the stored profile image and clears `Employee.profileImage`

## Authentication Requirement

- Profile image upload/delete requires authentication.
- Only users with the **Admin** role are authorized to upload or delete profile images.
- Unauthenticated requests return **401**.
- Authenticated, non-admin users return **403**.

## Where Files Are Stored

```text
server/uploads/employees/
```

- Files are stored on the server filesystem.
- The directory is exposed through the `/uploads` static route.
- Filenames are generated server-side using a timestamp + UUID combination.
- Original filenames are not used for storage.
- The uploads directory is git-ignored.

## Why Images Are Not Stored Directly in MongoDB

- MongoDB stores only the image **path** as a `String`.
- Image binary/Base64 data is not stored in the Employee document.
- This keeps employee documents smaller and avoids unnecessarily increasing database size.
- The filesystem and static serving are used for image delivery.
- The database acts as the reference to the stored file rather than holding the image itself.

---

# Request Examples

## 1. Create Employee

### Request

```http
POST /api/employees
Content-Type: application/json
```

### Body

```json
{
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "department": "Backend",
  "salary": 45000,
  "status": "Active",
  "phone": "9876543210",
  "location": "Kochi",
  "startDate": "2026-08-20"
}
```

---

## 2. Get Employees (Paginated)

```http
GET /api/employees?page=1&limit=10
```

`page` defaults to `1` and `limit` defaults to `10`. See the Pagination section for validation rules.

No request body is required.

---

## 3. Get Employee by ID

```http
GET /api/employees/65f000000000000000000001
```

Replace the example ID with an actual employee MongoDB ID.

---

## 4. Update Employee

### Request

```http
PUT /api/employees/65f000000000000000000001
Content-Type: application/json
```

### Body

```json
{
  "name": "Rahul Kumar",
  "email": "rahul.updated@example.com",
  "department": "Full Stack",
  "salary": 55000,
  "status": "Active",
  "phone": "9876543210",
  "location": "Mumbai",
  "startDate": "2026-08-20"
}
```

---

## 5. Delete Employee

```http
DELETE /api/employees/65f000000000000000000001
```

Replace the example ID with an actual employee MongoDB ID.

---

## 6. Search Employees

### By Name

```http
GET /api/employees/search?name=rahul
```

### By Email

```http
GET /api/employees/search?email=rahul@gmail.com
```

### By Department

```http
GET /api/employees/search?department=Backend
```

### By Query with Pagination

```http
GET /api/employees/search?query=rahul&page=1&limit=10
```

Every search request accepts the same `page` and `limit` parameters as the list endpoint.

## 7. Get Employee Statistics

```http
GET /api/employees/statistics
```

No request body is required.

---

## 8. Upload Employee Profile Image

### Request

```http
POST /api/employees/65f000000000000000000001/profile-image
Content-Type: multipart/form-data
```

The request body contains the image file in the `profileImage` field. See the [Employee Profile Image Upload](#employee-profile-image-upload) section for file type and size requirements.

### Response

```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "_id": "65f000000000000000000001",
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "profileImage": "/uploads/employees/1785345600000-6f2c4a9e-3a5b-4c0d-9e1f-2b8a7c6d5e4f.jpg",
    "createdAt": "2026-08-20T10:30:00.000Z",
    "updatedAt": "2026-08-20T11:00:00.000Z"
  }
}
```

---

## 9. Delete Employee Profile Image

```http
DELETE /api/employees/65f000000000000000000001/profile-image
```

### Response

```json
{
  "success": true,
  "message": "Profile image deleted successfully"
}
```

---

# Response Examples

## 1. Get Employees (Paginated)

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f000000000000000000001",
      "name": "Rahul Kumar",
      "email": "rahul@example.com",
      "department": "Backend",
      "salary": 45000,
      "status": "Active",
      "phone": "9876543210",
      "location": "Kochi",
      "startDate": "2026-08-20T00:00:00.000Z",
      "createdAt": "2026-08-20T10:30:00.000Z",
      "updatedAt": "2026-08-20T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalEmployees": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 2. Get Employee by ID

```json
{
  "success": true,
  "data": {
    "_id": "65f000000000000000000001",
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "department": "Backend",
    "salary": 45000,
    "status": "Active",
    "phone": "9876543210",
    "location": "Kochi",
    "startDate": "2026-08-20T00:00:00.000Z",
    "createdAt": "2026-08-20T10:30:00.000Z",
    "updatedAt": "2026-08-20T10:30:00.000Z"
  }
}
```

---

## 3. Create Employee

### HTTP Status

```text
201 Created
```

### Response

```json
{
  "success": true,
  "data": {
    "_id": "65f000000000000000000001",
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "department": "Backend",
    "salary": 45000,
    "status": "Active",
    "phone": "9876543210",
    "location": "Kochi",
    "startDate": "2026-08-20T00:00:00.000Z",
    "createdAt": "2026-08-20T10:30:00.000Z",
    "updatedAt": "2026-08-20T10:30:00.000Z"
  }
}
```

---

## 4. Update Employee

```json
{
  "success": true,
  "data": {
    "_id": "65f000000000000000000001",
    "name": "Rahul Kumar",
    "email": "rahul.updated@example.com",
    "department": "Full Stack",
    "salary": 55000,
    "status": "Active",
    "phone": "9876543210",
    "location": "Mumbai",
    "startDate": "2026-08-20T00:00:00.000Z",
    "createdAt": "2026-08-20T10:30:00.000Z",
    "updatedAt": "2026-08-20T11:00:00.000Z"
  }
}
```

---

## 5. Delete Employee

### HTTP Status

```text
200 OK
```

### Response

```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

---

## 6. Search Employees

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f000000000000000000001",
      "name": "Rahul Kumar",
      "email": "rahul@example.com",
      "department": "Backend",
      "salary": 45000,
      "status": "Active",
      "phone": "9876543210",
      "location": "Kochi",
      "startDate": "2026-08-20T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalEmployees": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 7. Employee Statistics

```json
{
  "success": true,
  "data": {
    "totalEmployees": 10,
    "activeEmployees": 8,
    "inactiveEmployees": 2,
    "totalSalary": 450000,
    "averageSalary": 45000,
    "highestSalary": 80000,
    "lowestSalary": 20000
  }
}
```

> The statistics above are example values only. Actual statistics are calculated dynamically from MongoDB.

---

# Error Responses

The API uses centralized error handling.

The standard error response format is:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Invalid MongoDB ID

### HTTP Status

```text
400 Bad Request
```

### Response

```json
{
  "success": false,
  "message": "Invalid ID format"
}
```

---

## Validation Error

### HTTP Status

```text
400 Bad Request
```

### Example Response

```json
{
  "success": false,
  "message": "Please enter a valid email"
}
```

---

## Duplicate Email

### HTTP Status

```text
400 Bad Request
```

### Response

```json
{
  "success": false,
  "message": "Duplicate value for email. email already exists."
}
```

---

## Unauthorized

### HTTP Status

```text
401 Unauthorized
```

### Response

```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

Returned when a request is made without a valid authentication token, including profile image upload and delete requests.

---

## Forbidden

### HTTP Status

```text
403 Forbidden
```

### Response

```json
{
  "success": false,
  "message": "Not authorized as admin"
}
```

Returned when an authenticated, non-admin user attempts an admin-only action such as profile image upload or delete.

---

## Invalid Image Type

### HTTP Status

```text
400 Bad Request
```

### Response

```json
{
  "success": false,
  "message": "Only JPG, PNG and WEBP images are allowed."
}
```

---

## Invalid Image Content

### HTTP Status

```text
400 Bad Request
```

### Response

```json
{
  "success": false,
  "message": "Only valid JPG, PNG and WEBP images are allowed."
}
```

Returned when the uploaded file's declared MIME type does not match its actual file content/signature.

---

## Image Size Exceeded

### HTTP Status

```text
400 Bad Request
```

### Response

```json
{
  "success": false,
  "message": "Image size must be less than 5MB"
}
```

---

## Employee Not Found

### HTTP Status

```text
404 Not Found
```

### Response

```json
{
  "success": false,
  "message": "Employee not found"
}
```

---

## Invalid Route

### HTTP Status

```text
404 Not Found
```

### Response

```json
{
  "success": false,
  "message": "Not found"
}
```

---

## Internal Server Error

### HTTP Status

```text
500 Internal Server Error
```

### Response

```json
{
  "success": false,
  "message": "Internal server error"
}
```

Technical database errors, stack traces, credentials, and other internal implementation details should not be exposed to API clients.

---

# Validation

Employee data is validated using Mongoose schema validation.

Validation includes:

- Required fields
- Email format
- Unique email
- Salary type and minimum value
- Employee status
- Phone number format
- Valid start date

Update operations also run Mongoose validators so that updated employee data follows the same validation rules.

---

# Error Handling

The API uses centralized error handling for common API errors, including:

- Invalid MongoDB ObjectId
- Employee not found
- Duplicate email
- Mongoose validation errors
- Database errors
- Unexpected server errors
- Invalid routes

API clients receive safe error messages without unnecessary internal technical details.

---

# Database

The application uses MongoDB with Mongoose for persistent employee storage.

Employee records are stored in MongoDB rather than an in-memory JavaScript array.

Changes made through the API persist after restarting the server.

---

# Notes

- Run both the backend and frontend for the complete application.
- Keep MongoDB credentials inside the `server/.env` file.
- Never commit `.env` to version control.
- Replace example MongoDB IDs with actual employee IDs when making API requests.
- The statistics endpoint calculates values dynamically from MongoDB.
- The search endpoint performs filtering through MongoDB rather than fetching all employees and filtering them in JavaScript.
- The employee list and search endpoints are paginated; the frontend requests only the current page of employees.
- Profile image upload and delete require an authenticated admin user and are restricted to JPG, PNG, and WEBP files up to 5 MB.
- Profile images are stored on the server filesystem under `server/uploads/employees/`; MongoDB stores only the path reference.