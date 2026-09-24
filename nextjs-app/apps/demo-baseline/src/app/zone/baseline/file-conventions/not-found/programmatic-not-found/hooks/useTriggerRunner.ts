'use client'
import { useCallback, useRef, useState } from 'react'
import { PNF_BASE_PATH, type ProbeSite, type ProbeSnapshot, type RenderSite } from '../types'
import { SCENARIOS, type Scenario } from '../scenarios'

export interface ScenarioResult {
  key: string
  status: number | null
  boundary: string | null
  renderedRoute: string | null
  reachedDelta: number
  afterDelta: number
  renderedDelta: number
  /** soft 모드: 클릭 후에도 iframe 문서가 교체되지 않았는지 (window 표식 유지) */
  noReload: boolean | null
  matched: boolean
  error?: string
}

type Marker = { boundary: string | null; rendered: string | null }
type ProbeWindow = Window & { __pnfNoReload?: boolean }

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function readProbe(): Promise<ProbeSnapshot> {
  const res = await fetch(`${PNF_BASE_PATH}/api/probe`, { cache: 'no-store' })
  return res.json()
}

function readMarker(frame: HTMLIFrameElement): Marker {
  const doc = frame.contentDocument
  return {
    boundary: doc?.querySelector('[data-not-found-boundary]')?.getAttribute('data-not-found-boundary') ?? null,
    rendered: doc?.querySelector('[data-rendered-route]')?.getAttribute('data-rendered-route') ?? null,
  }
}

/**
 * 마커가 안정될 때까지 기다린다. 경계가 보이면 0.3초, 정상 화면이면 1.5초 동안 그대로여야 한다
 * (generateMetadata의 notFound()처럼 200 HTML이 먼저 그려진 뒤 클라이언트에서 경계로 교체되는 경우 대비).
 */
async function waitStableMarker(frame: HTMLIFrameElement, until?: (m: Marker) => boolean): Promise<Marker> {
  let last = readMarker(frame)
  let stableSince = Date.now()
  const deadline = Date.now() + 20000
  while (Date.now() < deadline) {
    await wait(150)
    const now = readMarker(frame)
    if (now.boundary !== last.boundary || now.rendered !== last.rendered) {
      last = now
      stableSince = Date.now()
    }
    const ready = until ? until(last) : Boolean(last.boundary || last.rendered)
    const settleMs = last.boundary ? 300 : 1500
    if (ready && Date.now() - stableSince >= settleMs) return last
  }
  return last
}

function loadFrame(frame: HTMLIFrameElement, url: string): Promise<void> {
  return new Promise((resolve) => {
    frame.addEventListener('load', () => resolve(), { once: true })
    frame.src = url
  })
}

/** 문서 요청의 실제 HTTP 상태: Navigation Timing(responseStatus) 우선, 미지원 브라우저는 별도 fetch */
async function readDocumentStatus(frame: HTMLIFrameElement, url: string): Promise<number | null> {
  const nav = frame.contentWindow?.performance.getEntriesByType('navigation')[0] as
    | (PerformanceNavigationTiming & { responseStatus?: number })
    | undefined
  if (nav?.responseStatus) return nav.responseStatus
  const res = await fetch(url, { cache: 'no-store' })
  return res.status
}

/**
 * 클릭 후 iframe이 보낸 fetch(RSC 요청 또는 Server Action POST)의 실제 상태.
 * Resource Timing의 responseStatus를 읽는다 (미지원 브라우저는 null).
 */
function readSubrequestStatus(frame: HTMLIFrameElement, since: number): number | null {
  const entries = (frame.contentWindow?.performance.getEntriesByType('resource') ?? []) as (PerformanceResourceTiming & {
    responseStatus?: number
  })[]
  const hit = entries
    .filter((e) => e.initiatorType === 'fetch' && e.startTime >= since && !e.name.includes('/api/probe'))
    .filter((e) => e.name.includes(PNF_BASE_PATH))
    .pop()
  return hit?.responseStatus || null
}

function sumAfter(p: ProbeSnapshot) {
  return Object.values(p.sites).reduce((acc, s) => acc + s.after, 0)
}
function sumRendered(p: ProbeSnapshot) {
  return Object.values(p.rendered).reduce((acc, n) => acc + n, 0)
}

async function runScenario(frame: HTMLIFrameElement, s: Scenario): Promise<ScenarioResult> {
  let before: ProbeSnapshot
  let marker: Marker
  // hard: 문서 응답 상태, soft: RSC 요청 상태(관찰용), action: Server Action POST 응답 상태
  let status: number | null = null
  let noReload: boolean | null = null

  if (s.mode === 'hard') {
    before = await readProbe()
    await loadFrame(frame, s.url)
    marker = await waitStableMarker(frame)
  } else {
    await loadFrame(frame, s.url)
    await waitStableMarker(frame, (m) => m.rendered === 'product-page')
    const win = frame.contentWindow as ProbeWindow
    win.__pnfNoReload = true
    before = await readProbe()
    const since = frame.contentWindow?.performance.now() ?? 0
    const target = frame.contentDocument?.querySelector<HTMLElement>(s.clickSelector ?? '')
    if (!target) throw new Error(`클릭 대상 없음: ${s.clickSelector}`)
    target.click()
    marker = await waitStableMarker(frame, (m) => Boolean(m.boundary))
    noReload = (frame.contentWindow as ProbeWindow).__pnfNoReload === true
    status = readSubrequestStatus(frame, since)
  }

  const after = await readProbe()
  if (s.mode === 'hard') status = await readDocumentStatus(frame, s.url)

  const site = s.expectSite as ProbeSite | null
  const reachedDelta = site
    ? after.sites[site].reached - before.sites[site].reached
    : Object.values(after.sites).reduce((a, x) => a + x.reached, 0) -
      Object.values(before.sites).reduce((a, x) => a + x.reached, 0)
  const afterDelta = sumAfter(after) - sumAfter(before)
  const renderedDelta = s.expectRendered
    ? after.rendered[s.expectRendered as RenderSite] - before.rendered[s.expectRendered as RenderSite]
    : sumRendered(after) - sumRendered(before)

  const matched =
    (s.expectStatus === null || status === s.expectStatus) &&
    marker.boundary === s.expectBoundary &&
    reachedDelta === (site ? 1 : 0) &&
    afterDelta === 0 &&
    renderedDelta === (s.expectRendered ? 1 : 0) &&
    (s.mode !== 'soft' || noReload === true)

  return { key: s.key, status, boundary: marker.boundary, renderedRoute: marker.rendered, reachedDelta, afterDelta, renderedDelta, noReload, matched }
}

export function useTriggerRunner() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [results, setResults] = useState<Record<string, ScenarioResult>>({})
  const [runningKey, setRunningKey] = useState<string | null>(null)

  const run = useCallback(async () => {
    const frame = frameRef.current
    if (!frame) return
    setResults({})
    for (const s of SCENARIOS) {
      setRunningKey(s.key)
      try {
        const r = await runScenario(frame, s)
        setResults((prev) => ({ ...prev, [s.key]: r }))
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        setResults((prev) => ({
          ...prev,
          [s.key]: { key: s.key, status: null, boundary: null, renderedRoute: null, reachedDelta: 0, afterDelta: 0, renderedDelta: 0, noReload: null, matched: false, error: message },
        }))
      }
    }
    setRunningKey(null)
    frame.src = 'about:blank'
  }, [])

  const clear = useCallback(() => setResults({}), [])

  return { frameRef, results, runningKey, run, clear }
}
