import { LD_SELECTOR, PRODUCT_SCRIPT_ID, serializeJsonLdSafe } from '../json-ld'
import type { FieldRow, ParseContrast, ProductJsonLd, ProductRecord, SsrProbe } from '../types'

function countOf(text: string, needle: string): number {
  return text.split(needle).length - 1
}

function readPath(value: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, value)
}

/** JSON.parse 결과를 서버 데이터 원본(ProductRecord)과 필드별로 대조한다. */
function compareFields(parsed: unknown, product: ProductRecord): FieldRow[] {
  const expected: Array<[string, unknown]> = [
    ['@type', 'Product'],
    ['sku', product.sku],
    ['name', product.name],
    ['brand.name', product.brand],
    ['description', product.description],
    ['offers.price', product.price],
    ['offers.priceCurrency', product.priceCurrency],
    ['offers.availability', `https://schema.org/${product.availability}`],
  ]
  return expected.map(([path, want]) => {
    const got = readPath(parsed, path)
    return { path, expected: String(want), actual: got === undefined ? '(없음)' : String(got), ok: got === want }
  })
}

/**
 * 이 페이지의 HTML 원문을 다시 받아 DOMParser로 파싱한다.
 * DOMParser 문서는 스크립트를 실행하지 않으므로, JS를 실행하지 않는 크롤러가 보는 상태와 같다.
 */
export async function probeSsrHtml(product: ProductRecord, jsonLd: ProductJsonLd): Promise<SsrProbe> {
  const requestedPath = window.location.pathname
  const res = await fetch(requestedPath, { cache: 'no-store' })
  const html = await res.text()
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const scripts = Array.from(doc.querySelectorAll<HTMLScriptElement>(LD_SELECTOR))
  const target = doc.getElementById(PRODUCT_SCRIPT_ID)
  const rawText = target?.textContent ?? ''

  let parsed: unknown = null
  let parseError: string | null = null
  if (target) {
    try {
      parsed = JSON.parse(rawText)
    } catch (err: unknown) {
      parseError = String(err)
    }
  }

  return {
    requestedPath,
    status: res.status,
    contentType: res.headers.get('content-type'),
    htmlBytes: new Blob([html]).size,
    ldScriptCount: scripts.length,
    found: Boolean(target),
    parentTag: target?.parentElement?.tagName.toLowerCase() ?? null,
    inBody: Boolean(target?.closest('body')),
    offset: target ? html.indexOf(`id="${PRODUCT_SCRIPT_ID}"`) : -1,
    rawText,
    rawLtCount: countOf(rawText, '<'),
    escapedLtCount: countOf(rawText, '\\u003c'),
    matchesSafeSerializer: rawText === serializeJsonLdSafe(jsonLd),
    parseError,
    fields: parsed ? compareFields(parsed, product) : [],
    liveDomCount: document.querySelectorAll(LD_SELECTOR).length,
    fetchedAt: new Date().toISOString(),
  }
}

/**
 * 직렬화 문자열 하나를 <script type="application/ld+json">에 넣은 HTML 조각으로 만들고
 * 격리된 DOMParser 문서에서 파싱한다. DOMParser 문서는 스크립트를 실행하지 않고 리소스도 불러오지 않는다.
 */
export function parseInIsolatedDocument(
  label: string,
  serialized: string,
  product: ProductRecord,
  injectionMarker: string,
): ParseContrast {
  const html = `<!doctype html><html><head></head><body><script type="application/ld+json">${serialized}</script></body></html>`
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const scripts = Array.from(doc.querySelectorAll<HTMLScriptElement>(LD_SELECTOR))
  const scriptText = scripts[0]?.textContent ?? ''

  let jsonOk = false
  let jsonError: string | null = null
  let descriptionRoundTrip = false
  try {
    const parsed = JSON.parse(scriptText) as { description?: unknown }
    jsonOk = true
    descriptionRoundTrip = parsed.description === product.description
  } catch (err: unknown) {
    jsonError = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
  }

  // 스크립트 경계 밖으로 새어 나온 텍스트(= 본문 텍스트 노드)
  const leakedText = Array.from(doc.body.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent ?? '')
    .join('')

  return {
    label,
    serialized,
    scriptCount: scripts.length,
    scriptText,
    jsonOk,
    jsonError,
    injectedCount: doc.querySelectorAll(`[data-injected="${injectionMarker}"]`).length,
    leakedText,
    descriptionRoundTrip,
  }
}
