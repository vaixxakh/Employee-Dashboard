const { AppError } = require("./AppError");

function buildValidationMessage(err) {
  const messages =
    err.errors && typeof err.errors === "object"
      ? Object.values(err.errors)
          .map((e) => e && e.message)
          .filter(Boolean)
      : [];

  return messages.length > 0
    ? messages.join(", ")
    : "Invalid data provided";
}

function buildDuplicateKeyMessage(err) {
  const field = Object.keys(err.keyValue || err.keyPattern || {})[0];

  if (field === "email") {
    return "Email already exists";
  }

  return "A record with this value already exists";
}

function errorMiddleware(err, req, res, next) {
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (res.headersSent) {
    return next(err);
  }

  if (isDevelopment) {
    console.error("Error:", err.message);
    if (err.stack) console.error(err.stack);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: buildValidationMessage(err),
      code: "VALIDATION_ERROR",
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: buildDuplicateKeyMessage(err),
      code: "DUPLICATE_RESOURCE",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
      code: "INVALID_ID",
    });
  }

  if (!isDevelopment) {
    console.error("Unhandled error:", err.name);
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

module.exports = { errorMiddleware };