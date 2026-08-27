
const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');


const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");

const { errorHandler } = require("./middleware/errorHandler");
const { notFound } = require('./middleware/notFound');

const app = express();

connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", employeeRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
