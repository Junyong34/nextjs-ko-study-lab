import { ROOT_TITLE_SUFFIX, ROUTES, displayRel, expectedLayouts, layoutFilesOf, shortFile } from './routes'
import type { CheckResult, RouteObservation } from './types'

const list = (files: string[]) => (files.length ? files.map(shortFile).join(' > ') : '(없음)')

/** 루트 layout의 필수 요소: 조상 체인 맨 바깥이 html > body이고, 문서 전체에 html·body가 하나씩뿐인지 */
export function checkRootElements(observed: RouteObservation[]): CheckResult {
  const label = '루트 layout의 html/body'
  if (observed.length === 0) return { label, status: 'pending', detail: '아직 관측한 경로가 없습니다.' }
  const bad = observed.filter(
    (o) =>
      o.chain[0]?.kind !== 'html' ||
      o.chain[1]?.kind !== 'body' ||
      (o.chain[0].kind === 'html' && o.chain[0].lang !== 'ko') ||
      o.htmlCount !== 1 ||
      o.bodyCount !== 1,
  )
  const sample = observed[observed.length - 1]
  const lang = sample.chain[0]?.kind === 'html' ? sample.chain[0].lang : '(html 아님)'
  const summary = `${observed.length}개 경로 관측, html lang="${lang}", html ${sample.htmlCount}개·body ${sample.bodyCount}개`
  if (bad.length > 0) {
    return { label, status: 'fail', detail: `${summary} / 어긋난 경로: ${bad.map((o) => displayRel(o.rel)).join(', ')}` }
  }
  return { label, status: 'pass', detail: `${summary}, 모든 체인이 html > body로 시작` }
}

/** 루트 layout metadata의 title.template이 모든 경로의 document.title에 적용되는지 */
export function checkRootMetadata(observed: RouteObservation[]): CheckResult {
  const label = '루트 metadata(title.template)'
  const withTitle = observed.filter((o) => o.title)
  if (withTitle.length === 0) return { label, status: 'pending', detail: 'document.title을 아직 읽지 못했습니다.' }
  const bad = withTitle.filter((o) => !o.title.endsWith(ROOT_TITLE_SUFFIX) || o.headTitleCount !== 1)
  const last = withTitle[withTitle.length - 1]
  const summary = `${withTitle.length}개 경로 중 접미사 일치 ${withTitle.length - bad.length}개, 예: "${last.title}" (title 요소 ${last.headTitleCount}개)`
  return { label, status: bad.length ? 'fail' : 'pass', detail: summary }
}

/** 다섯 경로 모두에서 실제로 감싼 layout 목록·순서가 파일 위치 규칙과 같은지 (Link 이동 4회 이상 포함) */
export function checkNestingScope(observations: Record<string, RouteObservation>): CheckResult {
  const label = '중첩 순서와 적용 범위'
  const seen = ROUTES.filter((r) => observations[r.rel])
  const mismatched = seen.filter((r) => {
    const actual = layoutFilesOf(observations[r.rel].chain)
    return actual.join('|') !== expectedLayouts(r.rel).join('|')
  })
  if (mismatched.length > 0) {
    const r = mismatched[0]
    return {
      label,
      status: 'fail',
      detail: `${displayRel(r.rel)}: 실제 ${list(layoutFilesOf(observations[r.rel].chain))} / 기대 ${list(expectedLayouts(r.rel))}`,
    }
  }
  const viaLink = seen.filter((r) => observations[r.rel].via === 'link').length
  const progress = `${seen.length}/${ROUTES.length}개 경로 일치, Link 이동으로 관측 ${viaLink}개`
  if (seen.length < ROUTES.length || viaLink < ROUTES.length - 1) {
    return { label, status: 'pending', detail: `${progress} — 나머지 경로를 위 링크로 이동해 관측하세요.` }
  }
  const tops = observations['clothing/tops']
  return { label, status: 'pass', detail: `${progress}, 예: /clothing/tops는 ${list(layoutFilesOf(tops.chain))}` }
}

export function summarize(checks: CheckResult[]): boolean | undefined {
  if (checks.some((c) => c.status === 'fail')) return false
  if (checks.every((c) => c.status === 'pass')) return true
  return undefined
}
