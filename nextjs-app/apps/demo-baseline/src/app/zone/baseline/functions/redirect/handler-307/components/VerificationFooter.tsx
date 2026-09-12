'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import type { RequestResult, SubmittedOrder } from '../types'

interface VerificationFooterProps {
  submitted: SubmittedOrder | null
  result: RequestResult | null
  pending: boolean
}

export function VerificationFooter({ submitted, result, pending }: VerificationFooterProps) {
  const observation = result?.observation
  const receipt = observation?.receipt
  const finalPath = observation ? new URL(observation.url).pathname : null

  return (
    <div aria-live="polite">
      <ExpectedActualPanel
        title="새 접수 주소의 POST·본문 보존"
        isMatched={result?.isMatched}
        expected={
          <div className="space-y-1">
            <p>리다이렉트 후 수신: POST / JSON 본문</p>
            <p>최종 응답: 성공 / 새 접수 주소 receipt</p>
            {submitted ? (
              <>
                <p>이번 제출: {submitted.method}</p>
                <p>상품: {submitted.productId} / 수량: {submitted.quantity}</p>
                <p>이번 요청의 식별자와 수신 식별자 일치</p>
              </>
            ) : <p>상품·수량을 제출하면 비교할 값이 정해집니다.</p>}
          </div>
        }
        actual={
          <div className="space-y-1">
            {observation ? (
              <>
                <p>fetch 최종 응답: HTTP {observation.status}</p>
                <p>리다이렉트 경유: {observation.redirected ? '예' : '아니오'}</p>
                <p className="break-all">최종 경로: {finalPath}</p>
                {receipt ? (
                  <>
                    <p>수신: {receipt.method} / {receipt.source === 'body' ? 'JSON 본문' : 'query'}</p>
                    <p>상품: {receipt.productId} / 수량: {receipt.quantity}</p>
                    <p>요청 식별자: {receipt.requestId === submitted?.requestId ? '이번 제출과 일치' : '불일치'}</p>
                  </>
                ) : <p>유효한 접수 결과 없음</p>}
              </>
            ) : <p>{pending ? '새 접수 주소의 응답을 기다리는 중입니다.' : result ? result.reason : '아직 접수 요청을 보내지 않았습니다.'}</p>}
          </div>
        }
        description={result?.reason ?? '실제 응답과 제출 당시 값을 자동으로 대조합니다. 중간 307 상태 코드는 Network의 submit 응답에서 별도로 확인하세요.'}
      />
    </div>
  )
}
