'use client'

interface InvalidValueReceiverProps {
  label: string
  value: unknown
}

export function InvalidValueReceiver({ label, value }: InvalidValueReceiverProps) {
  return (
    <div className="p-4 text-sm text-zinc-700 dark:text-zinc-300">
      {label}: {String(value)}
    </div>
  )
}
