import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SerializationViewerClient } from './components/SerializationViewerClient'
import { VerificationFooter } from './components/VerificationFooter'
import { executeServerTask } from './actions'
import type { SerializablePayload } from './types'

export default function SerializationDemoPage() {
  // Server Component에서 준비한 안전한 직렬화 데이터
  const serializableData: SerializablePayload = {
    primitiveString: 'Next.js App Router RSC',
    primitiveNumber: 2026,
    primitiveBoolean: true,
    plainObject: {
      sku: 'NIKE-ALPHA-001',
      stock: 48,
      inStock: true,
    },
    arrayData: ['러닝화', '프리미엄', '카본플레이트'],
    dateString: new Date().toISOString(),
    nullValue: null,
    serverActionName: 'executeServerTask',
  }

  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Props 직렬화(Serialization) 및 전달 경계 검증"
        concept="Server Component에서 Client Component로 전달되는 Props는 네트워크를 통해 브라우저로 전송되므로 반드시 JSON 직렬화가 가능해야 합니다. 일반 함수는 전달할 수 없지만 'use server'로 선언된 Server Action은 안전하게 전달할 수 있습니다."
        steps={[
          {
            step: 1,
            title: '직렬화 데이터 트리 검사',
            description: '서버에서 생성된 원시값, 객체, 배열이 클라이언트로 무손실 전달된 것을 확인합니다.',
            actionBadge: 'JSON 직렬화',
          },
          {
            step: 2,
            title: 'Server Action Prop 실행',
            description: '함수 Prop으로 전달된 executeServerTask를 클릭하여 서버 통신을 테스트합니다.',
            actionBadge: 'Server Action 호출',
          },
          {
            step: 3,
            title: '직렬화 규칙 학습',
            description: '하단 개념 정리 카드에서 직렬화 가능 데이터와 불가능 데이터의 차이를 학습합니다.',
            actionBadge: '규칙 숙지',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="RSC Props 직렬화 인스펙터" className="space-y-4">
        <SerializationViewerClient
          payload={serializableData}
          serverAction={executeServerTask}
        />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
