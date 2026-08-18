function errorHandler(err, req, res, _next) {
  console.error("Unhandled error:", err);

  const statusCode = err.statusCode || err.status || 500;

  if (statusCode >= 500) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "An error occurred",
  });
}

module.exports = { errorHandler };
