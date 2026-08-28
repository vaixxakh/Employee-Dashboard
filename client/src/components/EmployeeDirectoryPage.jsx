import EmployeeList from './EmployeeList'
import FilterLoader from './FilterLoader'
import SearchLoader from './SearchLoader'
import PageLoader from './PageLoader'
import PaginationControls from './PaginationControls'
import useDirectoryFilters from '../hooks/useDirectoryFilters'
import { useAuth } from '../hooks/useAuth'
import { useEmployeeData } from '../context/EmployeeContext'
import {FiPlus} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const departments = ['All', 'Frontend', 'Backend', 'Testing', 'Full Stack','UI/UX', 'HR', 'QA']

export default function EmployeeDirectoryPage() {
  const { employees = [], pagination = {}, currentPage = 1, setCurrentPage, isDirectoryLoading, loadError, reloadEmployees } = useEmployeeData() || {}
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  const {
    department,
    status,
    filteredEmployees,
    filterPagination,
    searchPagination,
    setSearchPage,
    isLoading: isFilterLoading,
    loadingType,
    searchTerm,
    updateDepartment,
    updateStatus,
    updateSearch,
  } = useDirectoryFilters(employees, currentPage, setCurrentPage, pagination)

  const navigate = useNavigate();

  const hasEmployees = employees.length > 0
  const hasFilteredResults = filteredEmployees.length > 0
  const hasActiveFilters = department !== 'All' || status !== 'All'
  const hasActiveSearch = Boolean(searchTerm.trim())

  const displayPagination =
    hasActiveSearch && searchPagination
      ? searchPagination
      : hasActiveFilters && filterPagination
        ? filterPagination
        : pagination

  const showPaginationControls =
    !isDirectoryLoading &&
    !loadError &&
    !isFilterLoading &&
    (displayPagination.totalEmployees || 0) > 0 &&
    (hasActiveSearch
      ? Boolean(searchPagination)
      : hasActiveFilters
        ? hasFilteredResults
        : hasEmployees)

  return (
    <>
      <section className="page-heading">
        <Link className="back-link" to="/">&larr; Back to dashboard</Link>
        <p className="eyebrow">PEOPLE</p>
        
          <h1>Employees</h1>

        <div className="page-heading-content">
          <p>Browse your organization's employee directory.</p>
          {isAdmin && (
            <button
              className="primary-button"
              onClick={() => navigate("/employees/add")}
            >
              <FiPlus size={18} />
              <span>Add Employee</span>
            </button>
          )}
          </div>
      </section>

      <section className="panel">
        <div className="directory-filters">
          <label className="search-box" htmlFor="employee-search">
            <span aria-hidden="true">Search</span>
            <input id="employee-search" type="search" value={searchTerm} onChange={(event) => 
              updateSearch(event.target.value)} placeholder="Search by employee name" disabled={isDirectoryLoading} />
          </label>

          <label className="department-filter" htmlFor="department-filter">
            <span>Department</span>
            <select id="department-filter" value={department} onChange={(event) => updateDepartment(event.target.value)} disabled={isDirectoryLoading || isFilterLoading}>
              {departments.map((departmentName) => <option key={departmentName}>{departmentName}</option>)}
            </select>
          </label>

          <label className="status-filter" htmlFor="status-filter">
            <span>Status</span>
            <select id="status-filter" value={status} onChange={(event) => updateStatus(event.target.value)} disabled={isDirectoryLoading || isFilterLoading}>
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </div>

   
        {isDirectoryLoading && <PageLoader />}

        {!isDirectoryLoading && loadError && (
          <div className="panel-error">
            <p>Unable to load employees. Please try again.</p>
            <button className="primary-button" onClick={reloadEmployees}>Try Again</button>
          </div>
        )}

        {!isDirectoryLoading && !loadError && isFilterLoading && loadingType === 'search' && <SearchLoader count={employees.length} />}
        {!isDirectoryLoading && !loadError && isFilterLoading && loadingType === 'filter' && <FilterLoader count={employees.length} />}

        {!isDirectoryLoading && !loadError && !isFilterLoading && !hasEmployees && <EmployeeList employees={[]} emptyMessage={"No employees found"} />}

        {!isDirectoryLoading && !loadError && !isFilterLoading && hasEmployees && !hasFilteredResults && searchTerm.trim() && <EmployeeList employees={[]} emptyMessage={"No employees match your search."} />}

        {!isDirectoryLoading && !loadError && !isFilterLoading && hasEmployees && !hasFilteredResults && !searchTerm.trim() && <EmployeeList employees={[]} emptyMessage={"No employees found"} />}

        {!isDirectoryLoading && !loadError && !isFilterLoading && hasFilteredResults && <div className="results-transition"><EmployeeList employees={filteredEmployees} /></div>}

        {showPaginationControls && (
          <PaginationControls
            currentPage={displayPagination.page}
            totalPages={displayPagination.totalPages}
            totalEmployees={displayPagination.totalEmployees}
            hasNextPage={displayPagination.hasNextPage}
            hasPreviousPage={displayPagination.hasPreviousPage}
            onPageChange={hasActiveSearch ? setSearchPage : setCurrentPage}
          />
        )}
      </section>
    </>
  )
}