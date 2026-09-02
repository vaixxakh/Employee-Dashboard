const fs = require("fs");
const fsp = fs.promises;
const { AppError } = require("./AppError");

const ALLOWED_IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);

const HEADER_BYTES_TO_READ = 128;

function removeUploadedFile(file) {
  if (!file || !file.path) {
    return;
  }

  fs.unlink(file.path, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Unable to remove rejected upload:", err.message);
    }
  });
}

function validateImageContent(req, res, next) {
  if (!req.file) {
    return next();
  }

  (async () => {
    let buffer;

    try {
      buffer = await fsp.readFile(req.file.path, {
        
        length: HEADER_BYTES_TO_READ,
      });
    } catch (error) {
      removeUploadedFile(req.file);
      return next(error);
    }

    try {
      const { fileTypeFromBuffer } = await import("file-type");
      const detected = await fileTypeFromBuffer(buffer);

      const accepted =
        detected &&
        ALLOWED_IMAGE_MIMES.has(detected.mime) &&
        ALLOWED_IMAGE_MIMES.has(req.file.mimetype) &&
        detected.mime === req.file.mimetype;

      if (!accepted) {
        removeUploadedFile(req.file);

        throw new AppError(
          "Only valid JPG, PNG and WEBP images are allowed.",
          400,
          "INVALID_IMAGE_TYPE"
        );
      }

      return next();
    } catch (error) {
      removeUploadedFile(req.file);
      return next(error);
    }
  })();
}

module.exports = { validateImageContent };
