"use client"
import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReadonlyTooltip } from '@/components/Readonly'
import { Receipt, Plus, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface Expense {
  id: string
  description: string
  amount: number
  date: string
  category: string
  receiptNumber?: string
  notes?: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expensesRef = collection(db, 'expenses')
        const q = query(expensesRef, orderBy('date', 'desc'))
        const querySnapshot = await getDocs(q)
        
        const expensesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Expense[]
        
        setExpenses(expensesData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching expenses:', err)
        setError('Failed to load expenses. Please try again later.')
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Receipt className="w-5 h-5"/> 
          Expenses
          <span className="text-sm text-muted-foreground font-normal ml-2">
            ({expenses.length} total)
          </span>
        </h1>
        <ReadonlyTooltip>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2"/> Add expense
          </Button>
        </ReadonlyTooltip>
      </div>

      {expenses.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No expenses found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No expenses have been added yet. Add expenses in the desktop app to see them here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <Card key={expense.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{expense.description}</CardTitle>
                    <CardDescription className="mt-1">
                      {expense.category} • {formatDate(expense.date)}
                      {expense.receiptNumber && ` • Receipt #${expense.receiptNumber}`}
                    </CardDescription>
                  </div>
                  <div className="text-xl font-semibold">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
              </CardHeader>
              {expense.notes && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{expense.notes}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
