"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Users, Receipt, FileText, AlertTriangle } from 'lucide-react'

const items = [
  { 
    href: '/' as const, 
    label: 'Dashboard',
    icon: Home 
  },
  { 
    href: '/students' as const, 
    label: 'Students',
    icon: Users
  },
  { 
    href: '/expenses' as const, 
    label: 'Expenses',
    icon: Receipt
  },
  { 
    href: '/extrabilling' as const, 
    label: 'Extra Billing',
    icon: FileText
  },
  { 
    href: '/outstanding' as const, 
    label: 'Outstanding',
    icon: AlertTriangle
  },
]

export function Nav() {
  const pathname = usePathname()
  return (
    <nav className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-6">
        {items.map((it) => {
          const isActive = pathname === it.href || 
                         (it.href !== '/' && pathname.startsWith(it.href))
          const Icon = it.icon
          
          return (
            <Link 
              key={it.href} 
              href={it.href} 
              className={cn(
                'flex items-center gap-2 text-sm transition-colors hover:text-primary py-2 px-3 rounded-md',
                isActive 
                  ? 'text-primary font-medium bg-primary/5' 
                  : 'text-muted-foreground hover:bg-accent/50'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{it.label}</span>
              {isActive && (
                <span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
