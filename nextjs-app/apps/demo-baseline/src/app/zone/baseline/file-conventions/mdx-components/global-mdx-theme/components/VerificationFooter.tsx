'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { PaneSnapshot, ThemeKey } from '../types'
import { EXPECTED_SEQUENCE, THEME_NAME } from '../expectations'
import { tagsOf } from '../lib/inspect'
import { ThemeDeepDive } from './ThemeDeepDive'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>두 영역의 태그 순서가 원본과 같다 ({EXPECTED_SEQUENCE.join(' → ')}) — 전역 매핑은 class만 더하고 태그를 바꾸지 않는다.</li>
    <li>매핑을 되돌린 영역에는 mdx-g class가 0개, 전역 매핑 영역에는 6개 모두 붙는다.</li>
    <li>h1 글자 크기는 테마와 무관하게 두 영역이 다르다 (전역 기본 타이포).</li>
    <li>전역 매핑 영역의 a 색은 data-mdx-theme=&quot;{THEME_NAME}&quot;를 켰을 때와 껐을 때 다르고, 되돌린 영역의 a 색은 같다.</li>
  </ul>
)

const mark = (ok: boolean) => (ok ? '✅' : '❌')
const find = (items: PaneSnapshot['raw'], tag: string) => items.find((i) => i.tag === tag)

export function VerificationFooter({ snapshots }: { snapshots: Partial<Record<ThemeKey, PaneSnapshot>> }) {
  const { on, off } = snapshots
  let isMatched: boolean | undefined
  let actual: React.ReactNode = `• 대기 중: 테마를 켠 상태와 끈 상태에서 각각 [스타일 측정]을 실행하세요. (켬 ${on ? '완료' : '전'}, 끔 ${off ? '완료' : '전'})`

  if (on && off) {
    const expectedTags = EXPECTED_SEQUENCE.join(',')
    const tagsOk = [on, off].every((s) => tagsOf(s.raw) === expectedTags && tagsOf(s.mapped) === expectedTags)
    const rawClasses = on.raw.filter((i) => i.globalClass).length
    const mappedClasses = on.mapped.filter((i) => i.globalClass).length
    const classOk = rawClasses === 0 && mappedClasses === EXPECTED_SEQUENCE.length
    const h1Raw = find(off.raw, 'h1')?.fontSize
    const h1Mapped = find(off.mapped, 'h1')?.fontSize
    const baseOk = !!h1Raw && !!h1Mapped && h1Raw !== h1Mapped && find(on.mapped, 'h1')?.fontSize === h1Mapped
    const aMappedOn = find(on.mapped, 'a')?.color
    const aMappedOff = find(off.mapped, 'a')?.color
    const scopeOk = aMappedOn !== aMappedOff && find(on.raw, 'a')?.color === find(off.raw, 'a')?.color
    isMatched = tagsOk && classOk && baseOk && scopeOk
    actual = (
      <ul className="space-y-1">
        <li>{mark(tagsOk)} 태그 순서 — 되돌림 {tagsOf(on.raw)} / 전역 {tagsOf(on.mapped)}</li>
        <li>{mark(classOk)} mdx-g class — 되돌림 {rawClasses}개 / 전역 {mappedClasses}개</li>
        <li>{mark(baseOk)} h1 font-size (테마 끔) — 되돌림 {h1Raw ?? '-'} / 전역 {h1Mapped ?? '-'}</li>
        <li>{mark(scopeOk)} 전역 영역 a 색 — 테마 켬 {aMappedOn ?? '-'} / 끔 {aMappedOff ?? '-'}</li>
      </ul>
    )
  }

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="전역 MDX 매핑 적용 전/후 실측 비교"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="두 영역의 실제 DOM 태그·class와 getComputedStyle 값으로만 판정합니다."
      />
      <ThemeDeepDive />
    </div>
  )
}
