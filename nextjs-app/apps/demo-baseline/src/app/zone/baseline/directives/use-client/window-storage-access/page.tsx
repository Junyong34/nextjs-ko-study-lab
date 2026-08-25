import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { StorageClientDemo } from './components/StorageClientDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use client' 브라우저 localStorage 접근 및 수화"}
        concept={"서버 사이드에서는 window 객체가 없으므로, 'use client' 컴포넌트 내부의 useEffect 내에서 localStorage를 안전하게 조회하여 최근 본 상품 목록을 수화(Hydration) 불일치 없이 렌더링합니다."}
        steps={[
        {
        "step": 1,
        "title": "브라우저 window 스토리지 조회 확인",
        "description": "마운트 후 useEffect 시점에 localStorage에서 최근 조회 상품 목록을 안전하게 읽어옵니다.",
        "actionBadge": "스토리지 조회"
        },
        {
        "step": 2,
        "title": "[기록 비우기] 버튼 클릭",
        "description": "localStorage의 저장 항목을 클리어하고 React 상태를 빈 배열로 즉시 갱신합니다.",
        "actionBadge": "기록 비우기"
        },
        {
        "step": 3,
        "title": "수화 불일치(Hydration Mismatch) 방지 검증",
        "description": "서버 HTML 렌더링과 클라이언트 스토리지 데이터 간의 불일치 에러 없이 안전하게 동기화되는지 확인합니다.",
        "actionBadge": "수화 검증",
        "observe": "스토리지 비우기 인터랙션 후 목록 상태 변화와 3단 검증 패널의 수화 동기화 결과 대조",
        "observeAt": "playground"
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
