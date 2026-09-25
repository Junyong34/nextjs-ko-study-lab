'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { NAV_METHODS } from '../types'
import type { NavRecord } from '../types'
import { evaluateAll, evaluateRecord } from '../evaluate'

const EXPECTED = [
  '• 문서 스크롤(window.scrollY) — Page 상단이 뷰포트 밖에서 누른 경우:',
  '  Link · 기본 / push · 기본: Page 상단이 보이도록 위로 이동 (scrollY 감소)',
  '  Link scroll={false} / push·replace { scroll: false }: scrollY 전 = 후',
  '• 목록 컨테이너 스크롤(scrollTop) — 방법과 무관:',
  '  패널 A(key 없음): 같은 DOM 노드 → scrollTop 유지',
  '  패널 B(key={cat}): 새 DOM 노드 → scrollTop 0 (가이드의 key 초기화)',
  '• 서버: Page(Server Component)가 새 ?cat=을 받아 새 렌더 ID로 렌더링',
  '• 모든 이동: iframe 문서 timeOrigin 불변 = 문서 재로드 없음',
].join('\n')

function formatActual(records: NavRecord[], baseTimeOrigin: number | null, frameLoads: number) {
  if (records.length === 0) return '• 대기 중 — 실습 창에서 필터 버튼을 눌러 주세요.'
  const rows = records.map((r) => ({ r, v: evaluateRecord(r, baseTimeOrigin) }))
  const lines = NAV_METHODS.map((cfg) => {
    const mine = rows.filter((row) => row.r.method === cfg.method)
    if (mine.length === 0) return `• ${cfg.label}: 기록 없음`
    // 불일치 → 판별 가능한 기록 → 마지막 기록 순으로 대표값을 고른다
    const { r, v } =
      mine.find((m) => !m.v.pass) ?? [...mine].reverse().find((m) => m.v.decisive) ?? mine[mine.length - 1]
    const verdict = v.pass ? '일치' : '불일치'
    const note = v.decisive || !v.pass ? '' : ' (판별 불가 조건 — [측정 준비] 후 다시)'
    return (
      `• ${cfg.label}: scrollY ${r.beforeY}→${r.afterY} · A ${r.keptBefore}→${r.keptAfter}` +
      ` · B ${r.keyedBefore}→${r.keyedAfter} · 서버 ${r.receivedSearch} [${verdict}]${note}`
    )
  })
  const origins = new Set(records.map((r) => r.timeOrigin))
  lines.push(
    `• 문서 로드 ${frameLoads}회 · 기록 ${records.length}건의 timeOrigin 종류 ${origins.size}개` +
      (baseTimeOrigin !== null && origins.size === 1 && origins.has(baseTimeOrigin) ? ' (기준과 동일)' : ''),
  )
  lines.push(`• 카운터 순서: ${records.map((r) => r.seq).join(',')}`)
  return lines.join('\n')
}

export function RetentionVerification({
  records,
  baseTimeOrigin,
  frameLoads,
}: {
  records: NavRecord[]
  baseTimeOrigin: number | null
  frameLoads: number
}) {
  const { isMatched, missing } = evaluateAll(records, baseTimeOrigin)
  const missingText =
    missing.length > 0
      ? ` 아직 판별 가능한 기록이 없는 방법: ${missing
          .map((m) => NAV_METHODS.find((c) => c.method === m)?.label)
          .join(', ')}.`
      : ''

  return (
    <ExpectedActualPanel
      title="searchParams만 바뀌는 필터 이동의 scrollY · scrollTop 실측"
      // 문자열끼리 넘기면 패널이 자동 비교해 초기 상태를 "불일치"로 표시하므로 JSX로 감싼다
      expected={<span>{EXPECTED}</span>}
      actual={<span>{formatActual(records, baseTimeOrigin, frameLoads)}</span>}
      isMatched={isMatched}
      className="min-w-0"
      description={
        'Expected는 공식 문서(Link#scroll, useRouter의 scroll 옵션, Preserving UI state 가이드)의 규칙이고, ' +
        'Actual은 iframe 문서에서 클릭 직전과 이동 완료 2프레임 뒤에 읽은 window.scrollY·scrollTop·서버 렌더 값입니다. ' +
        '5가지 방법 모두 "판별 가능한 조건"(Page 상단이 뷰포트 밖, 두 패널 모두 스크롤됨)에서 일치해야 검증 완료입니다.' +
        missingText
      }
    />
  )
}
