import React from 'react';
import { getUsers } from '../services/userService'
import {saveEmployees } from '../utils/employeeStorage';

let inFlightEmployeesRequest = null;

function requestEmployees() {
  if (!inFlightEmployeesRequest) {
    inFlightEmployeesRequest = getUsers().finally(() => {
      inFlightEmployeesRequest = null;
    });
  }

  return inFlightEmployeesRequest;
}

export const useEmployees = () => {
      const [employees, setEmployees] = React.useState([]);
      const [isDirectoryLoading, setIsDirectoryLoading] =React.useState(true)
      const [loadError, setLoadError] = React.useState(false);
      const hasLocalChanges = React.useRef(false);

     const updateEmployees = React.useCallback((updatedEmployees) => {
        hasLocalChanges.current = true;
        setEmployees(updatedEmployees);

        if (!saveEmployees(updatedEmployees)) {
          console.error('Unable to save employee changes to local storage.');
        }
      }, []);

     const reloadEmployees = React.useCallback(async () => {
        setIsDirectoryLoading(true);
        setLoadError(false);
    
        try {
          const users = await requestEmployees();
    
          if (!hasLocalChanges.current) {
            setEmployees(users);
          }
        } catch (error) {
          setLoadError(true);
           console.error('Failed to fetch users from API:', error);
        } finally {
          setIsDirectoryLoading(false);
        }
      }, []);
    
       React.useEffect(() => {
    reloadEmployees();

  }, [reloadEmployees]);

  const handleDeleteEmployee = (employeeId) => {
      const employeeExists = employees.some(
        (employee) => employee.id === employeeId
      )

      if (!employeeExists) {
        return false
      }

      const updatedEmployees = employees.filter(
        (employee) => employee.id !== employeeId
      )

      updateEmployees(updatedEmployees)

      return true
    }

    return {
        employees, 
        updateEmployees,
        isDirectoryLoading,
        loadError,
        reloadEmployees,
        handleDeleteEmployee,
    }
} 
