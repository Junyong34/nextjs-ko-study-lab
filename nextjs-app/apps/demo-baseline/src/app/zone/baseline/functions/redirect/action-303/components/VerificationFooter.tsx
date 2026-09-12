import { ExpectedActualPanel } from '@study/demo-kit'
import type { ReceiptResult } from '../types'

export function VerificationFooter({ result, error }: { result?: ReceiptResult; error?: string | null }) {
  const receipt = result?.receipt
  return (
    <ExpectedActualPanel
      title="저장된 확인서와 완료 경로의 일치"
      expected={<p>완료 URL의 식별자가 서버에서 읽은 유효한 확인서와 같고, 허용 상품·수량·발급 후 10분 이내 조건을 충족합니다.</p>}
      actual={
        <div aria-live="polite" className="space-y-2">
          {receipt ? (
            <>
              <p>완료 URL과 확인서의 식별자가 일치합니다.</p>
              <p>상품: {receipt.productId} / 수량: {receipt.quantity}개</p>
              <p>발급 시각: {new Date(receipt.issuedAt).toISOString()}</p>
              <p>이 결과는 저장된 확인서의 현재 조회 결과입니다.</p>
            </>
          ) : <p>{result?.error ?? error ?? '제출 대기 중입니다. 아직 완료 경로의 확인서를 조회하지 않았습니다.'}</p>}
        </div>
      }
      isMatched={result ? Boolean(receipt) : error ? false : undefined}
      description="확인서 일치는 HTTP 303이나 새로운 제출을 증명하지 않습니다. 요청 상태와 이동 방식은 Network에서 별도로 확인하세요."
    />
  )
}
