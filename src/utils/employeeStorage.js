const EMPLOYEES_KEY = 'employees'

export function getEmployees() {
  try {
    const raw = localStorage.getItem(EMPLOYEES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    // Surface parsing errors so the app can present a user-friendly error state
    throw new Error('Unable to parse employees from storage')
  }
}

export function saveEmployees(employees) {
  try {
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees))
  } catch (e) {
    // Swallow errors to avoid breaking UI; app relies on in-memory state as source of truth
    // In production one might log this to monitoring
  }
}
