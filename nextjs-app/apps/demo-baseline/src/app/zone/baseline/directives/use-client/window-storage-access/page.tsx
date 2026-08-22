import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { StorageClientDemo } from './components/StorageClientDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use client' 내부 브라우저 window.localStorage 접근"}
        concept={"React 19 및 Next.js 16의 지시어 ''use client' 내부 브라우저 window.localStorage 접근'을 사용하여 쇼핑몰 컴포넌트와 비동기 함수의 실행 경계 및 캐시 영역을 명시적으로 선언합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "지시어 선언 위치 확인",
                    "description": "파일 최상단 또는 함수 최상단에 선언된 지시어의 스코프를 점검합니다.",
                    "actionBadge": "지시어 점검"
          },
          {
                    "step": 2,
                    "title": "경계 전환 인터랙션",
                    "description": "서버 컴포넌트와 클라이언트 컴포넌트 간의 상호 호출을 실행합니다.",
                    "actionBadge": "경계 호출"
          },
          {
                    "step": 3,
                    "title": "번들 및 캐시 분리 검증",
                    "description": "클라이언트 번들 제외 여부 및 캐시 수명 분리를 검증합니다.",
                    "actionBadge": "분리 검증"
          }
]}
      />
      <DemoPlaygroundCard title={"'use client' 내부 브라우저 window.localStorage 접근 실습"}>
        <StorageClientDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
