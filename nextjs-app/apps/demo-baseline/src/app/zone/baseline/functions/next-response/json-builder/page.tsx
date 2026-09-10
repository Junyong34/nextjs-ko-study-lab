'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { NextResponseJsonDemo } from './components/NextResponseJsonDemo'
import { VerificationFooter } from './components/VerificationFooter'
import type { JsonBuilderResponseState } from './types'

export default function DemoPage() {
  const [responseState, setResponseState] = useState<JsonBuilderResponseState>({
    requestedStatus: null,
    httpStatus: null,
    builderHeader: null,
    authHeader: null,
    isSuccess: false,
  })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="NextResponse.json() 응답 빌더 및 상태 코드 주입"
        concept="NextResponse.json(data, { status, headers }) 팩토리를 사용하여 표준 Content-Type: application/json 헤더와 커스텀 HTTP 상태 코드·헤더를 주입한 JSON 응답을 생성합니다. 상태 코드는 클라이언트가 아니라 서버의 화이트리스트 검증을 통과한 값만 반영됩니다."
        steps={[
          {
            step: 1,
            title: '[200 OK (성공)] 또는 [201 Created (생성)] 클릭',
            description: '성공 상태 코드를 주입하는 NextResponse.json() 응답 생성을 요청합니다.',
            actionBadge: '성공 응답',
          },
          {
            step: 2,
            title: '[400/404/422/500] 중 하나 클릭',
            description: '에러 규격화 상태 코드가 주입된 NextResponse.json() 응답을 요청합니다.',
            actionBadge: '에러 응답',
          },
          {
            step: 3,
            title: '[999 요청 (허용되지 않는 값)] 클릭',
            description: '화이트리스트에 없는 상태 코드를 요청해도 서버가 그대로 반영하지 않음을 확인합니다.',
            actionBadge: '서버 검증',
            observe: '요청한 999가 아니라 실제로는 기본값 HTTP 200이 반환되어, 상태 코드는 서버 코드가 최종 결정함을 확인',
            observeAt: 'verification',
          },
          {
            step: 4,
            title: 'HTTP 헤더 및 직렬화된 JSON 페이로드 관찰',
            description: '반환된 응답의 x-study-response-builder / x-custom-header-auth 헤더, 상태 코드 및 JSON 본문이 일치하는지 확인합니다.',
            actionBadge: '결과 검증',
            observe: 'Network 탭에서 요청마다 실제 상태 코드와 헤더가 다르게 반환되는 것을 직접 확인 가능',
            observeAt: 'network',
          },
        ]}
      />
      <DemoPlaygroundCard title="NextResponse.json() 빌더 및 헤더 실습">
        <NextResponseJsonDemo onStatusChange={setResponseState} />
      </DemoPlaygroundCard>
      <VerificationFooter
        requestedStatus={responseState.requestedStatus}
        httpStatus={responseState.httpStatus}
        builderHeader={responseState.builderHeader}
        authHeader={responseState.authHeader}
      />
    </DemoContainer>
  )
}
