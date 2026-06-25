'use client'

import { useState, useRef, useEffect } from 'react'

interface PasswordGateProps {
  onUnlock: () => void
}

export default function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [value, setValue] = useState('')
  const [shaking, setShaking] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value || loading) return
    setLoading(true)

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: value }),
    })

    setLoading(false)

    if (res.ok) {
      localStorage.setItem('wcc_auth', 'true')
      onUnlock()
    } else {
      setShaking(true)
      setValue('')
      setTimeout(() => setShaking(false), 500)
      inputRef.current?.focus()
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-8"
      style={{ background: '#0A0F1E' }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-widest text-white">
          WAALHALLA
        </h1>
        <p className="mt-1 text-xs tracking-widest" style={{ color: '#4B5563' }}>
          COMMAND CENTER
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`flex flex-col items-center gap-4 ${shaking ? 'animate-shake' : ''}`}
      >
        <input
          ref={inputRef}
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="enter password"
          className="w-72 rounded border bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-700 focus:border-gray-500"
          style={{ borderColor: '#1F2937', fontFamily: 'IBM Plex Mono, monospace' }}
          autoComplete="current-password"
        />
        <button
          type="submit"
          disabled={!value || loading}
          className="w-72 rounded border py-3 text-xs font-bold tracking-widest transition-all disabled:opacity-30"
          style={{
            borderColor: '#374151',
            color: '#9CA3AF',
            background: 'transparent',
          }}
        >
          {loading ? 'CHECKING...' : 'ENTER'}
        </button>
      </form>
    </div>
  )
}
