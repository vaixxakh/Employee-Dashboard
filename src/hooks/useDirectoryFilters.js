
import { useEffect, useMemo, useState } from 'react'

const LOADING_DELAY = 500

export default function useDirectoryFilters(employees) {
  const [filters, setFilters] = useState({ searchTerm: '', department: 'All' })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [loadingType, setLoadingType] = useState(null)

  useEffect(() => {
    if (!loadingType) return undefined

    const timer = window.setTimeout(() => {
      setAppliedFilters(filters)
      setLoadingType(null)
    }, LOADING_DELAY)

    return () => window.clearTimeout(timer)
  }, [filters, loadingType])

  const filteredEmployees = useMemo(() => {
    const query = appliedFilters.searchTerm.trim().toLowerCase()

    return employees.filter((employee) => {

      const nameMatches = 
        !query || 
          String(employee.name || '').toLowerCase().includes(query)

      const emailMatches =
        !query ||
         String(employee.email || '').toLowerCase().includes(query)

      const departmentSearchMatches = 
        !query || 
        String(employee.department || '').toLowerCase().includes(query)

      const companyMatches =
        !query ||
        String(employee.company || '').toLowerCase().includes(query)

      const departmentFilterMatches  = 
        appliedFilters.department === 'All' || 
        employee.department === appliedFilters.department

        

      return(
        (nameMatches || emailMatches || companyMatches || departmentSearchMatches) &&
        departmentFilterMatches
      )
    })
  }, [appliedFilters, employees])

  const updateSearch = (searchTerm) => {
    setFilters((currentFilters) => ({ ...currentFilters, searchTerm }))
    setLoadingType('search')
  }

  const updateDepartment = (department) => {
    setFilters((currentFilters) => ({ ...currentFilters, department }))
    setLoadingType('filter')
  }

  return {
    department: filters.department,
    filteredEmployees,
    isLoading: Boolean(loadingType),
    loadingType,
    searchTerm: filters.searchTerm,
    updateDepartment,
    updateSearch,
  }
}
