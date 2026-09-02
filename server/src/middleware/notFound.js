function notFound(req, res, _next) {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    code: "ROUTE_NOT_FOUND",
  });
}

module.exports = { notFound };
