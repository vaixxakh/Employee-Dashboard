import React from 'react'

import { useEmployees } from '../hooks/useEmployees'

const EmployeeContext = React.createContext(null)

function EmployeeDataProviderInner({ children }) {
  const employeeData = useEmployees()
  return (
    <EmployeeContext.Provider value={employeeData}>
      {children}
    </EmployeeContext.Provider>
  )
}

export function EmployeeProvider({ children }) {
  return (
    <EmployeeDataProviderInner>
      {children}
    </EmployeeDataProviderInner>
  )
}

export function useEmployeeData() {
  return React.useContext(EmployeeContext)
}
