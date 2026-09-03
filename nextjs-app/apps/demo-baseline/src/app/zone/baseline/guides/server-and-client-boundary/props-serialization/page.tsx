import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/server-and-client-boundary/props-serialization')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { PropsSerializationSection } from './components/PropsSerializationSection'

export default function DemoPage() {
  // 서버 컴포넌트에서 실제로 계산된 값 — Date 인스턴스가 포함된 순수 객체.
  // 이 값이 RSC 경계를 넘어 클라이언트 컴포넌트로 전달된다.
  const serverData = {
    id: 'prod-101',
    name: '스마트워치',
    price: 350000,
    tags: ['신상품', '인기'],
    createdAt: new Date('2026-01-15T00:00:00Z'),
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"RSC에서 RCC로의 Props 직렬화(Serialization) 경계"}
        concept={"Server Component에서 Client Component로 전달되는 props는 문자열, 숫자, Date, 순수 객체처럼 React Flight 프로토콜이 지원하는 값이어야 하며, 함수나 클래스 인스턴스는 경계를 통과할 수 없습니다."}
        steps={[
          {
            step: 1,
            title: "서버 컴포넌트가 생성한 Date 인스턴스가 포함된 props 확인",
            description: "서버에서 계산된 데이터(문자열, 숫자, 배열, Date)가 클라이언트 컴포넌트로 전달됩니다.",
            actionBadge: "직렬화 데이터 점검",
          },
          {
            step: 2,
            title: "클라이언트에서 data.createdAt instanceof Date 실측",
            description: "React Flight 프로토콜이 Date 인스턴스를 경계 너머에서도 진짜 Date로 복원하는지 직접 확인합니다.",
            actionBadge: "경계 전달 검증",
            observe: "instanceof Date 결과와 getFullYear() 값이 실제로 정확한지 관찰",
            observeAt: "verification",
          },
        ]}
      />
      <PropsSerializationSection data={serverData} />
    </DemoContainer>
  )
}
