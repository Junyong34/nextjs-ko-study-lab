import React from 'react'
import { DemoContainer, ExpectedActualPanel } from '@study/demo-kit'

export default async function OrderCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string }>
}) {
  const { amount } = await searchParams

  return (
    <DemoContainer className="space-y-6">
      <div className="rounded-lg border border-emerald-300 bg-emerald-50/60 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
        <div className="text-lg font-bold text-emerald-800 dark:text-emerald-300">주문이 완료되었습니다</div>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
          결제 금액: {amount ? Number(amount).toLocaleString() : '-'}원
        </p>
      </div>
      <ExpectedActualPanel
        title="Server Action redirect() 실증 검증"
        expected="Server Action이 redirect('/order-complete/complete?amount=...')를 호출하면 브라우저가 실제로 이 URL로 이동한다."
        actual={`- 현재 URL 쿼리: amount=${amount}\n- 이 페이지가 렌더링됐다는 사실 자체가 redirect()가 실제로 발생했다는 증거`}
        isMatched={Boolean(amount)}
      />
    </DemoContainer>
  )
}
