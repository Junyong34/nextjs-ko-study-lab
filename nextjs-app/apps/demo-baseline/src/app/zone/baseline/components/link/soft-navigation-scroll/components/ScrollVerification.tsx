'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { NAV_KINDS } from '../types'
import type { NavRecord } from '../types'
import { evaluateAll, evaluateSequence } from '../scroll-evaluate'

const EXPECTED = [
  '• 다음 장 · 기본(scroll 미지정 = true):',
  '  Page 상단이 뷰포트 밖이면 scrollTop = 0 → Page 상단이 보임',
  '  (이미 보이면 위치 유지 — "상단 강제 이동"이 아님)',
  '• 다음 장 · scroll={false}: scrollY 전 = 후',
  '• #s-5 · 기본: 대상 rect.top = scroll-margin-top (scrollIntoView)',
  '• #s-3 · scroll={false}: URL 해시만 바뀌고 scrollY 전 = 후',
  '  (같은 해시 재클릭은 스크롤 없음 — 그 해시가 남아 다음 기본 Page',
  '   이동이 새 Page의 같은 id로 스크롤됨: 16.3.2 실측 동작)',
  '• 모든 이동: iframe 문서 timeOrigin 불변, 레이아웃 카운터 연속',
  '  = 전체 문서 리로드 없는 소프트 내비게이션',
].join('\n')

function formatActual(records: NavRecord[], baseTimeOrigin: number | null, frameLoads: number) {
  if (records.length === 0) return '• 대기 중 — 실습 창에서 링크를 눌러 주세요.'
  const rows = evaluateSequence(records, baseTimeOrigin)
  const lines = NAV_KINDS.map((cfg) => {
    const mine = rows.filter((row) => row.record.kind === cfg.kind)
    if (mine.length === 0) return `• ${cfg.label}: 기록 없음`
    // 불일치 → 판별 가능한 기록 → 마지막 기록 순으로 대표값을 고른다
    const row =
      mine.find((m) => !m.verdict.pass) ??
      [...mine].reverse().find((m) => m.verdict.decisive) ??
      mine[mine.length - 1]
    const { record: pick, verdict: v } = row
    const hash =
      pick.targetTopAfter !== null ? ` · 대상 top ${pick.targetTopAfter}/margin ${pick.scrollMarginTop}` : ''
    const note = v.decisive || !v.pass ? '' : ' (판별 불가 조건 — 더 내려서 다시)'
    const verdictText = v.pass ? '일치' : `불일치 — 기대: ${v.expected}`
    return `• ${cfg.label}: scrollY ${pick.beforeY} → ${pick.afterY}${hash} [${verdictText}]${note}`
  })
  const origins = new Set(records.map((r) => r.timeOrigin))
  const seqs = records.map((r) => r.seq).join(',')
  lines.push(
    `• 문서 로드 ${frameLoads}회 · 기록 ${records.length}건의 timeOrigin 종류 ${origins.size}개` +
      (baseTimeOrigin !== null && origins.size === 1 && origins.has(baseTimeOrigin) ? ' (기준과 동일)' : ''),
  )
  lines.push(`• 레이아웃 카운터 순서: ${seqs}`)
  return lines.join('\n')
}

export function ScrollVerification({
  records,
  baseTimeOrigin,
  frameLoads,
}: {
  records: NavRecord[]
  baseTimeOrigin: number | null
  frameLoads: number
}) {
  const { isMatched, missingKinds } = evaluateAll(
    records,
    baseTimeOrigin,
    NAV_KINDS.map((k) => k.kind),
  )
  const missingText =
    missingKinds.length > 0
      ? ` 아직 판별 가능한 기록이 없는 링크: ${missingKinds
          .map((k) => NAV_KINDS.find((c) => c.kind === k)?.label)
          .join(', ')}.`
      : ''

  return (
    <ExpectedActualPanel
      title="<Link scroll> 값별 scrollY 실측과 소프트 내비게이션 증명"
      // 문자열끼리 넘기면 패널이 자동 비교해 초기 상태를 "불일치"로 표시하므로 JSX로 감싼다
      expected={<span>{EXPECTED}</span>}
      actual={<span>{formatActual(records, baseTimeOrigin, frameLoads)}</span>}
      isMatched={isMatched}
      className="min-w-0"
      description={
        'Expected는 공식 문서(Link#scroll, Scrolling to an id)와 next 16.3.2 layout-router.js의 판정 규칙이고, ' +
        'Actual은 iframe 문서에서 클릭 직전과 이동 완료 2프레임 뒤에 읽은 window.scrollY·getBoundingClientRect() 값입니다. ' +
        '4종 링크 모두 "판별 가능한 조건"(Page 상단이 뷰포트 밖, 해시가 실제로 바뀜)에서 일치해야 검증 완료입니다.' +
        missingText
      }
    />
  )
}
