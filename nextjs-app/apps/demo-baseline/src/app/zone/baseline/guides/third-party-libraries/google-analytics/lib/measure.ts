import { DEMO_GA_ID, DEMO_EVENT_NAME, DEMO_EVENT_PARAMS, GA_SCRIPT_SRC, type GaSnapshot, type PushResult } from '../types'

type Layer = ArrayLike<unknown>[] & { length: number }

function readLayer(): Layer | undefined {
  return (window as unknown as { dataLayer?: Layer }).dataLayer
}

// gtag()는 arguments 객체를 push한다. 화면 표시·비교를 위해 일반 배열로 바꾼다.
export function toArray(entry: unknown): unknown[] {
  if (entry && typeof entry === 'object' && 'length' in entry) return Array.from(entry as ArrayLike<unknown>)
  return [entry]
}

/** 페이지 출처가 아닌 호스트로 나간 요청을 호스트별로 센다 */
export function countExternalHosts(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const e of performance.getEntriesByType('resource')) {
    const host = new URL(e.name).host
    if (host !== location.host) counts[host] = (counts[host] ?? 0) + 1
  }
  return counts
}

export function readSnapshot(): GaSnapshot {
  const init = document.getElementById('_next-ga-init')
  const ext = document.getElementById('_next-ga') as HTMLScriptElement | null
  const layer = readLayer()
  const commands = layer
    ? Array.from(layer).map(toArray).filter((a) => typeof a[0] === 'string').map((a) => String(a[0]))
    : []
  const collectRequests = performance
    .getEntriesByType('resource')
    .filter((e) => /google-analytics\.com|\/g\/collect/.test(e.name)).length
  return {
    initScript: init !== null,
    initHasConfig: init?.textContent?.includes(`gtag('config', '${DEMO_GA_ID}'`) ?? false,
    extScriptSrc: ext?.getAttribute('src') ?? null,
    extStrategy: ext?.getAttribute('data-nscript') ?? null,
    preloadLink: document.querySelector(`link[rel="preload"][href="${GA_SCRIPT_SRC}"]`) !== null,
    dataLayerLength: layer ? layer.length : null,
    gtagType: typeof (window as unknown as { gtag?: unknown }).gtag,
    commands,
    externalHosts: countExternalHosts(),
    collectRequests,
  }
}

/** fn 실행 직전·직후 dataLayer 길이를 재고, 늘어난 항목만 돌려준다(동기 구간이라 다른 push가 끼어들 수 없다). */
export function measurePush(phase: PushResult['phase'], fn: () => void): PushResult {
  const before = readLayer()?.length ?? null
  fn()
  const layer = readLayer()
  const after = layer?.length ?? null
  const pushed = layer && after !== null ? Array.from(layer).slice(before ?? 0, after).map(toArray) : []
  return { phase, before, after, pushed, at: new Date().toLocaleTimeString('ko-KR') }
}

/** push된 항목 중 데모 이벤트가 정확한 이름·파라미터로 들어갔는지 */
export function isDemoEventPushed(result: PushResult): boolean {
  const delta = (result.after ?? 0) - (result.before ?? 0)
  const entry = result.pushed.find((a) => a[0] === 'event' && a[1] === DEMO_EVENT_NAME)
  return delta === 1 && entry !== undefined && JSON.stringify(entry[2]) === JSON.stringify(DEMO_EVENT_PARAMS)
}

/** DOM에 GoogleAnalytics 컴포넌트가 만든 흔적이 문서대로 남았는지 */
export function isDomAsDocumented(s: GaSnapshot | null): boolean {
  return Boolean(
    s && s.initScript && s.initHasConfig && s.extScriptSrc === GA_SCRIPT_SRC &&
      s.extStrategy === 'afterInteractive' && s.gtagType === 'function' &&
      s.commands.includes('js') && s.commands.includes('config'),
  )
}
