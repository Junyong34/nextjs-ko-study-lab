import type { DomProbeResult, ServerProbeResult } from '../types'

/** ProductShelf가 쓰는 tone 중 첫 번째(sale)의 배경색 — 규칙이 실제로 적용되면 이 값이 계산된다 */
export const EXPECTED_BACKGROUND = 'rgb(185, 28, 28)'

export interface Check {
  label: string
  pass: boolean
}

export interface Judgement {
  /** 둘 다 실측했고 모두 통과하면 true, 하나라도 어긋나면 false, 아직 덜 측정했으면 undefined */
  matched: boolean | undefined
  actual: string[]
}

const mark = (pass: boolean) => (pass ? '일치' : '불일치')

export function judgeServer(server: ServerProbeResult): { checks: Check[]; lines: string[] } {
  const { withRegistry: w, withoutRegistry: wo } = server
  const checks: Check[] = [
    { label: 'registry 있음: head에 <style data-registry> 삽입', pass: w.headTagCount >= 1 },
    { label: 'registry 있음: 규칙이 첫 사용 요소보다 앞에 위치', pass: w.styleBeforeFirstUse },
    { label: 'registry 있음: 사용 클래스 전부에 규칙 존재 + 중복 규칙 없음', pass: w.unstyledClasses.length === 0 && w.duplicateRules.length === 0 && w.ruleClasses.length > 0 },
    { label: 'registry 없음: 첫 HTML에 <style> 없음 (FOUC 발생)', pass: wo.styleTagCount === 0 && wo.unstyledClasses.length === wo.usedClasses.length && wo.usedClasses.length > 0 },
  ]
  const fouc = (a: typeof w) => (a.unstyledClasses.length > 0 ? 'FOUC 발생' : 'FOUC 없음')
  const lines = [
    `• [서버 원본 HTML ${server.fetchedAt}] registry 있음 HTTP ${w.status}: <style> ${w.styleTagCount}개(head ${w.headTagCount}), 사용 요소 ${w.usageCount}회 → 규칙 ${w.ruleClasses.length}개 (${fouc(w)})`,
    `• registry 없음 HTTP ${wo.status}: <style> ${wo.styleTagCount}개, 규칙 없는 클래스 ${wo.unstyledClasses.length}/${wo.usedClasses.length}개 (${fouc(wo)})`,
    ...checks.map((c) => `  - ${c.label}: ${mark(c.pass)}`),
  ]
  return { checks, lines }
}

export function judgeDom(dom: DomProbeResult): { checks: Check[]; lines: string[] } {
  const ssrTags = dom.tags.filter((t) => t.source === 'ssr')
  const clientTags = dom.tags.filter((t) => t.source === 'client')
  const checks: Check[] = [
    { label: '하이드레이션 후에도 SSR <style>이 head에 남아 있음', pass: ssrTags.length >= 1 && ssrTags.every((t) => t.parent === 'HEAD') },
    { label: 'SSR 규칙을 client registry가 재사용(adopted = SSR 규칙 수), 재주입 없음', pass: dom.adopted > 0 && dom.adopted === ssrTags.reduce((n, t) => n + t.ruleCount, 0) },
    { label: `클라이언트 신규 규칙만 주입 (주입 ${dom.injected} = 추가 ${dom.dynamicAdds}회)`, pass: dom.injected === dom.dynamicAdds && clientTags.reduce((n, t) => n + t.ruleCount, 0) === dom.dynamicAdds },
    { label: '같은 selector 규칙 중복 없음', pass: dom.duplicateSelectors.length === 0 },
    { label: `계산된 배경색 ${EXPECTED_BACKGROUND}`, pass: dom.computedBackground === EXPECTED_BACKGROUND },
  ]
  const lines = [
    `• [하이드레이션 후 DOM ${dom.measuredAt}] <style data-registry> ${dom.tags.length}개: ` +
      (dom.tags.map((t) => `${t.source}@${t.parent}(규칙 ${t.ruleCount})`).join(', ') || '없음'),
    `• registry 통계: 등록 ${dom.registered} / 재사용 ${dom.adopted} / 클라이언트 주입 ${dom.injected}, getComputedStyle 배경색 ${dom.computedBackground || '-'}`,
    ...checks.map((c) => `  - ${c.label}: ${mark(c.pass)}`),
  ]
  return { checks, lines }
}

export function judge(server: ServerProbeResult | null, dom: DomProbeResult | null): Judgement {
  const parts = [server ? judgeServer(server) : null, dom ? judgeDom(dom) : null]
  const measured = parts.filter((p): p is NonNullable<typeof p> => p !== null)
  const actual = measured.flatMap((p) => p.lines)
  if (measured.length === 0) return { matched: undefined, actual }

  if (measured.length < 2) actual.push(`• ${server ? '하이드레이션 후 DOM 실측' : '서버 원본 HTML 실측'}이 아직 남아 있습니다.`)
  const failed = measured.some((p) => p.checks.some((c) => !c.pass))
  return { matched: failed ? false : measured.length === 2 ? true : undefined, actual }
}
