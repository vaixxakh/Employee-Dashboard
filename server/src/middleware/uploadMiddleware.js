const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const UPLOAD_DIRECTORY = path.join(__dirname, "..", "..", "uploads", "employees");
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const MIME_TO_EXTENSION = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIRECTORY);
  },
  filename: (_req, file, cb) => {
    const safeExtension = MIME_TO_EXTENSION[file.mimetype] || "";
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${safeExtension}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  if (MIME_TO_EXTENSION[file.mimetype]) {
    return cb(null, true);
  }

  const error = new Error("Only JPG, PNG and WEBP images are allowed.");
  error.status = 400;
  cb(error, false);
};

const rawUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter,
});

function normalizeUploadError(err, req, res, next) {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    const error = new Error("Image size must be less than 5MB");
    error.status = 400;
    return next(error);
  }

  return next(err);
}

function uploadEmployeeImage(fieldName) {
  const single = rawUpload.single(fieldName);

  return (req, res, next) => {
    single(req, res, (err) => normalizeUploadError(err, req, res, next));
  };
}

uploadEmployeeImage.single = (fieldName) => uploadEmployeeImage(fieldName);

module.exports = { uploadEmployeeImage };
