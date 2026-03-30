'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminUser {
  email: string
  role: 'admin'
}

interface AdminContextType {
  isAuthenticated: boolean
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth')
        const data = await res.json()
        setIsAuthenticated(data.authenticated)
        setUser(data.user || null)
      } catch {
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        setIsAuthenticated(true)
        setUser({ email, role: 'admin' })
      }

      return data
    } catch {
      return { success: false, message: 'Erro ao conectar' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
    } finally {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  return (
    <AdminContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
