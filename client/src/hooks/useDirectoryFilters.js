import { useEffect, useMemo, useRef, useState } from 'react'
import { searchEmployees, getEmployees } from '../services/userService'
import { mapApiEmployeeToFrontend } from '../mappers/userMapper'

const DEBOUNCE_DELAY = 500
const DEFAULT_LIMIT = 10

export default function useDirectoryFilters(employees, currentPage, setCurrentPage, pagination) {
  const [searchTerm, setSearchTerm] = useState('')
  const [department, setDepartment] = useState('All')
  const [status, setStatus] = useState('All')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [loadingType, setLoadingType] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [searchPagination, setSearchPagination] = useState(null)
  const [searchPage, setSearchPage] = useState(1)
  const [filterResults, setFilterResults] = useState(null)
  const [filterPagination, setFilterPagination] = useState(null)

  const abortRef = useRef(null)
  const requestCounterRef = useRef(0)
  const currentPageRef = useRef(currentPage)
  currentPageRef.current = currentPage
  const limitRef = useRef(pagination?.limit ?? DEFAULT_LIMIT)
  limitRef.current = pagination?.limit ?? DEFAULT_LIMIT
  const searchPageRef = useRef(searchPage)
  searchPageRef.current = searchPage
  const searchCriteriaRef = useRef('')

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
      setFilterPagination(null)
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

    getEmployees(filters, {
      page: currentPageRef.current,
      limit: limitRef.current,
    })
      .then((result) => {
        if (reqId === requestCounterRef.current) {
          setFilterResults(result.data.map(mapApiEmployeeToFrontend))
          setFilterPagination(result.pagination)
          setLoadingType(null)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && reqId === requestCounterRef.current) {
          setFilterResults([])
          setFilterPagination(null)
          setLoadingType(null)
        }
      })

    return () => {
      controller.abort()
    }
  }, [department, status, debouncedSearchTerm, currentPage])

  useEffect(() => {
    const term = debouncedSearchTerm.trim()

    if (!term) {
      if (abortRef.current) {
        abortRef.current.abort()
        abortRef.current = null
      }
      searchCriteriaRef.current = ''
      setSearchResults(null)
      setSearchPagination(null)
      if (searchPageRef.current !== 1) {
        setSearchPage(1)
      }
      if (department === 'All' && status === 'All') {
        setLoadingType(null)
      }
      return
    }

    const criteriaKey = `${term}|${department}|${status}`
    const pageToUse = criteriaKey === searchCriteriaRef.current ? searchPageRef.current : 1
    searchCriteriaRef.current = criteriaKey

    if (pageToUse !== searchPageRef.current) {
      setSearchPage(pageToUse)
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

    searchEmployees(
      params,
      { page: pageToUse, limit: limitRef.current },
      { signal: controller.signal }
    )
      .then((result) => {
        if (reqId === requestCounterRef.current) {
          setSearchResults(result.data.map(mapApiEmployeeToFrontend))
          setSearchPagination(result.pagination)
          setLoadingType(null)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && reqId === requestCounterRef.current) {
          setSearchResults([])
          setSearchPagination(null)
          setLoadingType(null)
        }
      })

    return () => {
      controller.abort()
    }
  }, [debouncedSearchTerm, department, status, searchPage])

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
    if (currentPageRef.current !== 1) {
      setCurrentPage(1)
    }
  }

  const updateStatus = (newStatus) => {
    setStatus(newStatus)
    if (currentPageRef.current !== 1) {
      setCurrentPage(1)
    }
  }

  return {
    department,
    status,
    filteredEmployees,
    filterPagination,
    searchPagination,
    isLoading: Boolean(loadingType),
    loadingType,
    searchTerm,
    updateDepartment,
    updateStatus,
    updateSearch,
    setSearchPage,
  }
}