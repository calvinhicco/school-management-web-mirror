"use client"
import { useEffect, useState } from 'react'
import { subscribeAll, subscribeOne } from '@/lib/realtime'
import type { Student } from '@/types/student-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ReadonlyTooltip } from '@/components/Readonly'
import { AlertTriangle, Plus, DollarSign, User, Phone, FileText, AlertCircle } from 'lucide-react'

interface AppSettings {
  billingCycle: 'MONTHLY' | 'TERMLY'
  schoolName: string
  classGroups: Array<{ id: string; name: string; fee: number }>
}

export default function OutstandingPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubStudents = subscribeAll<Student>('students', setStudents)
    const unsubSettings = subscribeOne<AppSettings>('settings', 'appSettings', (data) => {
      setSettings(data)
      setLoading(false)
    })

    return () => {
      unsubStudents && unsubStudents()
      unsubSettings && unsubSettings()
    }
  }, [])

  const calculateOutstanding = (student: Student): number => {
    if (!settings || !student.admissionDate) return 0

    const admissionDate = new Date(student.admissionDate)
    const currentDate = new Date()
    
    // Find class group fee
    const classGroup = settings.classGroups?.find(g => g.id === student.classGroup)
    const monthlyFee = classGroup?.fee || 0
    
    let monthsOwed = 0
    if (settings.billingCycle === 'MONTHLY') {
      const monthsDiff = (currentDate.getFullYear() - admissionDate.getFullYear()) * 12 + 
                        (currentDate.getMonth() - admissionDate.getMonth())
      monthsOwed = Math.max(0, monthsDiff)
    } else {
      // Termly billing - simplified calculation
      const yearsDiff = currentDate.getFullYear() - admissionDate.getFullYear()
      monthsOwed = Math.max(0, yearsDiff * 12)
    }

    const totalOwed = monthsOwed * monthlyFee
    const totalPaid = student.feePayments?.reduce((sum, payment) => 
      payment.paid ? sum + (payment.amount || 0) : sum, 0) || 0
    
    // Add transport fees if applicable
    let transportOwed = 0
    if (student.hasTransport && student.transportFee) {
      transportOwed = monthsOwed * student.transportFee
      const transportPaid = student.transportPayments?.reduce((sum, payment) => 
        payment.paid ? sum + (payment.amount || 0) : sum, 0) || 0
      transportOwed -= transportPaid
    }

    return Math.max(0, totalOwed - totalPaid + transportOwed)
  }

  const getPaymentStatus = (student: Student) => {
    const outstanding = calculateOutstanding(student)
    if (outstanding === 0) {
      return { status: 'Paid in Full', color: 'green', icon: AlertCircle }
    } else if (student.feePayments?.some(p => p.paid)) {
      return { status: 'Partial Payment', color: 'yellow', icon: AlertTriangle }
    } else {
      return { status: 'Outstanding', color: 'red', icon: AlertTriangle }
    }
  }

  // Filter students with outstanding balances
  const outstandingStudents = students.filter(student => calculateOutstanding(student) > 0)
  const totalOutstanding = outstandingStudents.reduce((sum, student) => sum + calculateOutstanding(student), 0)

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5"/> Outstanding Students
        </h1>
        <ReadonlyTooltip>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2"/> Record Payment
          </Button>
        </ReadonlyTooltip>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-800 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Students with Outstanding Payments
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Total Outstanding Summary</h3>
              <div className="text-3xl font-bold text-red-600 mb-2">${totalOutstanding.toLocaleString()}</div>
              <p className="text-sm text-red-700">
                Across {outstandingStudents.length} students with outstanding payments
              </p>
              <p className="text-xs text-red-600 mt-1">
                Outstanding amounts calculated from enrollment date to current date
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {outstandingStudents.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No students with outstanding payments found.</p>
                <p className="text-sm text-gray-400 mt-2">All students are up to date with their payments!</p>
              </div>
            ) : (
              outstandingStudents
                .sort((a, b) => calculateOutstanding(b) - calculateOutstanding(a))
                .map((student) => {
                  const { status, icon: StatusIcon } = getPaymentStatus(student)
                  const outstandingAmount = calculateOutstanding(student)

                  // Find class group for display
                  const classGroup = settings?.classGroups?.find(g => g.id === student.classGroup)

                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <User className="w-8 h-8 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">{student.fullName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {student.parentContact}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {student.className || "No class assigned"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>Class Group: {classGroup?.name || "Unassigned"}</span>
                            <span>Student ID: {student.id}</span>
                            <span>Admitted: {new Date(student.admissionDate).toLocaleDateString()}</span>
                          </div>
                          {student.hasTransport && (
                            <div className="text-xs text-orange-600 mt-1">
                              Transport Service Active (${student.transportFee}/
                              {settings?.billingCycle === 'MONTHLY' ? "month" : "term"})
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-bold text-red-600">
                            <DollarSign className="w-4 h-4" />
                            {outstandingAmount.toLocaleString()}
                          </div>
                          <p className="text-xs text-gray-600">outstanding since enrollment</p>
                          <p className="text-xs text-red-500 font-medium">
                            {settings?.billingCycle === 'MONTHLY' ? "Monthly" : "Termly"} billing
                          </p>
                        </div>

                        <Badge
                          variant={
                            status === "Paid in Full"
                              ? "default"
                              : status === "Partial Payment"
                                ? "outline"
                                : "destructive"
                          }
                          className="flex items-center gap-1"
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status}
                        </Badge>

                        <ReadonlyTooltip>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="text-purple-600 border-purple-600"
                          >
                            View Details
                          </Button>
                        </ReadonlyTooltip>
                      </div>
                    </div>
                  )
                })
            )}
          </div>

          {outstandingStudents.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Outstanding Payment Notes:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Outstanding amounts are calculated from each student's enrollment date</li>
                <li>• Only past due payments are included (not future months/terms)</li>
                <li>• Transport fees are billed separately on the 7th of each month</li>
                <li>• Use the desktop app to record payments and manage accounts</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
