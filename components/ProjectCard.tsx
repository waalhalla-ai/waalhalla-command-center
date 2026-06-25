'use client'

import { useState } from 'react'

type Status = 'live' | 'building' | 'paused' | 'stealth' | 'blocked'

export interface Project {
  id: string
  project: string
  status: Status
  completed_today: string | null
  in_progress: string | null
  next_priority: string | null
  blocker: string | null
  session_summary: string | null
  last_updated_by: string
  updated_at: string
}

const STATUS_CONFIG: Record<Status, { color: string; bg: string; label: string }> = {
  live:      { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  label: 'LIVE' },
  building:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'BUILDING' },
  paused:    { color: '#6B7280', bg: 'rgba(107,114,128,0.1)',label: 'PAUSED' },
  stealth:   { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', label: 'STEALTH' },
  blocked:   { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  label: 'BLOCKED' },
}

const DISPLAY_NAMES: Record<string, string> = {
  sonscape:        'Sonscape',
  sprinkal:        'Sprinkal',
  novalabs:        'Nova Labs',
  waalhalla_records: 'Waalhalla Records',
  personal_brand:  'Personal Brand',
  outreach_center: 'Outreach Center',
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function ProjectCard({ project }: { project: Project }) {
  const [summaryOpen, setSummaryOpen] = useState(false)

  const cfg = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.paused
  const displayName = DISPLAY_NAMES[project.project] ?? project.project

  return (
    <div
      className="flex flex-col gap-3 rounded-lg border p-5"
      style={{
        background: '#111827',
        borderColor: '#1F2937',
        borderLeftWidth: '3px',
        borderLeftColor: cfg.color,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-white leading-tight">{displayName}</h2>
        <span
          className="shrink-0 rounded px-2 py-0.5 text-xs font-bold tracking-widest"
          style={{ color: cfg.color, background: cfg.bg }}
        >
          {cfg.label}
        </span>
      </div>

      <p className="text-xs" style={{ color: '#6B7280' }}>
        Updated {relativeTime(project.updated_at)}
      </p>

      {/* Fields */}
      <div className="flex flex-col gap-2 text-sm">
        {project.completed_today && (
          <Field label="COMPLETED" value={project.completed_today} />
        )}
        {project.in_progress && (
          <Field label="IN PROGRESS" value={project.in_progress} />
        )}
        {project.next_priority && (
          <Field label="NEXT" value={project.next_priority} color="#F59E0B" />
        )}
        {project.blocker && (
          <Field label="BLOCKER" value={project.blocker} color="#EF4444" />
        )}
      </div>

      {/* Session summary — collapsible */}
      {project.session_summary && (
        <div>
          <button
            onClick={() => setSummaryOpen((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium tracking-wider transition-colors"
            style={{ color: summaryOpen ? '#9CA3AF' : '#6B7280' }}
          >
            <span
              className="inline-block transition-transform duration-200"
              style={{ transform: summaryOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              ▶
            </span>
            SESSION SUMMARY
          </button>
          {summaryOpen && (
            <p className="mt-2 text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
              {project.session_summary}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  color = '#9CA3AF',
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div>
      <span
        className="mr-2 text-xs font-bold tracking-wider"
        style={{ color: '#4B5563' }}
      >
        {label}:
      </span>
      <span className="text-xs leading-relaxed" style={{ color }}>
        {value}
      </span>
    </div>
  )
}
