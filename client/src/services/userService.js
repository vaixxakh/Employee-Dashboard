import { apiFetch } from "./apiClient";
import { getApiErrorMessage, throwApiError } from "../utils/apiError";

export const getEmployees = async (filters = {}, pagination = {}) => {
  try {
    const searchParams = new URLSearchParams();

    if (filters.status) {
      searchParams.append("status", filters.status);
    }

    if (filters.department) {
      searchParams.append("department", filters.department);
    }

    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    searchParams.append("page", page);
    searchParams.append("limit", limit);

    if (pagination.sort) {
      searchParams.append("sort", pagination.sort);
    }

    const response = await apiFetch(`/employees?${searchParams.toString()}`);

    if (!response.ok) {
      await throwApiError(response, "Failed to load employees. Please try again.");
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error("Invalid API response: expected an array of employees");
    }

    return {
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to load employees. Please try again."));
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await apiFetch(`/employees/${id}`);

    if (!response.ok) {
      await throwApiError(response, "Failed to load employee. Please try again.");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid API response");
    }

    return result.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to load employee. Please try again."));
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const response = await apiFetch("/employees", {
      method: "POST",
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      await throwApiError(response, "Failed to create employee. Please try again.");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid API response");
    }

    return result.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to create employee. Please try again."));
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await apiFetch(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      await throwApiError(response, "Failed to update employee. Please try again.");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid API response");
    }

    return result.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to update employee. Please try again."));
  }
};

export const searchEmployees = async (params = {}, pagination = {}, options = {}) => {
  try {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value) {
        searchParams.append(key, value);
      }
    }

    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    searchParams.append("page", page);
    searchParams.append("limit", limit);

    const response = await apiFetch(
      `/employees/search?${searchParams.toString()}`,
      {
        signal: options.signal,
      }
    );

    if (!response.ok) {
      await throwApiError(response, "Failed to search employees. Please try again.");
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data) || !result.pagination) {
      throw new Error("Invalid API response");
    }

    return {
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(getApiErrorMessage(error, "Failed to search employees. Please try again."));
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await apiFetch(`/employees/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      await throwApiError(response, "Failed to delete employee. Please try again.");
    }

    return true;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to delete employee. Please try again."));
  }
};

export const uploadEmployeeImage = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await apiFetch(`/employees/${id}/profile-image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      await throwApiError(response, "Failed to upload profile image. Please try again.");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid API response");
    }

    return result.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to upload profile image. Please try again."));
  }
};

export const deleteEmployeeImage = async (id) => {
  try {
    const response = await apiFetch(`/employees/${id}/profile-image`, {
      method: "DELETE",
    });

    if (!response.ok) {
      await throwApiError(response, "Failed to delete profile image. Please try again.");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid API response");
    }

    return result.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to delete profile image. Please try again."));
  }
};

export const getStatistics = async () => {
  try {
    const response = await apiFetch("/employees/statistics");

    if (!response.ok) {
      await throwApiError(response, "Failed to load statistics. Please try again.");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid API response");
    }

    return result.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to load statistics. Please try again."));
  }
};
