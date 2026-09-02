const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

/**
 * Extract a safe, user-facing error message from any error value.
 *
 * Handles:
 * - Backend API errors (message extracted from error.message)
 * - Axios-style errors (error.response.data.message)
 * - Network errors (no response, TypeError)
 * - Regular JavaScript Error objects
 * - Errors with no message
 * - Unknown/non-error values
 *
 * Never exposes: stack traces, internal objects, DB errors,
 * filesystem paths, JWTs, passwords, env vars, or connection strings.
 */
export function getApiErrorMessage(error, fallbackMessage = DEFAULT_ERROR_MESSAGE) {
  if (!error) {
    return fallbackMessage;
  }

  // Axios-style: error.response.data.message
  if (
    error.response &&
    error.response.data &&
    typeof error.response.data.message === "string" &&
    error.response.data.message.trim()
  ) {
    return error.response.data.message;
  }

  // Standard Error or any object with a meaningful .message property
  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  // Error value is a plain string
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallbackMessage;
}

/**
 * Parse a non-ok API response and throw a safe error.
 * Extracts the backend errorBody.message from the JSON response,
 * falling back to the provided fallbackMessage.
 *
 * Usage:
 *   if (!response.ok) {
 *     await throwApiError(response, "Failed to load data.");
 *   }
 */
export async function throwApiError(response, fallbackMessage = DEFAULT_ERROR_MESSAGE) {
  const errorBody = await response.json().catch(() => null);
  const message = getApiErrorMessage(errorBody, fallbackMessage);
  throw new Error(message);
}
