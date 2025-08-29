import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Users, Plus, Clock, AlertCircle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { DashboardTotals } from '@/components/DashboardTotals'

export default function DashboardPage() {
  // Mock data for recent activities
  const recentActivities = [
    { id: 1, type: 'expense', description: 'Paid electricity bill', amount: 15000, date: '2023-06-15T10:30:00Z' },
    { id: 2, type: 'payment', description: 'Received payment from John Doe', amount: 5000, date: '2023-06-14T14:45:00Z' },
    { id: 3, type: 'billing', description: 'Added extra billing for June', amount: 2000, date: '2023-06-14T09:15:00Z' },
    { id: 4, type: 'expense', description: 'Bought stationery', amount: 3000, date: '2023-06-13T16:20:00Z' },
  ]

  // Mock data for quick stats
  const quickStats = [
    { title: 'This Month\'s Revenue', value: '₦245,000', change: '+12%', trend: 'up' },
    { title: 'Expenses', value: '₦78,500', change: '+5%', trend: 'up' },
    { title: 'Outstanding', value: '₦124,300', change: '-8%', trend: 'down' },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your school's financials and activities
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled variant="outline">
              <Plus className="w-4 h-4 mr-2" /> Add Record
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Available in Desktop (Electron) only</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        <DashboardTotals />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'expense' ? 'bg-red-100 text-red-600' :
                      activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {activity.type === 'expense' ? (
                        <ArrowRight className="w-4 h-4" />
                      ) : activity.type === 'payment' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(activity.date)} • {formatTimeAgo(activity.date)}
                      </p>
                    </div>
                  </div>
                  <div className={`font-medium ${
                    activity.type === 'expense' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {activity.type === 'expense' ? '-' : '+'}₦{activity.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="mt-4 w-full" disabled>
              View All Activities
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Key metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-lg font-semibold">{stat.value}</p>
                  </div>
                  <div className={`flex items-center gap-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm">{stat.change}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled>
                <Users className="w-4 h-4 mr-2" /> Add New Student
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <Plus className="w-4 h-4 mr-2" /> Record Expense
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <AlertCircle className="w-4 h-4 mr-2" /> Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
