'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  httpStatus?: number | null
  verified?: boolean
  eventName?: string
}

export function VerificationFooter({
  httpStatus,
  verified,
  eventName,
}: VerificationFooterProps) {
  const isMatched = Boolean(httpStatus !== null && httpStatus !== undefined)

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Webhook 서명 검증 핸들러 (route.ts) 실증 검증"
        expected="• 정상 서명 전송 시 HTTP 200 OK 및 verified: true 응답\n• 변조 서명 전송 시 HTTP 401 Unauthorized 및 verified: false 응답"
        actual={
          httpStatus
            ? `• [HTTP ${httpStatus}] ${verified ? '서명 검증 통과 (verified: true)' : '서명 위조 감지 및 차단 (verified: false)'} (${eventName || 'event'})\n• crypto.timingSafeEqual 안전 검증 완료`
            : '• 웹훅 시뮬레이션 버튼 클릭 대기 중...'
        }
        isMatched={isMatched}
        description="Next.js App Router route.ts에서 node:crypto 모듈을 활용하여 Webhook HMAC-SHA256 암호화 서명을 검증합니다."
      />
      <DemoDeepDiveCard title="Webhook 서명 검증 핸들러 (route.ts)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              PG사(토스페이먼츠, 스트라이프 등) 및 외부 서드파티 웹훅은 요청 본문이 전송 도중 위변조되지 않았음을 입증하기 위해 헤더에 HMAC 서명을 포함합니다.
              App Router의 <code>route.ts</code>는 Node.js <code>node:crypto</code> 및 Web Crypto를 지원하므로 <code>request.text()</code>로 원본 문자열을 읽어 안전하게 서명을 대조합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 타이밍 공격 방지 (timingSafeEqual)</h5>
            <p>
              단순 문자열 동등 연산자(<code>===</code>)는 첫 번째 불일치 글자에서 즉시 반환되므로 실행 시간 차이를 분석하는 타이밍 공격(Timing Attack)에 취약합니다.
              Next.js 서버 핸들러에서는 <code>crypto.timingSafeEqual(bufA, bufB)</code>를 사용하여 고정 시간 비교를 수행해야 합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>금융/결제 무결성: 악의적인 결제 승인 위조 및 금액 변조 원천 차단</li>
              <li>원본 스트림 보존: <code>request.text()</code>로 서명 생성 당시의 바이트 원본 보장</li>
              <li>표준 에러 응답: 서명 불일치 시 <code>401 Unauthorized</code> 즉각 반환</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>PG사 결제 완료/취소 비동기 노티피케이션 처리</li>
              <li>GitHub / Slack / Discord 봇 및 웹훅 수신 엔드포인트</li>
              <li>SaaS 외부 연동 데이터 동기화 파이프라인</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
