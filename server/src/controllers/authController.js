const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { AppError } = require("../middleware/AppError");


function buildSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function registerUser(req, res, next) {
  const body = req.body || {};
  const { name, email, password } = body;

  if (!name || !email || !password) {
    throw new AppError(
      "Name, email and password are required",
      400,
      "VALIDATION_ERROR"
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError(
      "Email already exists",
      409,
      "EMAIL_ALREADY_EXISTS"
    );
  }

  const user = new User({
    name,
    email,
    password,
  });

  const savedUser = await user.save();

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: buildSafeUser(savedUser),
  });
}

async function loginUser(req, res, next) {
  const body = req.body || {};
  const { email, password } = body;

  if (!email || !password) {
    throw new AppError(
      "Email and password are required",
      400,
      "VALIDATION_ERROR"
    );
  }

  const user = await User.findOne({ email });


  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email or password",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token,
    data: buildSafeUser(user),
  });
}

module.exports = {
  registerUser,
  loginUser,
};
