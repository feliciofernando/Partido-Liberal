'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { useAdmin } from './AdminProvider'
import { LoginModal } from './LoginModal'
import { AdminPanel } from './AdminPanel'

// Safe mounting hook that avoids the lint error
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export function AdminHandler() {
  const { isAuthenticated, loading } = useAdmin()
  const [showLogin, setShowLogin] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const mounted = useMounted()

  useEffect(() => {
    if (!mounted) return

    const checkUrl = () => {
      if (typeof window === 'undefined') return
      const urlParams = new URLSearchParams(window.location.search)
      const isAdmin = urlParams.has('admin')

      if (isAdmin) {
        if (isAuthenticated) {
          setShowPanel(true)
          setShowLogin(false)
        } else {
          setShowLogin(true)
          setShowPanel(false)
        }
      } else {
        setShowPanel(false)
        setShowLogin(false)
      }
    }

    checkUrl()

    const interval = setInterval(checkUrl, 500)
    return () => clearInterval(interval)
  }, [isAuthenticated, mounted])

  const handleClosePanel = () => {
    setShowPanel(false)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('admin')
      window.history.replaceState({}, '', url.toString())
    }
  }

  const handleCloseLogin = (open: boolean) => {
    setShowLogin(open)
    if (!open && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('admin')
      window.history.replaceState({}, '', url.toString())
    }
  }

  if (loading || !mounted) return null

  return (
    <>
      <LoginModal open={showLogin} onOpenChange={handleCloseLogin} />
      {showPanel && isAuthenticated && <AdminPanel onClose={handleClosePanel} />}
    </>
  )
}
