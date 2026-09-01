const fs = require("fs");
const fsp = fs.promises;

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
        // Only the magic-byte header is required for detection.
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

        const error = new Error(
          "Only valid JPG, PNG and WEBP images are allowed."
        );
        error.status = 400;
        return next(error);
      }

      return next();
    } catch (error) {
      removeUploadedFile(req.file);
      return next(error);
    }
  })();
}

module.exports = { validateImageContent };
