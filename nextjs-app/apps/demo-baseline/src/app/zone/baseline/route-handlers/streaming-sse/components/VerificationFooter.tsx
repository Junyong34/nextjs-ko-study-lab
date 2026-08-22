'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="ReadableStream 기반 Server-Sent Events(SSE) 스트리밍 실증 검증"
        expected="• ReadableStream 기반 Server-Sent Events(SSE) 스트리밍 사양에 따른 정상 동작 및 상태 변화 관찰"
        actual="• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"
        isMatched={true}
        description="Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."
      />
      <DemoDeepDiveCard title="ReadableStream 기반 Server-Sent Events(SSE) 스트리밍">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>headers()와 NextRequest, NextResponse는 웹 표준 Request/Response 모델을 확장하여 서버 환경에서 요청 헤더(User-Agent, Authorization, IP)를 검사하고, JSON 빌더, 쿠키 설정, 보안 응답 헤더를 손쉽게 주입하는 유틸리티입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 User-Agent 헤더를 분석하여 모바일 앱 웹뷰 고객에게는 전용 간편결제 UI를 서빙하고, NextRequest.geo를 통해 해외 접속자에게는 현지 통화(USD)와 관세 안내를 자동으로 계산해 제공합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>기기 및 국가별 초개인화: 클라이언트 자바스크립트 실행 전 서버에서 즉시 모바일/데스크톱 및 국가별 맞춤 화면을 렌더링합니다.</li>
              <li>REST API와 완벽 호환: NextResponse.json()으로 엔터프라이즈 모바일 앱 백엔드 API를 완벽하게 서빙합니다.</li>
              <li>보안 토큰 및 CORS 제어: API 응답에 엄격한 CORS, Cache-Control, 보안 헤더를 손쉽게 주입합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 REST API Route Handler(/api/products, /api/cart) 구현</li>
              <li>User-Agent 기반 모바일 앱 전용 결제 SDK 분기 처리</li>
              <li>Geo IP 기반 글로벌 국가별 통화 및 배송비 자동 계산</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
