import { conditionRules, type ConditionRule, type HasItem } from '@/config/demo-next-config/redirects-condition'
import type { ProbeOutcome, SentRequest, Verdict } from '../types'

const hostname = (host: string) => host.replace(/:\d+$/, '')

function readValue(item: HasItem, req: SentRequest): string | undefined {
  switch (item.type) {
    case 'header':
      return req.headers[item.key.toLowerCase()]
    case 'cookie': {
      const pairs = (req.headers.cookie ?? '').split(/;\s*/).map((p) => p.split('='))
      return pairs.find(([k]) => k === item.key)?.[1]
    }
    case 'query':
      return new URLSearchParams(req.search).get(item.key) ?? undefined
    case 'host':
      return hostname(req.host)
  }
}

/** 문서가 설명하는 has/missing 의미를 규칙 데이터에 직접 적용해 "기대 동작"을 계산한다. 서버 응답과는 독립적이다. */
function evaluate(rule: ConditionRule, req: SentRequest): { hit: boolean; captures: Record<string, string> } {
  const captures: Record<string, string> = {}
  const matches = (item: HasItem) => {
    const actual = readValue(item, req)
    if (actual === undefined) return false
    if (item.value === undefined) return true
    // value는 전체 일치 정규식이며 이름 캡처 그룹은 destination에서 :이름으로 쓴다.
    const m = new RegExp(`^${item.value}$`).exec(actual)
    if (m?.groups) Object.assign(captures, m.groups)
    return m !== null
  }
  const hit = (rule.has ?? []).every(matches) && !(rule.missing ?? []).some(matches)
  return { hit, captures }
}

function expectedLocation(rule: ConditionRule, req: SentRequest, captures: Record<string, string>) {
  const [path, destQuery = ''] = rule.destination.replace(/:(\w+)/g, (_, name) => captures[name] ?? '').split('?')
  // 원래 요청의 쿼리는 destination으로 그대로 전달되고, destination에 적힌 쿼리가 더해진다.
  const params = new URLSearchParams(req.search)
  new URLSearchParams(destQuery).forEach((v, k) => params.set(k, v))
  return { path, params }
}

const sortedParams = (p: URLSearchParams) => [...p.entries()].sort().join('&')

export function judge(outcome: ProbeOutcome): Verdict {
  const rule = conditionRules.find((r) => r.id === outcome.sent.rule)!
  const { hit, captures } = evaluate(rule, outcome.sent)
  const expected = hit ? expectedLocation(rule, outcome.sent, captures) : null
  const expectedText = expected ? `${expected.path}?${expected.params}` : null

  if (outcome.error || outcome.status === null) {
    return { expectRedirect: hit, expectedLocation: expectedText, matched: false, reason: `요청 실패: ${outcome.error}` }
  }
  if (!hit) {
    const ok = outcome.status === 200 && outcome.location === null
    return { expectRedirect: false, expectedLocation: null, matched: ok, reason: ok ? '조건 미충족 → 리다이렉트 없이 통과(200)' : `통과(200)해야 하는데 ${outcome.status}${outcome.location ? ` → ${outcome.location}` : ''}를 받음` }
  }
  const actual = outcome.location ? new URL(outcome.location, 'http://x') : null
  const ok = outcome.status === 307 && actual?.pathname === expected!.path && sortedParams(actual.searchParams) === sortedParams(expected!.params)
  return { expectRedirect: true, expectedLocation: expectedText, matched: ok, reason: ok ? '조건 충족 → 307과 기대한 Location' : `307과 ${expectedText}를 기대했는데 ${outcome.status} ${outcome.location ?? '(Location 없음)'}를 받음` }
}
