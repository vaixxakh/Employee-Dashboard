import React from 'react';

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../services/userService'

import { mapUserToEmployee } from '../mappers/userMapper'
import { getInitials } from '../utils/getInitials';
import { getEmployees, saveEmployees } from '../utils/employeeStorage';

let inFlightEmployeesRequest = null;

function requestEmployees() {
  if (!inFlightEmployeesRequest) {
    inFlightEmployeesRequest = getUsers().finally(() => {
      inFlightEmployeesRequest = null;
    });
  }

  return inFlightEmployeesRequest;
}


function reconcileEmployees(apiEmployees, persistedEmployees) {
  const persistedById = new Map(
    persistedEmployees.map((employee) => [employee.id, employee])
  );
  const apiIds = new Set(apiEmployees.map((employee) => employee.id));

  const locallyCreatedEmployees = persistedEmployees.filter(
    (employee) => !apiIds.has(employee.id)
  );
  const persistedApiEmployees = apiEmployees
    .filter((employee) => persistedById.has(employee.id))
    .map((employee) => {
      const persistedEmployee = persistedById.get(employee.id);

      return hasEmployeeChanged(persistedEmployee, employee)
        ? persistedEmployee
        : employee;
    });

  return uniqueEmployees([...locallyCreatedEmployees, ...persistedApiEmployees]);
}

function hasEmployeeChanged(persistedEmployee, apiEmployee) {
  const persistedKeys = Object.keys(persistedEmployee);
  const apiKeys = Object.keys(apiEmployee);

  return persistedKeys.length !== apiKeys.length ||
    persistedKeys.some((key) => persistedEmployee[key] !== apiEmployee[key]) ||
    apiKeys.some((key) => persistedEmployee[key] !== apiEmployee[key]);
}

function uniqueEmployees(employees) {
  const employeeIds = new Set();

  return employees.filter((employee) => {
    if (employeeIds.has(employee.id)) {
      return false;
    }

    employeeIds.add(employee.id);
    return true;
  });
}

export const useEmployees = () => {
 
      const [employees, setEmployees] = React.useState(() => getEmployees());
      const [isDirectoryLoading, setIsDirectoryLoading] =React.useState(true)
      const [loadError, setLoadError] = React.useState(false);
      const persistedEmployeesRef = React.useRef(employees);
      const hasLocalChanges = React.useRef(employees.length > 0);

     const updateEmployees = React.useCallback((updatedEmployees) => {
        const uniqueUpdatedEmployees = uniqueEmployees(updatedEmployees);

        hasLocalChanges.current = true;
        persistedEmployeesRef.current = uniqueUpdatedEmployees;
        setEmployees(uniqueUpdatedEmployees);

        if (!saveEmployees(uniqueUpdatedEmployees)) {
          console.warn('Unable to persist employees to LocalStorage. Changes may not survive a refresh.');
        }
      }, []);

     const reloadEmployees = React.useCallback(async () => {
        setIsDirectoryLoading(true);
        setLoadError(false);
    
        try {
          const users = await requestEmployees();
    
          setEmployees(
            hasLocalChanges.current
              ? reconcileEmployees(users, persistedEmployeesRef.current)
              : users
          );
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
    const createdUser = await createUser(employeeData)

    if (!createdUser || !createdUser.id) {
      throw new Error('Invalid API response')
    }

    const mappedEmployee = mapUserToEmployee(createdUser)

    const newEmployee = {
      ...mappedEmployee,
      id: crypto.randomUUID(),
      apiId: createdUser.id,
      department: employeeData.department,
      salary: employeeData.salary,
      status: employeeData.status,
      location: employeeData.location,
      startDate: employeeData.startDate,
    }

    updateEmployees([newEmployee, ...employees])

    return newEmployee
  },
  [employees, updateEmployees]
);

const updateEmployee = React.useCallback(
  async (employeeId, employeeData) => {
    const employeeToEdit = employees.find(
      (employee) => String(employee.id )=== String(employeeId)
    )

    if (!employeeToEdit) {
      throw new Error('Employee not found')
    }

    if (typeof employeeToEdit.id !== 'number' ||
      !Number.isFinite(employeeToEdit.id)) {
      const updatedEmployee = {
        ...employeeToEdit,
        name: employeeData.name,
        email: employeeData.email,
        company: employeeData.company.name,
        department: employeeData.department,
        salary: employeeData.salary,
        status: employeeData.status,
        location: employeeData.location,
        startDate: employeeData.startDate,
        initials: getInitials(employeeData.name),
      }

      const updatedEmployees = employees.map((employee) =>
        String(employee.id) === String(employeeId)
          ? updatedEmployee
          : employee
      )

      updateEmployees(updatedEmployees)

      return updatedEmployee
    }

    const updatedUser = await updateUser(
      employeeToEdit.id,
      employeeData
    )

    if (!updatedUser || !updatedUser.id) {
      throw new Error('Invalid API response')
    }

    const mappedEmployee = mapUserToEmployee(updatedUser)

    const updatedEmployee = {
      ...mappedEmployee,
      id: employeeToEdit.id,

      department: employeeData.department,
      salary: employeeData.salary,
      status: employeeData.status,
      location: employeeData.location,
      startDate: employeeData.startDate,
    }

    const updatedEmployees = employees.map((employee) =>
      String(employee.id) === String(employeeId)
        ? updatedEmployee
        : employee
    )

    updateEmployees(updatedEmployees)

    return updatedEmployee
  },
  [employees, updateEmployees]
);

  const handleDeleteEmployee = async (employeeId) => {
      const employeeToDelete  = employees.find(
        (employee) => employee.id === employeeId
      );

      if (!employeeToDelete ) {
        return false
      }

      const isLocalEmployee =
        typeof employeeToDelete.id !== 'number' ||
        !Number.isFinite(employeeToDelete.id);

 
      if (!isLocalEmployee || employeeToDelete.apiId !== undefined) {
        await deleteUser(employeeToDelete.apiId ?? employeeToDelete.id);
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

        addEmployee,
        updateEmployee,
        handleDeleteEmployee,
    }
} 
