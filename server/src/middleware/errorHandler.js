function errorHandler(err, req, res, _next) {
  console.error("Error:", err.message);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);

    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    return res.status(400).json({
      success: false,
      message: `Duplicate value for ${field}. ${field} already exists.`,
    });
  }

  if (err.name === "CastError") {
    if (err.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid request data",
    });
  }

  const statusCode = err.statusCode || err.status || 500;

  return res.status(statusCode).json({
    success: false,
    message: statusCode >= 500
      ? "Internal server error"
      : err.message || "Request failed",
  });
}

module.exports = { errorHandler };