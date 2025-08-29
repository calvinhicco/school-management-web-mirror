"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', label: 'Dashboard' },
  { href: '/students', label: 'Students' },
  { href: '/expenses', label: 'Expenses' },
  { href: '/extrabilling', label: 'ExtraBilling' },
  { href: '/outstanding', label: 'Outstanding' },
]

export function Nav() {
  const pathname = usePathname()
  return (
    <nav className="border-b">
      <div className="max-w-5xl mx-auto px-6 h-12 flex items-center gap-4">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className={cn(
            'text-sm hover:text-primary',
            pathname === it.href ? 'text-primary font-medium' : 'text-muted-foreground'
          )}>
            {it.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
