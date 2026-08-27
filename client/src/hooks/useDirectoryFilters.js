
import { useEffect, useMemo, useRef, useState } from 'react'
import { searchEmployees, getEmployees } from '../services/userService'
import { mapApiEmployeeToFrontend } from '../mappers/userMapper'

const DEBOUNCE_DELAY = 500

export default function useDirectoryFilters(employees) {
  const [searchTerm, setSearchTerm] = useState('')
  const [department, setDepartment] = useState('All')
  const [status, setStatus] = useState('All')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [loadingType, setLoadingType] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [filterResults, setFilterResults] = useState(null)

  const abortRef = useRef(null)
  const requestCounterRef = useRef(0)

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, DEBOUNCE_DELAY)
    return () => clearTimeout(timer)
  }, [searchTerm])

 
  useEffect(() => {
    const term = debouncedSearchTerm.trim()
    if (term) return

    const hasFilters = department !== 'All' || status !== 'All'

    if (!hasFilters) {
      setFilterResults(null)
      return
    }

    if (abortRef.current) abortRef.current.abort()

    const controller = new AbortController()
    abortRef.current = controller
    const reqId = ++requestCounterRef.current

    setLoadingType('filter')

    const filters = {}
    if (status !== 'All') filters.status = status
    if (department !== 'All') filters.department = department

    getEmployees(filters)
      .then((results) => {
        if (reqId === requestCounterRef.current) {
          setFilterResults(results.map(mapApiEmployeeToFrontend))
          setLoadingType(null)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && reqId === requestCounterRef.current) {
          setFilterResults([])
          setLoadingType(null)
        }
      })

    return () => {
      controller.abort()
    }
  }, [department, status, debouncedSearchTerm])

  useEffect(() => {
    const term = debouncedSearchTerm.trim()

    if (!term) {
      if (abortRef.current) {
        abortRef.current.abort()
        abortRef.current = null
      }
      setSearchResults(null)
      if (department === 'All' && status === 'All') {
        setLoadingType(null)
      }
      return
    }

    if (abortRef.current) abortRef.current.abort()

    const controller = new AbortController()
    abortRef.current = controller
    const reqId = ++requestCounterRef.current

    setLoadingType('search')

    const params = { query: term }
    if (department !== 'All') {
      params.department = department
    }
    if (status !== 'All') {
      params.status = status
    }

    searchEmployees(params, { signal: controller.signal })
      .then((results) => {
        if (reqId === requestCounterRef.current) {
          setSearchResults(results.map(mapApiEmployeeToFrontend))
          setLoadingType(null)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && reqId === requestCounterRef.current) {
          setSearchResults([])
          setLoadingType(null)
        }
      })

    return () => {
      controller.abort()
    }
  }, [debouncedSearchTerm, department, status])

  const filteredEmployees = useMemo(() => {
    if (searchResults !== null) {
      return searchResults
    }
    if (filterResults !== null) {
      return filterResults
    }
    return employees
  }, [searchResults, filterResults, employees])

  const updateSearch = (term) => {
    setSearchTerm(term)
  }

  const updateDepartment = (dept) => {
    setDepartment(dept)
  }

  const updateStatus = (newStatus) => {
    setStatus(newStatus)
  }

  return {
    department,
    status,
    filteredEmployees,
    isLoading: Boolean(loadingType),
    loadingType,
    searchTerm,
    updateDepartment,
    updateStatus,
    updateSearch,
  }
}
