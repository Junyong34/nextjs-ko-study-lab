'use client'
import React, { useState, useTransition } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ReactTaintDemo, type TaintTestOutcome } from './components/ReactTaintDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { safePaymentAction, leakPaymentSecretAction } from './actions'

export default function DemoPage() {
  const [lastOutcome, setLastOutcome] = useState<TaintTestOutcome | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSafeCall = () => {
    startTransition(async () => {
      const res = await safePaymentAction()
      setLastOutcome({
        kind: 'safe',
        message: `merchantId=${res.merchantId}, maskedKey=${res.maskedKey}`,
        timestamp: res.timestamp,
      })
    })
  }

  const handleLeakAttempt = () => {
    startTransition(async () => {
      try {
        const res = await leakPaymentSecretAction()
        // 여기 도달하면 taint가 유출을 막지 못한 것이다.
        setLastOutcome({
          kind: 'leak-not-blocked',
          message: `반환된 merchantId 필드에 원본 시크릿이 그대로 담겨 있음: ${res.merchantId}`,
          timestamp: res.timestamp,
        })
      } catch (error) {
        setLastOutcome({
          kind: 'leak-blocked',
          message: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toLocaleTimeString(),
        })
      }
    })
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"React Taint API(taintUniqueValue) 민감 데이터 전송 차단"}
        concept={"experimental_taintUniqueValue()를 사용하여 128비트 신용카드 번호나 패스워드 해시를 Taint로 지정하고, 실수로 클라이언트 컴포넌트 props로 전달될 경우 런타임 예외를 발생시켜 차단합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "결제 보안 로직이 연동된 상품 카탈로그 항목을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 버튼으로 주문 수량 증정",
            description: "보안 민감 데이터(결제 토큰)와 결합될 주문 수량을 변경합니다.",
            actionBadge: "수량 변경",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 Taint 검증 트랜잭션 수행",
            description: "서버 액션을 실행하여 Taint로 마킹된 데이터가 클라이언트로 유출되지 않음을 확인합니다.",
            actionBadge: "트랜잭션 실행",
          },
          {
            step: 4,
            title: "민감 데이터 클라이언트 전달 차단 및 안전한 처리 관찰",
            description: "클라이언트로 전달되는 응답 객체에 민감 정보가 배제되고 성공 로그만 기록되는지 검증합니다.",
            actionBadge: "Taint 검증",
            observe: "taintUniqueValue 규칙에 의한 민감 데이터 클라이언트 유출 차단 및 동기화 완료 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"React experimental_taintObjectReference 비밀키 보호 실습"}>
        <ReactTaintDemo lastOutcome={lastOutcome} isPending={isPending} onSafeCall={handleSafeCall} onLeakAttempt={handleLeakAttempt} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={lastOutcome ? lastOutcome.kind !== 'leak-not-blocked' : undefined}
        actual={lastOutcome ? `[${lastOutcome.kind}] ${lastOutcome.message}` : undefined}
        expected="안전한 호출은 마스킹된 값만 반환하고, 위험한 시도는 experimental_taintUniqueValue에 의해 실제 런타임 에러로 차단된다."
      />
    </DemoContainer>
  )
}
