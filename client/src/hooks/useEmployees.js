import React from 'react';

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../services/userService'

import { mapApiEmployeeToFrontend } from '../mappers/userMapper'

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const INITIAL_PAGINATION = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
  totalEmployees: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

let inFlightEmployeesRequest = null;

function requestEmployees(pagination = {}) {
  const page = pagination.page ?? DEFAULT_PAGE;
  const limit = pagination.limit ?? DEFAULT_LIMIT;
  const requestKey = `${page}:${limit}`;

  if (!inFlightEmployeesRequest || inFlightEmployeesRequest.requestKey !== requestKey) {
    const promise = getEmployees({}, { page, limit })
      .then((result) => {
        if (!result.pagination) {
          throw new Error('Invalid API response: missing pagination metadata');
        }

        return {
          data: result.data.map(mapApiEmployeeToFrontend),
          pagination: result.pagination,
        };
      })
      .finally(() => {
        if (inFlightEmployeesRequest && inFlightEmployeesRequest.promise === promise) {
          inFlightEmployeesRequest = null;
        }
      });

    inFlightEmployeesRequest = { requestKey, promise };
  }

  return inFlightEmployeesRequest.promise;
}

export const useEmployees = () => {

      const [employees, setEmployees] = React.useState([]);
      const [pagination, setPagination] = React.useState(INITIAL_PAGINATION);
      const [isDirectoryLoading, setIsDirectoryLoading] = React.useState(true);
      const [loadError, setLoadError] = React.useState(false);

      const paginationRef = React.useRef(pagination);
      paginationRef.current = pagination;

     const reloadEmployees = React.useCallback(async (paginationRequest = null) => {
        setIsDirectoryLoading(true);
        setLoadError(false);

        try {
          const { data: mapped, pagination: newPagination } = await requestEmployees(
            paginationRequest || {
              page: paginationRef.current.page,
              limit: paginationRef.current.limit,
            }
          );
          setEmployees(mapped);
          setPagination(newPagination);
        } catch  {
          setLoadError(true);
        } finally {
          setIsDirectoryLoading(false);
        }
      }, []);

       React.useEffect(() => {
    reloadEmployees();

  }, [reloadEmployees]);

const setCurrentPage = React.useCallback(
  (page) => {
    return reloadEmployees({
      page,
      limit: paginationRef.current.limit,
    })
  },
  [reloadEmployees]
);

const addEmployee = React.useCallback(
  async (employeeData) => {
    const createdEmployee = await createEmployee(employeeData)

    if (!createdEmployee || (!createdEmployee.id && !createdEmployee._id)) {
      throw new Error('Invalid API response')
    }

    const mappedEmployee = mapApiEmployeeToFrontend(createdEmployee)

    await reloadEmployees({
      page: paginationRef.current.page,
      limit: paginationRef.current.limit,
    })

    return mappedEmployee
  },
  [reloadEmployees]
);

const updateEmployeeById = React.useCallback(
  async (employeeId, employeeData) => {
    const updatedApiEmployee = await updateEmployee(employeeId, employeeData)

    if (!updatedApiEmployee || (!updatedApiEmployee.id && !updatedApiEmployee._id)) {
      throw new Error('Invalid API response')
    }

    const mappedEmployee = mapApiEmployeeToFrontend(updatedApiEmployee)

    await reloadEmployees({
      page: paginationRef.current.page,
      limit: paginationRef.current.limit,
    })

    return mappedEmployee
  },
  [reloadEmployees]
);

  const handleDeleteEmployee = React.useCallback(async (employeeId) => {
      const deleted = await deleteEmployee(employeeId)

      if (!deleted) {
        return false
      }

      await reloadEmployees({
        page: paginationRef.current.page,
        limit: paginationRef.current.limit,
      })

      return true
    }, [reloadEmployees])

    return {
        employees,
        pagination,
        currentPage: pagination.page,

        isDirectoryLoading,
        loadError,
        reloadEmployees,
        setCurrentPage,

        addEmployee,
        updateEmployee: updateEmployeeById,
        handleDeleteEmployee,
    }
}