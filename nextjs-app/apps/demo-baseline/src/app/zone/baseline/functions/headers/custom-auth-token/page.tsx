import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/headers/custom-auth-token')

import React from 'react'
import { headers } from 'next/headers'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { HeadersCustomAuthDemo } from './components/HeadersCustomAuthDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { fetchOrdersWithAuthorization } from './orders'
import type { DebugHeader } from './types'

export default async function DemoPage() {
  const headersList = await headers()
  const authorizationHeader = headersList.get('authorization')
  const result = await fetchOrdersWithAuthorization(authorizationHeader)

  const debugHeaders: DebugHeader[] = ['host', 'user-agent']
    .map((key) => ({ key, value: headersList.get(key) ?? '' }))
    .filter((h) => h.value)

  const isMatched = authorizationHeader === result.authorizationReceived

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="headers().get('authorization') 커스텀 인증 토큰 검증"
        concept="브라우저는 페이지를 이동할 때 Authorization 헤더를 직접 실어 보내지 않으므로, 로그인 시 발급된 세션 쿠키를 게이트웨이(proxy.ts)가 Authorization 헤더로 변환합니다. 서버 컴포넌트는 headers().get('authorization')으로 이 값을 읽어 주문 조회 함수에 그대로 전달합니다."
        steps={[
          {
            step: 1,
            title: '[로그인] 클릭으로 세션 쿠키 발급',
            description: 'Server Action이 실제 쿠키를 발급하면, 다음 요청부터 게이트웨이가 이 쿠키를 Authorization 헤더로 변환해 전달합니다.',
            actionBadge: '세션 발급',
          },
          {
            step: 2,
            title: '[토큰 변조] 클릭으로 위조 토큰 주입',
            description: 'Authorization 헤더 자체는 정상적으로 전달되지만, 값이 유효 토큰과 다르면 주문 조회 함수가 401을 반환하는지 확인합니다.',
            actionBadge: '위조 토큰 테스트',
          },
          {
            step: 3,
            title: '[로그아웃] 클릭 후 검증 패널 대조',
            description: '쿠키가 사라지면 Authorization 헤더도 사라집니다. headers()가 읽은 값과 주문 조회 함수에 전달된 값이 매 상태마다 동일하게 바뀌는지 관찰합니다.',
            actionBadge: '헤더 제거 확인',
            observe: "headers().get('authorization') 값 · 주문 조회 함수 전달값 · HTTP 상태(200/401)가 함께 바뀜",
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="주문 내역 조회 — Authorization 헤더 포워딩 실습">
        <HeadersCustomAuthDemo result={result} debugHeaders={debugHeaders} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={isMatched}
        expected="headers().get('authorization')로 읽은 값과 주문 조회 함수(fetchOrdersWithAuthorization)에 전달된 값이 정확히 같아야 하며, 유효한 Bearer 토큰일 때만 200 OK와 주문 목록이 반환되어야 한다."
        actual={`- Authorization 헤더: ${authorizationHeader ?? '(없음)'}\n- 주문 조회 함수 전달값: ${result.authorizationReceived ?? '(없음)'}\n- HTTP 상태: ${result.status}\n- 조회된 주문: ${result.orders?.length ?? 0}건`}
      />
    </DemoContainer>
  )
}
