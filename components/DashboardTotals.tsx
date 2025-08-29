"use client"
import { useEffect, useState } from 'react'
import { subscribe } from '@/lib/realtime'
import type { Student } from '@/types'

export function DashboardTotals() {
  const [studentsCount, setStudentsCount] = useState<number | null>(null)

  useEffect(() => {
    const unsub = subscribe<Student>('students', (docs) => {
      setStudentsCount(docs.length)
    })
    return () => unsub()
  }, [])

  return (
    <div className="text-3xl font-bold">{studentsCount ?? '—'}</div>
  )
}
