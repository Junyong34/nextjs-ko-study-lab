import { sendGAEvent } from '@next/third-parties/google'

let pending: Array<{ name: string; params: Record<string, unknown> }> = []
let timer: ReturnType<typeof setTimeout> | undefined
let attempts = 0
let ready = false

function flush() {
  timer = undefined
  const layer = (window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer
  // Wait for the real SDK config command, preserving hydration events in order.
  ready ||= Boolean(layer?.some((entry) => entry[0] === 'config'))
  if (!ready) {
    if (++attempts < 100) timer = setTimeout(flush, 50)
    else pending = []
    return
  }
  attempts = 0
  const batch = pending
  pending = []
  for (const event of batch) {
    try { sendGAEvent('event', event.name, event.params) } catch { /* Best effort. */ }
  }
}

export function sendEvent(name: string, params: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_GA_ID || typeof window === 'undefined') return
  if (pending.length < 100) pending.push({ name, params })
  if (!timer) flush()
}
