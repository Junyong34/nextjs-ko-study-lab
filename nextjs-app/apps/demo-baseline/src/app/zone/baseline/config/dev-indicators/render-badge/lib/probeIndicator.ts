import type { Corner, IndicatorProbe } from '../types'

// next@16.3.2 dev 오버레이는 <nextjs-portal> 커스텀 요소에 open shadow root를 붙이고 그 안에 표시기를 그린다.
// 표시기 선택자는 next/dist/compiled/next-devtools 번들에서 확인한 이름이며, 공개 API가 아니므로 버전이 바뀌면 달라질 수 있다.
const INDICATOR_SELECTORS = ['#devtools-indicator', '[data-nextjs-toast]', '[data-nextjs-dev-tools-button]']

function cornerOf(rect: DOMRect): Corner {
  const vertical = rect.top + rect.height / 2 < window.innerHeight / 2 ? 'top' : 'bottom'
  const horizontal = rect.left + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right'
  return `${vertical}-${horizontal}`
}

export function probeIndicator(): IndicatorProbe {
  const portals = document.querySelectorAll('nextjs-portal')
  const shadow = portals[0]?.shadowRoot ?? null
  let indicator: Element | null = null
  for (const selector of INDICATOR_SELECTORS) {
    indicator = shadow?.querySelector(selector) ?? null
    if (indicator) break
  }
  const box = indicator?.getBoundingClientRect() ?? null
  const visible = box !== null && box.width > 0 && box.height > 0

  return {
    measuredAt: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV ?? 'unknown',
    inIframe: window.self !== window.top,
    portalCount: portals.length,
    shadowReadable: shadow !== null,
    indicatorFound: visible,
    rect: visible ? { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) } : null,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    corner: visible ? cornerOf(box) : null,
    routeType: shadow?.querySelector('[data-nextjs-route-type]')?.getAttribute('data-nextjs-route-type') ?? null,
  }
}
