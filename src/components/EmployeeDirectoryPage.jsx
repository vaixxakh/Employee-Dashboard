import EmployeeList from './EmployeeList'
import FilterLoader from './FilterLoader'
import SearchLoader from './SearchLoader'
import useDirectoryFilters from '../hooks/useDirectoryFilters'
import {FiPlus} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const departments = ['All', 'Frontend', 'Backend', 'Testing', 'Full Stack','UI/UX']

export default function EmployeeDirectoryPage({ employees, isLoading }) {
  const {
    department,
    filteredEmployees,
    isLoading: isFilterLoading,
    loadingType,
    searchTerm,
    updateDepartment,
    updateSearch,
  } = useDirectoryFilters(employees)
  const isLoadingResults = isLoading || isFilterLoading

  return (
    <>
      <section className="page-heading">
        <Link className="back-link" to="/">&larr; Back to dashboard</Link>
        <p className="eyebrow">PEOPLE</p>
        
          <h1>Employees</h1>

        <div className="page-heading-content">
          <p>Browse your organization's employee directory.</p>
          <button
            className="primary-button"
            onClick={() => (window.location.href = "/employees/add")}
          >
            <FiPlus size={18} />
            <span>Add Employee</span>
          </button>
          </div>
      </section>

      <section className="panel">
        <div className="directory-filters">
          <label className="search-box" htmlFor="employee-search">
            <span aria-hidden="true">Search</span>
            <input id="employee-search" type="search" value={searchTerm} onChange={(event) => 
              updateSearch(event.target.value)} placeholder="Search by employee name" disabled={isLoading} />
          </label>

          <label className="department-filter" htmlFor="department-filter">
            <span>Department</span>
            <select id="department-filter" value={department} onChange={(event) => updateDepartment(event.target.value)} disabled={isLoadingResults}>
              {departments.map((departmentName) => <option key={departmentName}>{departmentName}</option>)}
            </select>
          </label>
        </div>

        {isLoadingResults && loadingType === 'search' && <SearchLoader count={employees.length} />}
        {isLoadingResults && loadingType === 'filter' && <FilterLoader count={employees.length} />}
        {isLoadingResults && !loadingType && <EmployeeList employees={employees} isLoading />}
        {!isLoadingResults && <div className="results-transition"><EmployeeList employees={filteredEmployees} emptyMessage={`No employees found for "${searchTerm}".`} /></div>}
      </section>
    </>
  )
}
