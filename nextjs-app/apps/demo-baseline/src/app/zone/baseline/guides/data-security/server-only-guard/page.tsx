'use client'
import React, { useState, useTransition } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ServerOnlyGuardDemo } from './components/ServerOnlyGuardDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { syncOrderAction, type OrderSyncResult } from './actions'

export default function DemoPage() {
  const [selectedProduct, setSelectedProduct] = useState('PROD-001')
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [result, setResult] = useState<OrderSyncResult | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSync = () => {
    startTransition(async () => {
      const next = await syncOrderAction(selectedProduct, orderQuantity)
      setResult(next)
    })
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"import 'server-only'를 통한 서버 모듈 클라이언트 번들 누출 방지"}
        concept={"데이터베이스 접근 및 시크릿 키를 다루는 모듈 상단에 import 'server-only'를 선언하여, 클라이언트 컴포넌트에서 실수로 import 시 빌드 타임 에러를 발생시켜 0 KB 번들 보안을 원천 방어합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택",
            description: "보안 가드가 적용된 서버 전용 상품 모듈의 데이터 대상을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 또는 [-] 버튼으로 동기화 수량 조정",
            description: "서버 모듈로 전달할 수량 파라미터를 설정합니다.",
            actionBadge: "수량 설정",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 안전한 서버 API 호출",
            description: "server-only로 보호된 서버 액션 함수를 실행하여 데이터를 동기화합니다.",
            actionBadge: "서버 API 실행",
          },
          {
            step: 4,
            title: "서버 전용 모듈 보안 경계 및 동기화 성공 로그 관찰",
            description: "클라이언트 번들에 비밀 키가 포함되지 않고 서버 측에서만 로직이 수행되는지 검증합니다.",
            actionBadge: "보안 검증",
            observe: "import 'server-only' 경계 내 안전한 서버 API 트리거 및 장바구니 동기화 성공 로그 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"server-only 패키지를 통한 클라이언트 번들 유출 차단 실습"}>
        <ServerOnlyGuardDemo
          selectedProduct={selectedProduct}
          orderQuantity={orderQuantity}
          result={result}
          isPending={isPending}
          onSelectProduct={setSelectedProduct}
          onChangeQuantity={(delta) => setOrderQuantity((q) => Math.max(1, q + delta))}
          onSync={handleSync}
        />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={result ? !result.responseContainsRawSecret : undefined}
        logs={result ? [`digest=${result.digest}`, `secretPreview=${result.secretPreview}`] : undefined}
        actual={
          result
            ? `- digest: ${result.digest}\n- secretPreview: ${result.secretPreview}\n- 응답에 원본 시크릿 포함 여부: ${result.responseContainsRawSecret}`
            : undefined
        }
        expected="server-only로 보호된 모듈에서 시크릿을 계산하지만, Server Action의 클라이언트 응답 JSON에는 원본 시크릿 문자열이 포함되지 않는다."
      />
    </DemoContainer>
  )
}
