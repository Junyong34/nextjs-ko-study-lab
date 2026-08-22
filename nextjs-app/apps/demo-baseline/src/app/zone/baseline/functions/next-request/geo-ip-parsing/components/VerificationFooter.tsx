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
      <DemoDeepDiveCard title="NextRequest IP/Geo 텔레메트리 파싱">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>NextRequest</code>는 웹 표준 <code>Request</code>를 확장한 Next.js 전용 클래스로,
              호스팅 인프라가 제공하는 클라이언트 IP(<code>request.ip</code>), 지리적 위치(<code>request.geo</code>), 파싱된 URL 객체(<code>request.nextUrl</code>)를 내장하고 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 프록시 및 로컬 환경 헤더 폴백</h5>
            <p>
              로컬 개발 환경이나 특정 프록시 뒤에서는 <code>request.geo</code>가 비어있을 수 있으므로,
              실무에서는 <code>request.headers.get('x-forwarded-for')</code>, <code>x-vercel-ip-country</code>, <code>cf-ipcountry</code> 등의 헤더를 폴백으로 함께 검사하여 방어적으로 코드를 작성해야 합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>글로벌 이커머스 최적화: 접속 국가에 맞춘 통화(KRW/USD/EUR/JPY) 및 세금/배송비 자동 계산</li>
              <li>보안 및 부정 방지(Fraud Detection): 비정상 국가에서의 대량 결제 시도 차단 및 봇 방어</li>
              <li>SEO 및 언어 자동 라우팅: Accept-Language 헤더와 Geo 정보를 조합한 지능형 리다이렉트</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>국가별 결제 게이트웨이(토스/스트라이프/페이팔) 자동 분기</li>
              <li>GDPR / 개인정보보호 규정 준수를 위한 쿠키 배너 조건부 표시</li>
              <li>다국어 사이트 자동 로케일 추천</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
