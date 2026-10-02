'use client'
import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { SlotMeasurement } from '../types'
import { EXPECTED_CALLOUT, EXPECTED_H2 } from '../expectations'
import { SlotDeepDive } from './SlotDeepDive'

const EXPECTED = (
  <ul className="list-disc space-y-1 pl-4">
    <li>MDX 본문의 {'{typeof window}'} 표현식은 서버에서 실행되어 &quot;server&quot;로 남고, 그 안의 버튼은 하이드레이션된다.</li>
    <li>버튼으로 담은 수량(api/cart)과 MDX가 props.cartCount로 다시 렌더한 수량이 같다 (1개 이상).</li>
    <li>h2 {EXPECTED_H2}개는 모두 지역 매핑으로 렌더되고 전역 class는 붙지 않는다. 지역에 없는 p에는 전역 class가 붙고, Callout {EXPECTED_CALLOUT}개가 주입된다.</li>
    <li>버튼 문자열은 JS 파일에 있고, MDX 문서 문구는 어떤 JS 파일에도 없다.</li>
  </ul>
)

const mark = (ok: boolean) => (ok ? '✅' : '❌')

export function VerificationFooter({ m }: { m: SlotMeasurement | null }) {
  let isMatched: boolean | undefined
  let actual: React.ReactNode = '• 대기 중: 문서 안 버튼으로 장바구니에 담은 뒤 [경계 측정]을 누르세요.'

  if (m && m.serverCartCount === 0) {
    actual = `• 대기 중: 장바구니가 비어 있습니다(api/cart 0개). 버튼으로 담은 뒤 다시 측정하세요. (측정 ${m.measuredAt})`
  } else if (m) {
    const serverOk = m.mdxEnv === 'server' && m.buttonHydrated
    const propsOk = m.domCartCount === m.serverCartCount
    const mappingOk = m.h2Total === EXPECTED_H2 && m.h2Local === EXPECTED_H2 && m.h2Global === 0 && m.pGlobal > 0 && m.calloutCount === EXPECTED_CALLOUT
    const bundleOk = m.scriptsScanned > 0 && m.buttonMarkerHits > 0 && m.proseMarkerHits === 0
    isMatched = serverOk && propsOk && mappingOk && bundleOk
    actual = (
      <ul className="space-y-1">
        <li>{mark(serverOk)} MDX 실행 위치 {m.mdxEnv ?? '(없음)'} · 버튼 하이드레이션 {m.buttonHydrated ? '완료' : '안 됨'}</li>
        <li>{mark(propsOk)} api/cart {m.serverCartCount}개 / MDX 렌더 {m.domCartCount ?? '-'}개{propsOk ? '' : ' (refresh 전이면 다시 측정)'}</li>
        <li>{mark(mappingOk)} h2 {m.h2Total}개(지역 {m.h2Local}, 전역 {m.h2Global}) · 전역 p {m.pGlobal}개 · Callout {m.calloutCount}개</li>
        <li>{mark(bundleOk)} JS {m.scriptsScanned}개 중 버튼 문자열 {m.buttonMarkerHits}개, 문서 문구 {m.proseMarkerHits}개</li>
      </ul>
    )
  }

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="서버 MDX · 클라이언트 버튼 경계 검증"
        expected={EXPECTED}
        actual={actual}
        isMatched={isMatched}
        description="DOM, api/cart 응답, 이 페이지가 받은 JS 파일 내용으로만 판정합니다."
      />
      <SlotDeepDive />
    </div>
  )
}
