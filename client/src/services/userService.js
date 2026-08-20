const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getEmployees = async (filters = {}) => {
  try {
    const searchParams = new URLSearchParams();
    if (filters.status) searchParams.append('status', filters.status);
    if (filters.department) searchParams.append('department', filters.department);

    const queryString = searchParams.toString();
    const url = queryString
      ? `${API_BASE}/employees?${queryString}`
      : `${API_BASE}/employees`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error("Invalid API response: expected an array of employees");
    }

    return result.data;
  } catch (error) {
    throw new Error(`Failed to fetch employees: ${error.message}`);
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const response = await fetch(`${API_BASE}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(
        errorBody?.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid API response");
    }

    return result.data;
  } catch (error) {
    throw new Error(`Failed to create employee: ${error.message}`);
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await fetch(`${API_BASE}/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(
        errorBody?.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid API response");
    }

    return result.data;
  } catch (error) {
    throw new Error(`Failed to update employee: ${error.message}`);
  }
};

export const searchEmployees = async (params, options = {}) => {
  try {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        searchParams.append(key, value);
      }
    }

    const response = await fetch(
      `${API_BASE}/employees/search?${searchParams.toString()}`,
      { signal: options.signal }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error("Invalid API response");
    }

    return result.data;
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(`Failed to search employees: ${error.message}`);
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/employees/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(
        errorBody?.message || `HTTP error! status: ${response.status}`
      );
    }

    return true;
  } catch (error) {
    throw new Error(`Failed to delete employee: ${error.message}`);
  }
};

export const getStatistics = async () => {
  try {
    const response = await fetch(`${API_BASE}/employees/statistics`);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(
        errorBody?.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid API response");
    }

    return result.data;
  } catch (error) {
    throw new Error(`Failed to fetch statistics: ${error.message}`);
  }
};
