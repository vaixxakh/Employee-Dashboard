const EMPLOYEES_KEY = 'employees'

export function getEmployees() {
  try {
    const raw = localStorage.getItem(EMPLOYEES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    throw new Error('Unable to parse employees from storage')
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
