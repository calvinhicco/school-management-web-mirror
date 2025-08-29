"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReadonlyTooltip } from '@/components/Readonly'
import { AlertTriangle, Plus } from 'lucide-react'

export default function OutstandingPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Outstanding Students</h1>
        <ReadonlyTooltip>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2"/> Record payment
          </Button>
        </ReadonlyTooltip>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Read-only</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This page shows students with outstanding balances. Editing is disabled.
        </CardContent>
      </Card>
    </div>
  )
}
