import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { BffResponseShapingDemo } from './components/BffResponseShapingDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"BFF 응답 셰이핑(Response Shaping)을 통한 92% 페이로드 감축"}
        concept={"백엔드 원본 데이터(50개 필드, 120 KB)에서 프론트엔드 화면 표시에 불필요한 내부 감사 로그와 원시 필드를 필터링하여 6개 핵심 필드(10 KB)로 92% 다이어트하여 전송합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "원본 백엔드 응답(50개 필드, 120 KB) 페이로드 분석 및 BFF 응답 셰이핑 적용 후(6개 필드, 10 KB) 대조",
                    "description": "내부 감사 로그(internal_audit) 등 비대한 미가공 데이터 구조를 확인합니다. 프론트엔드 컴포넌트 렌더링에 꼭 필요한 필수 필드만 선별된 슬림 페이로드를 확인합니다.",
                    "actionBadge": "원본 페이로드 점검"
          },
          {
                    "step": 2,
                    "title": "92% 네트워크 전송량 절감 및 JSON 파싱 속도 개선 관찰",
                    "description": "모바일 환경에서의 네트워크 대기 시간 단축과 메모리 사용량 최적화 효과를 검증합니다.",
                    "actionBadge": "효과 검증",
                    "observe": "BFF Response Shaping 적용에 따른 페이로드 감축(120 KB -> 10 KB, 92% 절감) 결과 관찰",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"모바일 앱 최적화 응답 가공 (Response Shaping) 실습"}>
        <BffResponseShapingDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
