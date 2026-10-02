'use client'
import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { BundleMarkers, CartResponse, SlotMeasurement } from '../types'

const apiUrl = () => `${window.location.pathname}/api/cart`

// 이 페이지가 받은 JS 파일 목록: <script src> + 나중에 동적으로 받은 스크립트(Resource Timing).
function loadedScriptUrls() {
  const tags = Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]'), (s) => s.src)
  const timing = performance
    .getEntriesByType('resource')
    .filter((e) => (e as PerformanceResourceTiming).initiatorType === 'script' || e.name.endsWith('.js'))
    .map((e) => e.name)
  return Array.from(new Set([...tags, ...timing])).filter((u) => new URL(u).origin === location.origin)
}

export function useSlotProbe(markers: BundleMarkers) {
  const router = useRouter()
  const docRef = useRef<HTMLDivElement>(null)
  const [measurement, setMeasurement] = useState<SlotMeasurement | null>(null)
  const [isPending, startTransition] = useTransition()

  const measure = () => {
    startTransition(async () => {
      const root = docRef.current
      if (!root) return
      const server: CartResponse = await (await fetch(apiUrl(), { cache: 'no-store' })).json()
      const urls = loadedScriptUrls()
      const sources = await Promise.all(urls.map((u) => fetch(u).then((r) => r.text()).catch(() => '')))
      const countText = root.querySelector('[data-probe="cart-count"]')?.textContent
      setMeasurement({
        mdxEnv: root.querySelector('[data-probe="mdx-env"]')?.textContent ?? null,
        buttonHydrated: root.querySelector('[data-bundle-marker]')?.getAttribute('data-hydrated') === 'true',
        domCartCount: countText ? Number(countText) : null,
        serverCartCount: server.count,
        h2Total: root.querySelectorAll('h2').length,
        h2Local: root.querySelectorAll('h2[data-local-override="h2"]').length,
        h2Global: root.querySelectorAll('h2.mdx-g-h2').length,
        pGlobal: root.querySelectorAll('p.mdx-g-p').length,
        calloutCount: root.querySelectorAll('[data-probe="callout"]').length,
        scriptsScanned: urls.length,
        buttonMarkerHits: sources.filter((s) => s.includes(markers.button)).length,
        proseMarkerHits: sources.filter((s) => s.includes(markers.prose)).length,
        measuredAt: new Date().toLocaleTimeString('ko-KR'),
      })
    })
  }

  const reset = async () => {
    await fetch(apiUrl(), { method: 'DELETE' })
    setMeasurement(null)
    router.refresh()
  }

  return { docRef, measurement, isPending, measure, reset }
}
