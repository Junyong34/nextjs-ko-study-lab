import type { InjectionResult, NonceSample, Violation } from '../types'

const NONCE_RE = /'nonce-([^']+)'/

export const nonceFromCsp = (csp: string | null) => csp?.match(NONCE_RE)?.[1] ?? null

/** 현재 페이지를 새로 요청한다. 같은 응답의 헤더와 HTML을 함께 읽어 서로 대조한다. */
export async function sampleNonce(): Promise<NonceSample> {
  const res = await fetch(window.location.href, { cache: 'no-store', headers: { Accept: 'text/html' } })
  const csp = res.headers.get('content-security-policy')
  const html = await res.text()
  const htmlNonces = [...new Set([...html.matchAll(/nonce="([^"]+)"/g)].map((m) => m[1]))]
  const scriptSrc = csp?.split(';').find((d) => d.trim().startsWith('script-src')) ?? ''
  return {
    status: res.status,
    headerNonce: nonceFromCsp(csp),
    htmlNonces,
    strict: !!scriptSrc && !scriptSrc.includes("'unsafe-inline'"),
  }
}

/**
 * 공격자가 HTML을 주입했다고 가정하고, nonce 없는 인라인 이벤트 핸들러를 가진 요소를 DOM에 넣는다.
 * script-src에 'unsafe-inline'이 없으므로 브라우저가 핸들러 실행을 막고 securitypolicyviolation을 발생시킨다.
 */
export function attemptInjection(host: HTMLElement): Promise<InjectionResult> {
  return new Promise((resolve) => {
    const violations: Violation[] = []
    window.__cspInjectionRan = undefined
    const onViolation = (e: SecurityPolicyViolationEvent) =>
      violations.push({ directive: e.violatedDirective, sample: e.sample, origin: 'injection' })
    document.addEventListener('securitypolicyviolation', onViolation)
    host.innerHTML = '<img alt="" src="data:," onerror="window.__cspInjectionRan=true">'
    // 이벤트와 onerror는 모두 비동기로 처리되므로 잠시 기다렸다가 결과를 읽는다.
    setTimeout(() => {
      document.removeEventListener('securitypolicyviolation', onViolation)
      host.innerHTML = ''
      resolve({ ran: window.__cspInjectionRan === true, violations })
    }, 400)
  })
}
