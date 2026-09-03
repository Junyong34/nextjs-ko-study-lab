import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'server-client-components/serialization')

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
    <DemoContainer className="space-y-8">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="RSC → RCC Props 직렬화(Serialization) 규약 & Server Action RPC 파이프라인"
        concept="Server Component에서 Client Component로 전달하는 Props는 JSON 직렬화가 가능해야 합니다. 일반 함수나 Class는 전달할 수 없지만, 'use server' Server Action은 고유 Action ID 참조로 직렬화되어 안전하게 전달되고 원격 실행됩니다."
        steps={[
          {
            step: 1,
            title: 'RSC 전달 Props 실시간 런타임 JSON 검증 확인',
            description: '서버에서 전달된 원시값, 객체, 배열 데이터가 런타임 JSON 직렬화 검사(Valid JSON)를 통과하여 안전하게 수신된 것을 확인합니다.',
            actionBadge: '런타임 검증',
          },
          {
            step: 2,
            title: '[타입별 직렬화 시뮬레이터] 탭 클릭 비교',
            description: '원시값/객체(PASS)와 일반 함수/Class 인스턴스/순환참조(FAIL) 버튼을 번갈아 클릭하여 직렬화 실패 에러 원인을 비교합니다.',
            actionBadge: '타입 비교',
          },
          {
            step: 3,
            title: 'Server Action Props 실행 & 4단계 통신 파이프라인 관찰',
            description: "하단 입력창에 텍스트를 입력하고 [전달받은 Server Action Props 실행]을 클릭하여 Action ID를 통한 네트워크 RPC 전송 및 서버 응답 파이프라인을 관찰합니다.",
            actionBadge: 'RPC 실행',
            observe: "서버 통신 완료 후 4단계 파이프라인(클라이언트 호출 ➔ 네트워크 전송 ➔ 서버 Node.js 실행 ➔ 반환값 수신)이 화면에 시각화됨",
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
