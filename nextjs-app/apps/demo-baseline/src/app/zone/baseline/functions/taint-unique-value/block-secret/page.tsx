'use client'
import React, { useState, useTransition } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TaintUniqueValueDemo } from './components/TaintUniqueValueDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { attemptTaintedSecretAction, attemptUntaintedSecretAction } from './actions'
import type { TaintDemoState } from './types'

function nowKST(): string {
  return new Date().toLocaleTimeString('ko-KR')
}

export default function DemoPage() {
  const [state, setState] = useState<TaintDemoState>({ tainted: null, untainted: null })
  const [isPending, startTransition] = useTransition()

  const runTaintedAttempt = () => {
    startTransition(async () => {
      try {
        const result = await attemptTaintedSecretAction()
        // 여기 도달하면 taint가 유출을 막지 못했다는 뜻이다 (기대와 다른 상태).
        setState((prev) => ({ ...prev, tainted: result }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          tainted: {
            case: 'tainted',
            blocked: true,
            message: error instanceof Error ? error.message : String(error),
            timestamp: nowKST(),
          },
        }))
      }
    })
  }

  const runUntaintedAttempt = () => {
    startTransition(async () => {
      const result = await attemptUntaintedSecretAction()
      setState((prev) => ({ ...prev, untainted: result }))
    })
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="experimental_taintUniqueValue 원시 시크릿 유출 차단"
        concept="next.config.ts의 experimental.taint: true를 켜면 experimental_taintUniqueValue로 오염 표시한 원시 값이 Client Component props나 Server Action 응답으로 클라이언트에 직렬화되려는 순간 React가 실제 런타임 에러를 던져 막습니다. taint를 걸지 않은 값은 이 보호를 전혀 받지 못하고 그대로 유출됩니다."
        steps={[
          {
            step: 1,
            title: '[taint 적용 PG 시크릿 키 전달 시도 →] 클릭',
            description: 'experimental_taintUniqueValue로 오염 표시된 원시 결제 시크릿 키(pgSecretKey)를 Server Action 응답으로 그대로 돌려주려 시도합니다.',
            actionBadge: '차단 시도',
          },
          {
            step: 2,
            title: '[taint 미적용 레거시 웹훅 시크릿 전달 시도 →] 클릭',
            description: 'taint 처리를 거치지 않은 원시 시크릿(legacyWebhookSecret)을 동일한 방식으로 반환합니다.',
            actionBadge: '대조 시도',
          },
          {
            step: 3,
            title: '실제 런타임 에러 메시지와 유출된 원문 값을 비교',
            description: '두 시도의 실제 결과를 아래 검증 패널과 브라우저 Network 탭에서 대조합니다.',
            actionBadge: '대조 검증',
            observe: 'taint 적용 값은 React 런타임 에러로 차단되고, 미적용 값은 원문 그대로 화면과 Server Action 응답에 노출됨',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="결제 게이트웨이 시크릿 관리 콘솔">
        <TaintUniqueValueDemo
          state={state}
          isPending={isPending}
          onTaintedAttempt={runTaintedAttempt}
          onUntaintedAttempt={runUntaintedAttempt}
        />
      </DemoPlaygroundCard>
      <VerificationFooter state={state} />
    </DemoContainer>
  )
}
