const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const PROFILE_IMAGE_MAX_SIZE = 5 * 1024 * 1024;

const PROFILE_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function validateProfileImage(file) {
  if (!file) {
    return { valid: false, message: "Profile image is required." };
  }

  if (!PROFILE_IMAGE_MIME_TYPES.has(file.type)) {
    return { valid: false, message: "Only JPG, PNG and WEBP images are allowed." };
  }

  if (file.size > PROFILE_IMAGE_MAX_SIZE) {
    return { valid: false, message: "Image size must be less than 5MB" };
  }

  return { valid: true, message: "" };
}

export function getProfileImageUrl(profileImage) {
  if (!profileImage) {
    return null;
  }

  if (/^https?:\/\//.test(profileImage)) {
    return profileImage;
  }

  return `${API_ORIGIN}${profileImage}`;
}
