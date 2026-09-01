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
        title="Webhook 서명 검증 핸들러 (route.ts) 검증 결과"
        expected="• 정상 서명 전송 시 HTTP 200 OK 및 verified: true 응답\n• 변조 서명 전송 시 HTTP 401 Unauthorized 및 verified: false 응답"
        actual={
          httpStatus
            ? `• [HTTP ${httpStatus}] ${verified ? '서명 검증 통과 (verified: true)' : '서명 위조 감지 및 차단 (verified: false)'} (${eventName || 'event'})\n• crypto.timingSafeEqual 안전 검증 완료`
            : '• 웹훅 시뮬레이션 버튼 클릭 대기 중...'
        }
        isMatched={isMatched}
        description="Next.js App Router route.ts에서 node:crypto 모듈을 활용하여 Webhook HMAC-SHA256 암호화 서명을 검증합니다."
      />
      <DemoDeepDiveCard title="Webhook HMAC-SHA256 서명 검증 핸들러 (route.ts)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              PG사나 외부 SaaS 플랫폼의 웹훅 요청은 데이터 위변조를 방지하기 위해 HTTP 헤더에 HMAC-SHA256 디지털 서명을 포함합니다. App Router <code>route.ts</code>는 <code>node:crypto</code> 또는 Web Crypto API를 활용하여 원본 요청 본문(<code>request.text()</code>)과 서명을 암호학적으로 대조합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 결제 완료 웹훅 수신 시, <code>crypto.createHmac('sha256', secret)</code>을 통해 원본 페이로드로부터 계산된 다이제스트와 헤더 서명을 <code>crypto.timingSafeEqual</code>로 검증하여 유효한 경우 200 OK, 위조된 경우 401 Unauthorized를 즉시 반환합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>결제 및 금융 데이터 무결성 보장</strong>: 악의적인 제3자의 가짜 결제 승인 호출이나 금액 위변조 공격을 원천 차단합니다.</li>
              <li><strong>타이밍 공격(Timing Attack) 완벽 방어</strong>: 고정 시간 비교 함수(<code>timingSafeEqual</code>)를 사용하여 문자열 비교 시간차를 이용한 서명 유추 공격을 무력화합니다.</li>
              <li><strong>원시 스트림 텍스트 파싱</strong>: JSON 파싱 전의 원본 바이트 문자열(<code>request.text()</code>)을 확보하여 서명 불일치 오류를 방지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>토스페이먼츠/스트라이프 결제 완료 및 환불 비동기 웹훅 수신</li>
              <li>GitHub/Slack 연동 봇 이벤트 수신 엔드포인트</li>
              <li>물류 택배사 배송 상태 변경 실시간 웹훅 동기화</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>request.json() 대신 request.text() 사용</strong>: <code>request.json()</code>으로 파싱한 객체를 다시 <code>JSON.stringify()</code>하면 공백이나 키 순서가 달라져 HMAC 서명이 불일치하게 되므로, 반드시 <code>await request.text()</code>로 원본 텍스트를 읽어야 합니다.</li>
              <li><strong>Request 본문 다중 소비 불가</strong>: <code>request.text()</code>를 호출하면 스트림이 소비되므로, 이후 JSON 파싱이 필요하면 텍스트를 <code>JSON.parse()</code>하여 재사용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
