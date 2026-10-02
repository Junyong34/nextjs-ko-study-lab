'use client'
import { useRef, useState, useTransition } from 'react'
import type { DomCensus, Prediction, RouteProbe } from '../types'
import { takeCensus } from '../lib/census'

export function useTechDocProbe() {
  const docRef = useRef<HTMLDivElement>(null)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [census, setCensus] = useState<DomCensus | null>(null)
  const [route, setRoute] = useState<RouteProbe | null>(null)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const measure = () => {
    if (docRef.current) setCensus(takeCensus(docRef.current))
  }

  // spec-sheet/page.mdx를 브라우저 문서 요청과 같은 방식(GET HTML)으로 받아 <title>과 <h1>을 읽는다.
  const probeRoute = () => {
    startTransition(async () => {
      const started = performance.now()
      try {
        const res = await fetch(`${window.location.pathname}/spec-sheet`, { cache: 'no-store' })
        const html = await res.text()
        const doc = new DOMParser().parseFromString(html, 'text/html')
        setRoute({
          status: res.status,
          contentType: res.headers.get('content-type') ?? '',
          title: doc.title || null,
          h1Text: doc.querySelector('h1')?.textContent ?? null,
          ms: Math.round(performance.now() - started),
        })
        setRouteError(null)
      } catch (e) {
        setRouteError(e instanceof Error ? e.message : String(e))
      }
    })
  }

  const reset = () => {
    setPrediction(null)
    setCensus(null)
    setRoute(null)
    setRouteError(null)
  }

  return { docRef, prediction, setPrediction, census, route, routeError, isPending, measure, probeRoute, reset }
}
