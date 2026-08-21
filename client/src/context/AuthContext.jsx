import React from 'react'

import AuthContext from './authContext'
import {
  getStoredToken,
  getStoredUser,
  saveAuthSession,
  logoutUser as clearStoredAuth,
} from '../services/authService'

export function AuthProvider({ children }) {
  const [token, setToken] = React.useState(getStoredToken())
  const [user, setUser] = React.useState(getStoredUser())

  const login = React.useCallback((newToken, newUser) => {
    saveAuthSession(newToken, newUser)
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = React.useCallback(() => {
    clearStoredAuth()
    setToken(null)
    setUser(null)
  }, [])

  React.useEffect(() => {
    const handleSessionExpired = () => {
      setToken(null)
      setUser(null)
    }

    window.addEventListener('auth:expired', handleSessionExpired)

    return () => window.removeEventListener('auth:expired', handleSessionExpired)
  }, [])

  const value = React.useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
