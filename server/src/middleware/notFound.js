function notFound(req, res, next) {
  const error = new Error("Not found");
  error.statusCode = 404;
  next(error);
}

module.exports = { notFound };
