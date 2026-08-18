import React from 'react';

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../services/userService'

import { mapApiEmployeeToFrontend } from '../mappers/userMapper'

let inFlightEmployeesRequest = null;

function requestEmployees() {
  if (!inFlightEmployeesRequest) {
    inFlightEmployeesRequest = getEmployees().finally(() => {
      inFlightEmployeesRequest = null;
    });
  }

  return inFlightEmployeesRequest;
}

export const useEmployees = () => {

      const [employees, setEmployees] = React.useState([]);
      const [isDirectoryLoading, setIsDirectoryLoading] = React.useState(true);
      const [loadError, setLoadError] = React.useState(false);

     const reloadEmployees = React.useCallback(async () => {
        setIsDirectoryLoading(true);
        setLoadError(false);

        try {
          const apiEmployees = await requestEmployees();
          const mapped = apiEmployees.map(mapApiEmployeeToFrontend);
          setEmployees(mapped);
        } catch  {
          setLoadError(true);
        } finally {
          setIsDirectoryLoading(false);
        }
      }, []);

       React.useEffect(() => {
    reloadEmployees();

  }, [reloadEmployees]);

const addEmployee = React.useCallback(
  async (employeeData) => {
    const createdEmployee = await createEmployee(employeeData)

    if (!createdEmployee || !createdEmployee.id) {
      throw new Error('Invalid API response')
    }

    const mappedEmployee = mapApiEmployeeToFrontend(createdEmployee)

    setEmployees((prev) => [mappedEmployee, ...prev])

    return mappedEmployee
  },
  []
);

const updateEmployeeById = React.useCallback(
  async (employeeId, employeeData) => {
    const updatedApiEmployee = await updateEmployee(employeeId, employeeData)

    if (!updatedApiEmployee || !updatedApiEmployee.id) {
      throw new Error('Invalid API response')
    }

    const mappedEmployee = mapApiEmployeeToFrontend(updatedApiEmployee)

    setEmployees((prev) =>
      prev.map((employee) =>
        String(employee.id) === String(employeeId)
          ? mappedEmployee
          : employee
      )
    )

    return mappedEmployee
  },
  []
);

  const handleDeleteEmployee = React.useCallback(async (employeeId) => {
      const deleted = await deleteEmployee(employeeId)

      if (!deleted) {
        return false
      }

      setEmployees((prev) =>
        prev.filter((employee) => employee.id !== employeeId)
      )

      return true
    }, [])

    return {
        employees,

        isDirectoryLoading,
        loadError,
        reloadEmployees,

        addEmployee,
        updateEmployee: updateEmployeeById,
        handleDeleteEmployee,
    }
}
