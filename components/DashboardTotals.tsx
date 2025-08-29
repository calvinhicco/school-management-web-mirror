"use client"
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { Loader2 } from 'lucide-react'

interface DashboardData {
  students: number
  expenses: number
  extraBilling: number
  outstandingStudents: number
  totalOutstanding: number
}

export function DashboardTotals() {
  const [data, setData] = useState<Partial<DashboardData>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch all collections in parallel
        const [
          studentsSnap,
          expensesSnap,
          extraBillingSnap,
          outstandingSnap
        ] = await Promise.all([
          getDocs(collection(db, 'students')),
          getDocs(collection(db, 'expenses')),
          getDocs(collection(db, 'extraBilling')),
          getDocs(collection(db, 'outstandingStudents'))
        ])

        // Calculate total outstanding amount
        const outstandingStudents = outstandingSnap.docs
          .map(doc => doc.data().outstandingAmount || 0)
          .reduce((sum, amount) => sum + amount, 0)

        setData({
          students: studentsSnap.size,
          expenses: expensesSnap.size,
          extraBilling: extraBillingSnap.size,
          outstandingStudents: outstandingSnap.size,
          totalOutstanding: outstandingStudents
        })
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up real-time listeners
    const unsubs = [
      // Listen for changes to update data in real-time
      // This is a simplified version - in a real app, you'd use onSnapshot
      // for each collection to get real-time updates
      // For now, we'll just refetch periodically
      setInterval(fetchData, 60000) // Refresh every minute
    ]

    return () => unsubs.forEach(unsub => clearInterval(unsub as any))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Students" 
        value={data.students?.toLocaleString() || '0'}
        icon="👥"
        trend="+5%"
      />
      <StatCard 
        title="Total Expenses" 
        value={`$${data.expenses?.toLocaleString() || '0'}`}
        icon="💰"
        trend="-2%"
      />
      <StatCard 
        title="Extra Billing" 
        value={`$${data.extraBilling?.toLocaleString() || '0'}`}
        icon="🧾"
        trend="+12%"
      />
      <StatCard 
        title="Outstanding" 
        value={`$${data.totalOutstanding?.toLocaleString() || '0'}`}
        icon="⚠️"
        trend="+8%"
        highlight
      />
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  highlight = false 
}: { 
  title: string
  value: string
  icon: string
  trend: string
  highlight?: boolean
}) {
  const isPositive = trend.startsWith('+')
  
  return (
    <div className={`p-4 rounded-lg border ${highlight ? 'border-amber-200 bg-amber-50' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {trend} from last month
      </div>
    </div>
  )
}
