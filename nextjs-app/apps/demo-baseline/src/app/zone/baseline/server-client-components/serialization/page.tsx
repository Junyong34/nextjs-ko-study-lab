import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { SerializationViewerClient } from './components/SerializationViewerClient'
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
        title="RSC → RCC Props 직렬화(Serialization) 규약 & Server Action 전달"
        concept="Server Component에서 Client Component로 전달하는 Props는 JSON 직렬화가 가능해야 하며, 일반 함수는 직접 전달할 수 없지만 'use server' Server Action은 직렬화 가능한 참조로 전달할 수 있습니다."
        steps={[
          {
            step: 1,
            title: 'RSC 전달 Props 데이터 구조 확인',
            description: '원시값(String, Number, Boolean), 평탄한 객체, 배열 데이터가 RCC로 안전하게 직렬화 전달된 구조를 확인합니다.',
            actionBadge: '직렬화 확인',
          },
          {
            step: 2,
            title: '[전달받은 Server Action Props 실행] 버튼 클릭',
            description: "'use server'로 선언된 Server Action 함수가 Action ID 참조 형태로 Props 전달되어 정상 실행되는 것을 관찰합니다.",
            actionBadge: 'Server Action 실행',
            observe: "서버 통신 완료 후 응답 결과 문자열('[확인] 서버 액션 처리 완료...')이 화면에 즉시 렌더링됨",
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단, 3단, 4단: 실습 조작 영역 및 검증/개념정리 */}
      <SerializationViewerClient
        payload={serializableData}
        serverAction={executeServerTask}
      />
    </DemoContainer>
  )
}
