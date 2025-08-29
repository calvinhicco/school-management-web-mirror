"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { subscribe } from '@/lib/realtime'
import type { Student } from '@/types/student-types'
import { Button } from '@/components/ui/button'
import { ReadonlyTooltip } from '@/components/Readonly'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Plus } from 'lucide-react'

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    const unsub = subscribe<Student>('students', (docs) => setStudents(docs))
    return () => unsub()
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2"><Users className="w-5 h-5"/> Students</h1>
        <ReadonlyTooltip>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2"/> Add student
          </Button>
        </ReadonlyTooltip>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {students.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                <Link href={`/students/${s.id}`} className="text-primary hover:underline">{s.fullName}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div className="flex flex-wrap gap-4">
                <span>Class: {s.className}</span>
                <span>Group: {s.classGroup}</span>
                <span>Total Paid: {s.totalPaid ?? 0}</span>
                <span>Outstanding: {s.totalOwed ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {students.length === 0 && (
          <p className="text-sm text-muted-foreground">No students yet. Data syncs from the desktop app.</p>
        )}
      </div>
    </div>
  )
}
