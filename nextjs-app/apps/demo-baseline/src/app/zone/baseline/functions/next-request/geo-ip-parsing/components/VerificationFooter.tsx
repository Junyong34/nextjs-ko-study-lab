'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  ip?: string
  country?: string
  currency?: string
  isLoaded?: boolean
}

export function VerificationFooter({
  ip,
  country,
  currency,
  isLoaded = false,
}: VerificationFooterProps) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="NextRequest IP/Geo 텔레메트리 파싱 실증 검증"
        expected="• NextRequest의 ip/geo 속성 및 표준 x-forwarded-for 헤더를 파싱하여 국가/IP 확인\n• 국가 코드(KR/US/JP/EU)에 맞춰 통화 및 현지 가격 자동 현지화 완료"
        actual={
          isLoaded && country
            ? `• [IP: ${ip}] 국가 코드: ${country} -> 통화: ${currency}\n• NextRequest 파싱 성공 및 실시간 쇼핑몰 현지화 결합 확인`
            : '• NextRequest 텔레메트리 조회 대기 중...'
        }
        isMatched={isLoaded && Boolean(country && ip)}
        description="Next.js App Router의 NextRequest 객체 확장 속성(ip, geo, nextUrl)을 route.ts에서 안전하게 추출하여 검증합니다."
      />
            <DemoDeepDiveCard title="NextRequest.geo 및 ip 기반 글로벌 지리적 위치 파싱">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>NextRequest</code> (<code>next/server</code>)는 Web 표준 <code>Request</code>를 확장한 Next.js 객체로, Vercel/엣지 인프라에서 주입하는 <code>request.geo</code> (국가 <code>country</code>, 도시 <code>city</code>, 위도/경도) 및 <code>request.ip</code> 속성을 제공하여 엣지 미들웨어 및 Route Handler에서 지리적 위치를 파싱합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 유입된 요청의 <code>request.geo.country</code>와 클라이언트 IP를 분석하여, 해외 접속자에게는 현지 통화(USD/EUR) 및 글로벌 배송비 정책을, 국내 접속자에게는 원화(KRW) 및 무료 배송 혜택을 실시간으로 반환합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버리스 엣지 초고속 위치 판별</strong>: 외부 유료 Geo-IP API 호출 없이 인프라가 제공하는 헤더를 0ms 지연으로 읽어 처리합니다.</li>
              <li><strong>지역 맞춤형 UX</strong>: 접속 국가에 맞춘 언어, 통화, 결제 수단(해외 카드/페이팔 vs 국내 간편결제)을 자동 분기합니다.</li>
              <li><strong>글로벌 규제 준수</strong>: 국가별 GDPR 쿠키 동의 배너 노출 여부를 엣지 단계에서 즉각 결정합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>글로벌 이커머스 접속 국가별 통화 및 관부가세 자동 계산</li>
              <li>특정 국가/지역 대상 접속 차단(Geo-blocking) 및 라이선스 지역 제한</li>
              <li>사용자 인근 오프라인 매장 재고 및 당일 배송 가능 지역 안내</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>로컬 개발 환경 헤더 폴백</strong>: 로컬 개발(localhost) 환경에서는 <code>request.geo</code>가 <code>undefined</code>이므로 <code>request.headers.get('x-forwarded-for')</code> 또는 테스트용 mock 데이터를 폴백으로 지정해야 합니다.</li>
              <li><strong>쿠키 우선 원칙</strong>: 사용자가 사이트에서 수동으로 국가/통화를 변경한 경우 <code>geo</code> 자동 감지보다 사용자 쿠키 선택을 우선해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
