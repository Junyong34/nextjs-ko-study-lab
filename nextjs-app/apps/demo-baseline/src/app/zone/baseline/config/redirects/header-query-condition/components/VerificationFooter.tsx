import { ExpectedActualPanel } from '@study/demo-kit'
import type { ProbeEntry } from '../types'
import { ConditionDeepDive } from './ConditionDeepDive'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>has의 모든 항목이 맞고 missing 항목이 하나도 없을 때만 307과 destination이 Location으로 돌아온다.</li>
    <li>조건이 하나라도 어긋나면 리다이렉트 없이 Route Handler까지 통과해 200을 받는다.</li>
    <li>query 규칙은 캡처한 값이 destination의 :campaign 자리에 들어가고, 원래 쿼리(ref)도 함께 전달된다.</li>
    <li>충족 요청과 미충족 요청을 각각 한 번 이상 보내 두 경우를 모두 확인한다.</li>
  </ul>
)

export function VerificationFooter({ history }: { history: ProbeEntry[] }) {
  const mismatches = history.filter((e) => !e.verdict.matched)
  const redirected = history.filter((e) => e.outcome.location !== null).length
  const passed = history.filter((e) => e.outcome.status === 200).length

  let isMatched: boolean | undefined
  let actual: React.ReactNode = '• 대기 중: 규칙을 고르고 [서버에서 실제 요청 보내기]를 눌러 보세요.'
  let description = '서버가 실제로 받은 응답(상태 코드, Location, 본문)으로만 판정합니다.'

  if (history.length > 0) {
    const latest = history[0]
    isMatched = mismatches.length > 0 ? false : redirected > 0 && passed > 0 ? true : undefined
    actual = (
      <ul className="space-y-1">
        <li>최신 #{latest.id}: {latest.outcome.status ?? '오류'} {latest.outcome.location ? `→ ${latest.outcome.location}` : ''}</li>
        <li>판정: {latest.verdict.reason}</li>
        <li>누적 {history.length}건 · 리다이렉트 {redirected}건 · 통과 {passed}건 · 불일치 {mismatches.length}건</li>
        {mismatches.length === 0 && isMatched === undefined && <li>아직 {redirected === 0 ? '조건을 충족한' : '조건을 충족하지 않은'} 요청이 없습니다. 반대 경우도 보내 보세요.</li>}
      </ul>
    )
    if (mismatches.length > 0) {
      description = `기대와 다른 응답이 있습니다(#${mismatches.map((m) => m.id).join(', #')}). 설정을 고친 직후라면 dev 서버를 재시작했는지 확인하세요 — next.config의 redirects()는 서버 시작 때 한 번 읽습니다.`
    }
  }

  return (
    <div className="space-y-4">
      <ExpectedActualPanel title="redirects() has/missing 조건 검증" expected={EXPECTED} actual={actual} isMatched={isMatched} description={description} />
      <ConditionDeepDive />
    </div>
  )
}
