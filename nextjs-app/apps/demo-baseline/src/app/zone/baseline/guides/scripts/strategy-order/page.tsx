'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ScriptStrategyDemo } from './components/ScriptStrategyDemo'
import { VerificationFooter } from './components/VerificationFooter'

interface ScriptLoad {
  strategy: string
  at: number
}

export default function DemoPage() {
  const [loads, setLoads] = useState<ScriptLoad[]>([])

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"next/script 로딩 전략(beforeInteractive/afterInteractive/lazyOnload)"}
        concept={"next/script의 3대 로딩 전략을 상황에 맞게 배치하여, 보안/결제는 beforeInteractive, 분석(GA)은 afterInteractive(기본값), 챗봇은 lazyOnload로 실행하여 LCP 성능을 극대화합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "[beforeInteractive]: 보안/결제 모듈 최우선 로드 확인 및 [afterInteractive]: 기본 분석 도구(GA) 실행 점검",
                    "description": "페이지 하이드레이션 전에 실행되어야 하는 필수 스크립트 실행 순서를 확인합니다. 페이지 인터랙션 준비 완료 직후 백그라운드에서 로드되는 표준 전략을 점검합니다.",
                    "actionBadge": "우선순위 점검"
          },
          {
                    "step": 2,
                    "title": "[lazyOnload]: 채팅봇 등 부가 기능 지연 로딩 관찰",
                    "description": "브라우저 유휴 시간(Idle)까지 로딩을 미뤄 초기 로딩 성능(LCP)을 방어하는 동작을 검증합니다.",
                    "actionBadge": "전략 대조 검증",
                    "observe": "3가지 next/script strategy 속성에 따른 스크립트 다운로드 및 실행 타임라인 분기 관찰",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"next/script strategy 로드 순서 최적화 실습"}>
        <ScriptStrategyDemo onLoadsChange={setLoads} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={loads.length > 0 ? loads.length === 3 : undefined}
        actual={loads.length > 0 ? `- 로드 완료된 전략(window.__scriptLoads): ${loads.map((l) => l.strategy).join(', ')} (${loads.length}/3)` : undefined}
        expected="beforeInteractive, afterInteractive, lazyOnload 3개 실제 Route Handler 스크립트가 모두 로드되어 window.__scriptLoads에 기록되어야 한다."
      />
    </DemoContainer>
  )
}
