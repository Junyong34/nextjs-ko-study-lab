import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ScriptLoadingStrategiesDemo } from './components/ScriptLoadingStrategiesDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"next/script 로딩 전략 (beforeInteractive vs afterInteractive vs lazyOnload)"}
        concept={"<Script strategy=\"...\"> 옵션으로 핵심 보안 스크립트(beforeInteractive), 분석 도구(afterInteractive), 비필수 위젯(lazyOnload)의 로딩 순서를 제어하여 메인 스레드 블로킹(0ms)을 방지합니다."}
        steps={[
        {
        "step": 1,
        "title": "[afterInteractive (기본값)] 전략 선택",
        "description": "페이지 수화(Hydration) 직후 브라우저 idle 타임에 스크립트를 비동기 로드하는 기본 동작을 확인합니다.",
        "actionBadge": "afterInteractive"
        },
        {
        "step": 2,
        "title": "[lazyOnload] 지연 로딩 전략 선택",
        "description": "모든 리소스 로드가 완료된 후 브라우저 유휴 시간에 실행되는 비필수 위젯 스크립트 전략을 점검합니다.",
        "actionBadge": "lazyOnload"
        },
        {
        "step": 3,
        "title": "[beforeInteractive] 최우선 전략 확인",
        "description": "수화 전 서버 HTML 주입 시점에 실행되어야 하는 필수 보안/인증 스크립트 전략을 검증합니다.",
        "actionBadge": "beforeInteractive",
        "observe": "3단 검증 패널에서 next/script 로딩 전략별 실행 타이밍과 메인 스레드 영향도 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"next/script 로딩 전략 상세 비교 실습"}>
        <ScriptLoadingStrategiesDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
