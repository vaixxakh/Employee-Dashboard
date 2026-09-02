const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AppError } = require("./AppError");

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(
      "Authentication required",
      401,
      "AUTH_REQUIRED"
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError(
      "Authentication required",
      401,
      "AUTH_REQUIRED"
    );
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError(
        "Authentication token expired",
        401,
        "TOKEN_EXPIRED"
      );
    }

    throw new AppError(
      "Invalid authentication token",
      401,
      "INVALID_TOKEN"
    );
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new AppError(
      "Authentication required",
      401,
      "USER_NOT_FOUND"
    );
  }

  req.user = user;
  next();
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError(
        "Authentication required",
        401,
        "AUTH_REQUIRED"
      );
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        "You do not have permission to perform this action",
        403,
        "FORBIDDEN"
      );
    }

    next();
  };
}

module.exports = { protect, authorize };
