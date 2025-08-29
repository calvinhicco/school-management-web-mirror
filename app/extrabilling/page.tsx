"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReadonlyTooltip } from '@/components/Readonly'
import { PackagePlus, Plus } from 'lucide-react'

export default function ExtraBillingPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2"><PackagePlus className="w-5 h-5"/> Extra Billing</h1>
        <ReadonlyTooltip>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2"/> Add item
          </Button>
        </ReadonlyTooltip>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Read-only</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This page mirrors extra billing records from the desktop app. Editing is disabled.
        </CardContent>
      </Card>
    </div>
  )
}
