
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require('./config/db');


const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");

const { errorMiddleware } = require("./middleware/errorMiddleware");
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

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api", employeeRoutes);

app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
