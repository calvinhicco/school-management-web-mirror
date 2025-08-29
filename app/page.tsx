import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Users, Plus } from 'lucide-react'
import { DashboardTotals } from '@/components/DashboardTotals'

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled>
              <Plus className="w-4 h-4 mr-2" /> Add student
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Available in Desktop (Electron) only</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" /> Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardTotals />
            <Badge variant="secondary" className="mt-2">Realtime</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
