'use client'
import React, { useState, useTransition } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { ServerOnlyGuardDemo } from './components/ServerOnlyGuardDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { syncOrderAction, type OrderSyncResult } from './actions'
import { scanClientBundleForToken, type BundleScanResult } from './lib/scanBundle'

export default function DemoPage() {
  const [selectedProduct, setSelectedProduct] = useState('PROD-001')
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [result, setResult] = useState<OrderSyncResult | null>(null)
  const [scanResult, setScanResult] = useState<BundleScanResult | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isScanning, startScan] = useTransition()

  const handleSync = () => {
    startTransition(async () => {
      const next = await syncOrderAction(selectedProduct, orderQuantity)
      setResult(next)
      setScanResult(null)
    })
  }

  const handleScan = () => {
    if (!result) return
    const token = result.secretPreview.replace(/\*+$/, '')
    startScan(async () => {
      const scan = await scanClientBundleForToken(token)
      setScanResult(scan)
    })
  }

  const handleReset = () => {
    setResult(null)
    setScanResult(null)
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
            title: "[클라이언트 번들 스캔] 클릭",
            description: "브라우저가 실제로 내려받은 모든 JS 청크를 다시 fetch()해 시크릿 접두사 문자열이 하나라도 포함돼 있는지 직접 검사합니다.",
            actionBadge: "번들 스캔",
            observe: "스캔한 청크 수와 시크릿 발견 여부(0건이어야 함)를 검증 패널에서 확인",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"server-only 패키지를 통한 클라이언트 번들 유출 차단 실습"}>
        <ServerOnlyGuardDemo
          selectedProduct={selectedProduct}
          orderQuantity={orderQuantity}
          result={result}
          isPending={isPending}
          scanResult={scanResult}
          isScanning={isScanning}
          onSelectProduct={setSelectedProduct}
          onChangeQuantity={(delta) => setOrderQuantity((q) => Math.max(1, q + delta))}
          onSync={handleSync}
          onScan={handleScan}
        />
        <div className="flex justify-end pt-3">
          <DemoResetButton onReset={handleReset} label="예제 초기화" />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={scanResult ? scanResult.foundIn.length === 0 : undefined}
        actual={
          scanResult
            ? `- 스캔한 JS 청크 수: ${scanResult.scannedCount}\n- 시크릿 접두사가 발견된 청크: ${scanResult.foundIn.length}개\n- digest: ${result?.digest}\n- secretPreview: ${result?.secretPreview}`
            : undefined
        }
        expected="server-only로 보호된 모듈은 클라이언트 번들에 전혀 포함되지 않으므로, 브라우저가 받은 어떤 JS 청크에서도 시크릿 접두사가 발견되지 않아야 한다(0건)."
      />
    </DemoContainer>
  )
}
