'use client'

import { useEffect, useState } from 'react'
import PasswordGate from '@/components/PasswordGate'
import Dashboard from '@/components/Dashboard'

const STORAGE_KEY = 'wcc_auth'

export default function Home() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setUnlocked(stored === 'true')
  }, [])

  if (unlocked === null) {
    // Avoid flash — render nothing until localStorage is checked
    return <div style={{ background: '#0A0F1E', minHeight: '100vh' }} />
  }

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />
  }

  return <Dashboard />
}
