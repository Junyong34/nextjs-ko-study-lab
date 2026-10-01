import type { InjectionResult, NonceSample, PageSnapshot } from '../types'

export interface Check {
  id: string
  label: string
  /** undefined이면 아직 측정 전이다 */
  ok: boolean | undefined
  detail: string
}

const short = (v: string | null | undefined) => (v ? `${v.slice(0, 12)}…` : '없음')

/** 측정값만으로 판정한다. 하드코딩된 성공 값은 없다. */
export function judge(page: PageSnapshot, samples: NonceSample[], injection: InjectionResult | null): Check[] {
  const d = page.demo
  const ready = !!d && !!page.serverNonce
  const parseBlocked = d?.violations.find((v) => v.origin === 'parse')
  const nonceScripts = ready ? d!.nonceRan && d!.scriptNonce === page.serverNonce : undefined
  const [a, b] = samples

  return [
    {
      id: 'executed',
      label: 'nonce가 일치하는 인라인 스크립트는 실행된다',
      ok: nonceScripts,
      detail: ready
        ? `실행=${d!.nonceRan}, script.nonce=${short(d!.scriptNonce)}, 서버 x-nonce=${short(page.serverNonce)}`
        : '관찰 대기 중',
    },
    {
      id: 'blocked',
      label: 'nonce 없는 인라인 스크립트는 차단되고 위반 이벤트가 남는다',
      ok: ready ? !d!.blockedRan && !!parseBlocked : undefined,
      detail: ready
        ? `실행=${d!.blockedRan}, securitypolicyviolation=${parseBlocked ? parseBlocked.directive : '없음'}`
        : '관찰 대기 중',
    },
    {
      id: 'next-script',
      label: 'next/script의 nonce prop이 DOM 요소에 적용된다',
      ok: ready ? d!.nextScriptRan && d!.nextScriptNonce === page.serverNonce : undefined,
      detail: ready ? `실행=${d!.nextScriptRan}, script.nonce=${short(d!.nextScriptNonce)}` : '관찰 대기 중',
    },
    {
      id: 'header-html',
      label: '응답 헤더의 CSP nonce와 같은 응답 HTML의 nonce 속성이 일치한다',
      ok: a ? !!a.headerNonce && a.htmlNonces.length > 0 && a.htmlNonces.every((n) => n === a.headerNonce) && a.strict : undefined,
      detail: a
        ? `헤더=${short(a.headerNonce)}, HTML nonce ${a.htmlNonces.length}종=${a.htmlNonces.map(short).join(', ') || '없음'}, unsafe-inline 없음=${a.strict}`
        : '[새 요청으로 nonce 확인]을 눌러 주세요',
    },
    {
      id: 'per-request',
      label: '요청마다 nonce가 새로 만들어진다',
      ok: a && b ? !!a.headerNonce && !!b.headerNonce && a.headerNonce !== b.headerNonce && a.headerNonce !== page.serverNonce : undefined,
      detail: a && b ? `요청1=${short(a.headerNonce)}, 요청2=${short(b.headerNonce)}, 이 페이지=${short(page.serverNonce)}` : '새 요청을 2회 이상 실행해 주세요',
    },
    {
      id: 'reload',
      label: '새로고침 후 이 페이지의 nonce가 이전 로드와 다르다',
      ok: page.previousNonce && page.serverNonce ? page.previousNonce !== page.serverNonce : undefined,
      detail: page.previousNonce ? `이전 로드=${short(page.previousNonce)}, 지금=${short(page.serverNonce)}` : '이전 로드 기록 없음 — 브라우저 새로고침을 한 번 해 보세요',
    },
    {
      id: 'injection',
      label: '주입된 onerror 핸들러는 실행되지 않고 위반 이벤트가 발생한다',
      ok: injection ? !injection.ran && injection.violations.length > 0 : undefined,
      detail: injection
        ? `실행=${injection.ran}, 위반=${injection.violations.map((v) => v.directive).join(', ') || '없음'}`
        : '[XSS 주입 시도]를 눌러 주세요',
    },
  ]
}

/** 하나라도 실패면 false, 전부 통과면 true, 그 외는 대기. */
export function overall(checks: Check[]): boolean | undefined {
  if (checks.some((c) => c.ok === false)) return false
  if (checks.every((c) => c.ok === true)) return true
  return undefined
}
