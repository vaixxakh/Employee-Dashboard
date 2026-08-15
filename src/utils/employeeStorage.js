// LocalStorage persistence for the employee dashboard.
//
// PURPOSE:
// JSONPlaceholder (https://jsonplaceholder.typicode.com) is a stateless mock API:
// POST/PUT/DELETE return success but records are NOT persisted server-side.
// To support the demo's expected behavior (locally-created employees and local
// edits/deletes surviving a page refresh), a snapshot of the full employee list
// is kept in LocalStorage under a single key.
//
// IMPORTANT:
// This is NOT the authoritative data source. The API (src/services/userService.js)
// remains the primary source of truth for API-backed employees. LocalStorage is
// only a non-authoritative cache used to preserve locally-created records and
// local edits/deletes between refreshes, because JSONPlaceholder cannot persist
// them. useEmployees() reconciles fresh API data against this snapshot on load.

const EMPLOYEES_KEY = 'employees'

export function getEmployees() {
  try {
    const raw = localStorage.getItem(EMPLOYEES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // Corrupt/legacy data must never crash the app on boot.
    return []
  }
}

export function saveEmployees(employees) {
  try {
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees))
    return true
  } catch {
    return false
  }
}
