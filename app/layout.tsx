import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Nav } from '@/components/Nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Students - Read-Only Web',
  description: 'Read-Only Web — synced from the desktop app. Editing is disabled.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          <div className="w-full bg-yellow-50 border-b border-yellow-200 text-yellow-900 text-sm py-2 text-center">
            Read-Only Web — synced from the desktop app. Editing is disabled.
          </div>
          <Nav />
          <main className="min-h-screen">
            {children}
          </main>
        </TooltipProvider>
      </body>
    </html>
  )
}
