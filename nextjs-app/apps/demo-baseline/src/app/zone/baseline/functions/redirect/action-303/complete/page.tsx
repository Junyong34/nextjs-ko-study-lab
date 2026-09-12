import { cookies } from 'next/headers'
import { DemoContainer, DemoPlaygroundCard, MOCK_PRODUCTS, ProductCard } from '@study/demo-kit'
import { RECEIPT_COOKIE } from '../constants'
import { readReceipt } from '../receipt'
import { RedirectDeepDive } from '../components/RedirectDeepDive'
import { RedirectGuide } from '../components/RedirectGuide'
import { ResetReceipt } from '../components/ResetReceipt'
import { VerificationFooter } from '../components/VerificationFooter'

export default async function CompletePage({ searchParams }: {
  searchParams: Promise<{ receiptId?: string | string[] }>
}) {
  const { receiptId } = await searchParams
  const cookieStore = await cookies()
  const products = MOCK_PRODUCTS.slice(0, 2)
  const result = readReceipt(cookieStore.get(RECEIPT_COOKIE)?.value, receiptId, products.map(product => product.id))
  const product = products.find(item => item.id === result.receipt?.productId)
  return (
    <DemoContainer className="space-y-6">
      <RedirectGuide />
      <DemoPlaygroundCard title="완료 화면 · 저장된 확인서 조회">
        <div className="space-y-4 text-sm">
          {result.receipt && product ? (
            <>
              <ProductCard product={product} />
              <p>저장된 수량: <strong>{result.receipt.quantity}개</strong></p>
              <p>완료 URL과 확인서가 일치합니다. 새로고침하거나 이 URL을 다시 열면 기존 확인서를 재조회합니다.</p>
            </>
          ) : <p role="alert" className="text-rose-700 dark:text-rose-400">{result.error}</p>}
          <p className="text-xs text-zinc-600 dark:text-zinc-400">학습용 확인서는 10분 뒤 만료됩니다. 실제 주문·결제 또는 인증을 증명하지 않습니다.</p>
          <ResetReceipt />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter result={result} />
      <RedirectDeepDive />
    </DemoContainer>
  )
}
