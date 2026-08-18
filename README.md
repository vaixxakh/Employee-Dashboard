# Employee Management Dashboard

A full-stack Employee Management Dashboard with a React (Vite) frontend and a Node.js/Express REST API backend.

## Project Structure

```
project-root/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── mappers/
│   │   ├── utils/
│   │   ├── data/
│   │   ├── App.jsx
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/          # Express REST API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── data/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
└── README.md
```

## Getting Started

### Backend

```bash
cd server
npm install
npm start
```

The server runs on `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| GET    | /api/employees         | List all employees       |
| GET    | /api/employees/:id     | Get employee by ID       |
| POST   | /api/employees         | Create a new employee    |
| PUT    | /api/employees/:id     | Update an employee       |
| DELETE | /api/employees/:id     | Delete an employee       |
