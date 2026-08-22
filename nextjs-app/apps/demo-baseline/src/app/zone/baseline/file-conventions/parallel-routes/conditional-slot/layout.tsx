import React from 'react'

export default function ConditionalSlotLayout({
  children,
  admin,
  user,
}: {
  children: React.ReactNode
  admin?: React.ReactNode
  user?: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      {children}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {admin}
        {user}
      </div>
    </div>
  )
}
