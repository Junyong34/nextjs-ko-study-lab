import React from 'react'
import { cn } from '../cn'

interface PerspectiveBookContentProps {
  children: React.ReactNode
  className?: string
}

export function PerspectiveBookHeader({ children, className = '' }: PerspectiveBookContentProps) {
  return <div className={cn('flex h-full flex-col justify-end p-5', className)}>{children}</div>
}

export interface PerspectiveBookTitleProps extends PerspectiveBookContentProps {
  as?: 'h2' | 'h3' | 'h4'
}

export function PerspectiveBookTitle({
  as: Heading = 'h3',
  children,
  className = '',
}: PerspectiveBookTitleProps) {
  return <Heading className={cn('text-lg font-semibold tracking-tight', className)}>{children}</Heading>
}

export function PerspectiveBookDescription({ children, className = '' }: PerspectiveBookContentProps) {
  return <p className={cn('mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300', className)}>{children}</p>
}
