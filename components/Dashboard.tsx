'use client'

import { useEffect, useState, useCallback } from 'react'
import ProjectCard, { Project } from './ProjectCard'

const PROJECT_ORDER = [
  'sonscape',
  'sprinkal',
  'novalabs',
  'waalhalla_records',
  'personal_brand',
  'outreach_center',
]

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  const fetchData = useCallback(async () => {
    setSyncing(true)
    setError(null)
    try {
      const res = await fetch('/api/status', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const list: Project[] = data.projects ?? data
      // Sort by defined order, unknown projects appended at end
      list.sort((a, b) => {
        const ai = PROJECT_ORDER.indexOf(a.project)
        const bi = PROJECT_ORDER.indexOf(b.project)
        const an = ai === -1 ? 99 : ai
        const bn = bi === -1 ? 99 : bi
        return an - bn
      })
      setProjects(list)
      setLastSync(new Date())
    } catch (err) {
      setError(String(err))
    } finally {
      setSyncing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60_000)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <div className="min-h-screen px-4 pb-16 pt-10 sm:px-8" style={{ background: '#0A0F1E' }}>
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-white sm:text-3xl">
              WAALHALLA COMMAND CENTER
            </h1>
            <p className="mt-1 text-xs tracking-widest" style={{ color: '#6B7280' }}>
              LIVE ACROSS ALL PROJECTS
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 text-xs sm:items-end" style={{ color: '#4B5563' }}>
            <button
              onClick={fetchData}
              disabled={syncing}
              className="transition-colors hover:text-gray-400 disabled:opacity-50"
            >
              {syncing ? '⟳ SYNCING...' : '⟳ REFRESH'}
            </button>
            {lastSync && (
              <span>SYNCED {formatTime(lastSync)}</span>
            )}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="mb-6 rounded border px-4 py-3 text-xs"
            style={{ borderColor: '#EF4444', color: '#EF4444', background: 'rgba(239,68,68,0.05)' }}
          >
            FETCH ERROR: {error}
          </div>
        )}

        {/* Cards grid */}
        {projects.length === 0 && !error ? (
          <div className="flex items-center justify-center py-24">
            <span className="text-xs tracking-widest" style={{ color: '#374151' }}>
              LOADING...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
