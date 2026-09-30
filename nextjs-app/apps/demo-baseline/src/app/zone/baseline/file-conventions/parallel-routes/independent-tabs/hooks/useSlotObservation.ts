'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { INTENT_KEY } from '../lib/constants'
import { readSnapshot, type Snapshot } from '../lib/snapshot'

/** 이동 직전 스냅샷(prev)과 현재 DOM 스냅샷(curr)을 실측한다. */
export function useSlotObservation(rootId: string) {
  const pathname = usePathname()
  const [curr, setCurr] = useState<Snapshot | null>(null)
  const [prev, setPrev] = useState<Snapshot | null>(null)
  const [viaAnchor, setViaAnchor] = useState(false)

  useEffect(function restoreAnchorIntent() {
    try {
      const raw = sessionStorage.getItem(INTENT_KEY)
      if (!raw) return
      sessionStorage.removeItem(INTENT_KEY)
      setPrev(JSON.parse(raw) as Snapshot)
      setViaAnchor(true)
    } catch {}
  }, [])

  useEffect(function observe() {
    const root = document.getElementById(rootId)
    if (!root) return
    const read = () => setCurr(readSnapshot(root))
    function beforeNavigate(e: Event) {
      const a = (e.target as HTMLElement).closest('a')
      if (!a) return
      const snap = readSnapshot(root!)
      if (!snap) return
      setPrev(snap)
      setViaAnchor(a.hasAttribute('data-hard'))
      if (a.hasAttribute('data-hard')) {
        try { sessionStorage.setItem(INTENT_KEY, JSON.stringify(snap)) } catch {}
      }
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(root, { childList: true, subtree: true, attributes: true })
    root.addEventListener('input', read)
    document.addEventListener('click', beforeNavigate, true)
    return () => {
      observer.disconnect()
      root.removeEventListener('input', read)
      document.removeEventListener('click', beforeNavigate, true)
    }
  }, [rootId, pathname])

  return { pathname, curr, prev, viaAnchor }
}
