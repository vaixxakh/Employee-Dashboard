# Employee Management Dashboard

A full-stack Employee Management Dashboard with a React (Vite) frontend and a Node.js/Express REST API backend using MongoDB and Mongoose for persistent employee data.

The backend uses **centralized error handling** (custom `AppError`, `asyncHandler`, a global `errorMiddleware`, and a `notFound` fallback) and a **consistent JSON response format** for both success and error responses across all API endpoints.

## Tech Stack

### Frontend (`client/`)
- React
- React Router
- Vite
- Framer Motion
- React Toastify
- React Icons

### Backend (`server/`)
- Node.js
- Express.js
- Mongoose
- MongoDB
- Multer
- file-type
- CORS
- dotenv
- bcryptjs
- jsonwebtoken

### Development Tools
- Nodemon
- Oxlint

---

## Project Structure

```text
project-root/
├── client/                       # React frontend (ESM, Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── mappers/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env                       # Client environment (VITE_API_URL)
│   ├── package.json
│   └── vite.config.js
│
├── server/                       # Express REST API (CommonJS)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── employeeController.js
│   │   ├── data/
│   │   │   ├── seedAdmin.js
│   │   │   └── seedEmployees.js
│   │   ├── middleware/
│   │   │   ├── AppError.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   ├── imageContentValidator.js
│   │   │   ├── notFound.js
│   │   │   └── uploadMiddleware.js
│   │   ├── models/
│   │   │   ├── Employee.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── employeeRoutes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   │   └── employees/            # Uploaded profile images (git-ignored)
│   ├── .env                       # Server environment variables
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** and **npm** (a recent LTS version of Node.js)
- **MongoDB** — a running MongoDB instance or an Atlas connection string is required for the backend to start.

---

## Installation

The project contains separate frontend and backend applications, each with its own `package.json`.

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd client
npm install
```

---

## Environment Variables

### Server (`server/.env`)

The backend requires a `.env` file in the `server/` directory. Create one from the placeholders below:

```env
PORT=5000
MONGODBURI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
ADMIN_NAME=Admin Name
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

| Variable | Required | Description |
|---|---|---:|
| `PORT` | No | Port on which the Express server runs (default `5000`) |
| `MONGODBURI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWT tokens |
| `JWT_EXPIRES_IN` | No | JWT expiry (default `1d`) |
| `ADMIN_NAME` | Yes* | Name of the seeded Admin user |
| `ADMIN_EMAIL` | Yes* | Email of the seeded Admin user |
| `ADMIN_PASSWORD` | Yes* | Password of the seeded Admin user |

\* Required only when running `npm run seed:admin`.

### Client (`client/.env`)

The frontend reads the API base URL from `VITE_API_URL` (defaults to `http://localhost:5000/api`):

```env
VITE_API_URL=http://localhost:5000/api
```

> **Security:** Never commit your real MongoDB connection string, password, JWT secret, API keys, or other credentials to version control. The `.env` files are excluded via `.gitignore`.

---

## Running the Application

The backend and frontend should run simultaneously in separate terminals.

### Terminal 1 — Backend

Start the server:

```bash
cd server
npm start
```

For development with automatic restart (Nodemon):

```bash
cd server
npm run dev
```

Build the backend API during development:

```bash
cd server
npm run build
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

The frontend (Vite dev server) runs on:

```text
http://localhost:5173
```

Other frontend scripts:

```bash
npm run build     # Production build
npm run lint      # Run Oxlint
npm run preview   # Preview the production build
```

---

## Seeding Data

### Seed sample employees

```bash
cd server
npm run seed
```

The seed script clears the existing employee data and inserts the sample employees into MongoDB.

Employee records can also be created through:

- The frontend employee creation form
- The REST API using `POST /api/employees` (see request examples below)

### Seed an Admin user

```bash
cd server
npm run seed:admin
```

This creates an Admin user from the `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` environment variables. It requires those three variables to be set and does nothing if an Admin user already exists.

---

# API Documentation

Base API URL:

```text
http://localhost:5000/api
```

## Response Format

All API responses follow a consistent format.

### Success

```json
{
  "success": true,
  "message": "...",
  "data": ...
}
```

`data` is omitted on some actions (e.g. a plain confirmation), and paginated endpoints include an additional `pagination` object **alongside** `data` (not inside it).

### Error

```json
{
  "success": false,
  "message": "...",
  "code": "..."
}
```

Every error response includes a stable `code` for programmatic handling (except unexpected `500 Internal Server Error` responses, which do not include a `code`).

## API Endpoints

| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public | — |
| POST | `/api/auth/login` | Log in and receive a JWT token | Public | — |
| GET | `/api/employees` | Get paginated employees (`page`, `limit`, `sort`, `status`, `department`) | Protected | any |
| GET | `/api/employees/search` | Search employees (`name`, `email`, `department`, `status`, `query`) | Protected | any |
| GET | `/api/employees/statistics` | Get employee statistics | Protected | any |
| GET | `/api/employees/:id` | Get an employee by MongoDB ID | Protected | any |
| POST | `/api/employees` | Create a new employee | Protected | Admin |
| PUT | `/api/employees/:id` | Update an employee | Protected | Admin |
| DELETE | `/api/employees/:id` | Delete an employee | Protected | Admin |
| POST | `/api/employees/:id/profile-image` | Upload a profile image for an employee | Protected | Admin |
| DELETE | `/api/employees/:id/profile-image` | Delete an employee's profile image | Protected | Admin |

Protected endpoints require a valid `Authorization: Bearer <token>` header.

---

# Authentication

The API uses **JWT-based authentication**.

- `POST /api/auth/register` and `POST /api/auth/login` are public.
- All other employee endpoints require a valid JWT token (`protect` middleware).
- On login, the server returns a signed `token` plus a safe user payload (`id`, `name`, `email`, `role`).
- **Role-based authorization:** Employee create/update/delete and profile-image upload/delete require the `Admin` role (`authorize("Admin")`).
- **Read-only** employee endpoints (list, get, search, statistics) are available to any authenticated user (Admin or Employee).
- `User.role` is one of `Admin` or `Employee` (default `Employee`).

### Authentication failures (`401`)

- Missing or malformed `Authorization` header → `AUTH_REQUIRED`
- Expired token → `TOKEN_EXPIRED`
- Invalid token → `INVALID_TOKEN`
- Logged-in user was not found → `USER_NOT_FOUND`
- Invalid login credentials → `INVALID_CREDENTIALS`

### Authorization failures (`403`)

- An authenticated, non-admin user attempts an admin-only action → `FORBIDDEN`

---

# Centralized Error Handling

The backend centralizes error handling so API clients always receive a consistent, safe error format.

### `AppError` (`server/src/middleware/AppError.js`)

A custom error class carrying a `message`, an HTTP `statusCode`, and a stable `code`. Controllers throw `AppError` for expected business/validation failures.

### `asyncHandler` (`server/src/middleware/asyncHandler.js`)

Wraps `async` route handlers and forwards any rejected promise to the centralized error middleware, avoiding repetitive `try/catch` blocks.

### `errorMiddleware` (`server/src/middleware/errorMiddleware.js`)

The Express error-handling middleware (registered last in `app.js`). It maps errors to the standard error response:

- `AppError` → its `statusCode` and `code`
- Mongoose `ValidationError` → `400 VALIDATION_ERROR`
- Mongoose duplicate key (`11000`) → `409 DUPLICATE_RESOURCE`
- Mongoose `CastError` → `400 INVALID_ID`
- Unknown/unexpected errors → `500` "Internal server error"

Sensitive internal details (stack traces, database connection details, credentials) are never sent to clients.

### `notFound` (`server/src/middleware/notFound.js`)

Registered after all API routes. Any unmatched request returns `404` with `code: "ROUTE_NOT_FOUND"`.

---

# HTTP Status Codes

| Status | Meaning |
|---|---|
| `200` | OK |
| `201` | Created |
| `400` | Bad input / validation error |
| `401` | Unauthenticated |
| `403` | Forbidden / insufficient permission |
| `404` | Resource or route not found |
| `409` | Duplicate / conflict |
| `500` | Unexpected server error |

---

# Error Codes

| Code | HTTP Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Invalid or missing input |
| `INVALID_ID` | 400 | Invalid MongoDB ObjectId |
| `INVALID_EMPLOYEE_DATA` | 400 | Invalid employee/list/search data |
| `INVALID_IMAGE_TYPE` | 400 | File is not a valid JPG/PNG/WEBP image |
| `PROFILE_IMAGE_REQUIRED` | 400 | Profile image upload missing the image file |
| `INVALID_PROFILE_IMAGE_PATH` | 400 | Stored profile image path is invalid |
| `INVALID_CREDENTIALS` | 401 | Bad email/password on login |
| `AUTH_REQUIRED` | 401 | Missing or invalid authentication |
| `INVALID_TOKEN` | 401 | Invalid authentication token |
| `TOKEN_EXPIRED` | 401 | Expired authentication token |
| `USER_NOT_FOUND` | 401 | Authenticated user not found |
| `FORBIDDEN` | 403 | Authenticated user lacks permission |
| `ROUTE_NOT_FOUND` | 404 | Unknown route |
| `EMPLOYEE_NOT_FOUND` | 404 | Employee does not exist |
| `DUPLICATE_RESOURCE` | 409 | Duplicate database field value |
| `EMAIL_ALREADY_EXISTS` | 409 | Email already registered |
| `EMPLOYEE_ALREADY_EXISTS` | 409 | Employee with that email already exists |

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
| `status` | none | Optional. Filter by employee `status` |
| `department` | none | Optional. Filter by `department` |

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
→ Skips the first 10 employees and returns the next 10.

```http
GET /api/employees?page=3&limit=10
```
→ Skips the first 20 employees and returns the next 10.

The number of records skipped is calculated as `skip = (page - 1) * limit`.

### Pagination Response

Every paginated endpoint returns the same metadata shape (placed **alongside** `data`, not inside it):

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

---

# Search Employees

The search endpoint performs case-insensitive MongoDB filtering and combines all provided conditions (`AND`).

```http
GET /api/employees/search?name=rahul
GET /api/employees/search?email=rahul@gmail.com
GET /api/employees/search?department=Backend
GET /api/employees/search?status=Active
GET /api/employees/search?name=rahul&department=Backend
```

Supported parameters: `name`, `email`, `department`, `status`, and `query`. The search endpoint supports the same pagination parameters (`page`, `limit`) as the list endpoint. Invalid `page` or `limit` values return `400 Bad Request`. Paginated search responses include the same `pagination` metadata object as the list endpoint.

---

# Employee Data Model

| Field | Type | Required | Validation |
|---|---|---|---:|
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
7. The uploaded file is validated both by its **MIME type** and by its **actual file signature/content** (via `file-type`).
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

Actual file content/signature validation is also performed on the uploaded file, so the declared MIME type alone is not trusted as proof of file type.

## Maximum File Size

- **Maximum:** 5 MB
- **Exact backend limit:** `5 * 1024 * 1024` bytes (`LIMIT_FILE_SIZE`)

Files larger than this limit are rejected.

## Upload Endpoint

```http
POST /api/employees/:id/profile-image
```

Requirements:

- Authentication required (`Authorization: Bearer <token>`)
- Admin role required
- Request must use `multipart/form-data`
- File field name: `profileImage`

Example response:

```json
{
  "success": true,
  "message": "Profile image updated successfully",
  "data": {
    "profileImage": "/uploads/employees/1785345600000-6f2c4a9e-3a5b-4c0d-9e1f-2b8a7c6d5e4f.jpg"
  }
}
```

## Delete Endpoint

```http
DELETE /api/employees/:id/profile-image
```

Requirements:

- Authentication required
- Admin role required
- Deletes the stored profile image and clears `Employee.profileImage`

If the employee has no profile image, it returns `200` with `message: "No profile image to delete."`. Otherwise it removes the stored file and clears the path:

```json
{
  "success": true,
  "message": "Profile image deleted successfully",
  "data": {
    "profileImage": ""
  }
}
```

## Where Files Are Stored

```text
server/uploads/employees/
```

- Files are stored on the server filesystem.
- The directory is exposed through the `/uploads` static route.
- Filenames are generated server-side using a timestamp + UUID combination.
- Original filenames are not used for storage.
- The uploads directory is git-ignored.

---

# Request Examples

## 1. Register User

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "password": "yourpassword"
}
```

## 2. Login User

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "rahul@example.com",
  "password": "yourpassword"
}
```

## 3. Create Employee

```http
POST /api/employees
Authorization: Bearer <token>
Content-Type: application/json
```

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

## 4. Get Employees (Paginated)

```http
GET /api/employees?page=1&limit=10
Authorization: Bearer <token>
```

`page` defaults to `1` and `limit` defaults to `10`. See the Pagination section for validation rules.

## 5. Get Employee by ID

```http
GET /api/employees/65f000000000000000000001
Authorization: Bearer <token>
```

Replace the example ID with an actual employee MongoDB ID.

## 6. Update Employee

```http
PUT /api/employees/65f000000000000000000001
Authorization: Bearer <token>
Content-Type: application/json
```

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

## 7. Delete Employee

```http
DELETE /api/employees/65f000000000000000000001
Authorization: Bearer <token>
```

## 8. Search Employees

```http
GET /api/employees/search?name=rahul
GET /api/employees/search?email=rahul@gmail.com
GET /api/employees/search?department=Backend
GET /api/employees/search?query=rahul&page=1&limit=10
Authorization: Bearer <token>
```

## 9. Get Employee Statistics

```http
GET /api/employees/statistics
Authorization: Bearer <token>
```

## 10. Upload Employee Profile Image

```http
POST /api/employees/65f000000000000000000001/profile-image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

The request body contains the image file in the `profileImage` field. See the [Employee Profile Image Upload](#employee-profile-image-upload) section for file type and size requirements.

## 11. Delete Employee Profile Image

```http
DELETE /api/employees/65f000000000000000000001/profile-image
Authorization: Bearer <token>
```

---

# Response Examples

## 1. Login

```json
{
  "success": true,
  "message": "User logged in successfully",
  "token": "<jwt>",
  "data": {
    "id": "65f000000000000000000001",
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "role": "Admin"
  }
}
```

## 2. Get Employees (Paginated)

```json
{
  "success": true,
  "message": "Employees fetched successfully",
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

## 3. Create Employee

```json
{
  "success": true,
  "message": "Employee created successfully",
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

## 4. Employee Statistics

```json
{
  "success": true,
  "message": "Statistics fetched successfully",
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

The API uses centralized error handling. The standard error response format is:

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

## Invalid MongoDB ID

- **HTTP Status:** `400 Bad Request`
- **Code:** `INVALID_ID`

```json
{
  "success": false,
  "message": "Invalid ID format",
  "code": "INVALID_ID"
}
```

## Validation Error

- **HTTP Status:** `400 Bad Request`
- **Code:** `VALIDATION_ERROR`

```json
{
  "success": false,
  "message": "Please enter a valid email",
  "code": "VALIDATION_ERROR"
}
```

## Duplicate Resource (Database)

- **HTTP Status:** `409 Conflict`
- **Code:** `DUPLICATE_RESOURCE`

```json
{
  "success": false,
  "message": "Email already exists",
  "code": "DUPLICATE_RESOURCE"
}
```

## Employee Already Exists

- **HTTP Status:** `409 Conflict`
- **Code:** `EMPLOYEE_ALREADY_EXISTS`

Returned when creating an employee whose `email` already exists.

## Invalid Credentials

- **HTTP Status:** `401 Unauthorized`
- **Code:** `INVALID_CREDENTIALS`

```json
{
  "success": false,
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

## Authentication Required

- **HTTP Status:** `401 Unauthorized`
- **Code:** `AUTH_REQUIRED`

Returned when a request is made without a valid authentication token (including profile image upload and delete requests).

## Invalid / Expired Token

- **HTTP Status:** `401 Unauthorized`
- **Code:** `INVALID_TOKEN` / `TOKEN_EXPIRED`

## Forbidden

- **HTTP Status:** `403 Forbidden`
- **Code:** `FORBIDDEN`

```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "code": "FORBIDDEN"
}
```

Returned when an authenticated, non-admin user attempts an admin-only action such as employee creation/update/delete or profile image upload/delete.

## Invalid Image Type

- **HTTP Status:** `400 Bad Request`
- **Code:** `INVALID_IMAGE_TYPE`

```json
{
  "success": false,
  "message": "Only valid JPG, PNG and WEBP images are allowed.",
  "code": "INVALID_IMAGE_TYPE"
}
```

## Image Size Exceeded

- **HTTP Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Image size must be less than 5MB"
}
```

## Employee Not Found

- **HTTP Status:** `404 Not Found`
- **Code:** `EMPLOYEE_NOT_FOUND`

```json
{
  "success": false,
  "message": "Employee not found",
  "code": "EMPLOYEE_NOT_FOUND"
}
```

## Invalid Route

- **HTTP Status:** `404 Not Found`
- **Code:** `ROUTE_NOT_FOUND`

```json
{
  "success": false,
  "message": "Route not found",
  "code": "ROUTE_NOT_FOUND"
}
```

## Internal Server Error

- **HTTP Status:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Internal server error"
}
```

Technical database errors, stack traces, credentials, and other internal implementation details are not exposed to API clients.

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

# Database

The application uses MongoDB with Mongoose for persistent employee storage.

Employee records are stored in MongoDB rather than an in-memory JavaScript array.

Changes made through the API persist after restarting the server.

---

# Notes

- Run both the backend and frontend for the complete application.
- Keep MongoDB credentials and other secrets inside the `server/.env` file.
- Never commit `.env` to version control.
- Replace example MongoDB IDs with actual employee IDs when making API requests.
- The statistics endpoint calculates values dynamically from MongoDB.
- The search endpoint performs filtering through MongoDB rather than fetching all employees and filtering them in JavaScript.
- The employee list and search endpoints are paginated; the frontend requests only the current page of employees.
- Profile image upload and delete require an authenticated admin user and are restricted to JPG, PNG, and WEBP files up to 5 MB.
- Profile images are stored on the server filesystem under `server/uploads/employees/`; MongoDB stores only the path reference.
