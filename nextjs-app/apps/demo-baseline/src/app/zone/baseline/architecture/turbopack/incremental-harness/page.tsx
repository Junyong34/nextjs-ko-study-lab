import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ArchTurbopackHmrDemo } from './components/ArchTurbopackHmrDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="Turbopack 증분 빌드 및 핫 모듈 리로딩 가속"
        concept="Rust 기반 Turbopack 엔진(--turbo)을 활용하여 수천 개의 쇼핑몰 컴포넌트 모듈을 함수 레벨 증분 계산(Incremental Computation)으로 10ms 이내에 초고속 HMR 갱신합니다."
        steps={[
          {
                    "step": 1,
                    "title": "Turbopack Rust 엔진 증분 컴파일 아키텍처 점검 및 next.config.ts turbopack 규칙 및 로더 설정 확인",
                    "description": "전체 번들을 다시 빌드하지 않고 변경된 함수만 증분 캐싱하는 Turbo 엔진 메커니즘을 확인합니다. Webpack 대비 10배 빠른 HMR과 커스텀 SVG/Sass 로더 바인딩 설정을 점검합니다.",
                    "actionBadge": "엔진 구조 점검"
          },
          {
                    "step": 2,
                    "title": "10ms 이내 초고속 핫 모듈 리로딩(HMR) 성능 관찰",
                    "description": "코드 수정 시 브라우저 상태를 유지한 채 변경 사항만 수 밀리초 만에 즉시 반영되는지 확인합니다.",
                    "actionBadge": "성능 검증",
                    "observe": "Turbopack 증분 계산을 통해 코드 변경 사항이 10ms 미만으로 즉각 HMR 반영됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"Turbopack 증분 빌드 및 핫 모듈 리로딩 가속 실습"}>
        <ArchTurbopackHmrDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
