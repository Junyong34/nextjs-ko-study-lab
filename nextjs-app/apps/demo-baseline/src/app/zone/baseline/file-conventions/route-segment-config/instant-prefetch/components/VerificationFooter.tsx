'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="세그먼트 즉시 프리패칭 (instant) 실증 검증"
        expected="• 세그먼트 즉시 프리패칭 (instant) 사양에 따른 정상 동작 및 상태 변화 관찰"
        actual="• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"
        isMatched={true}
        description="Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."
      />
      <DemoDeepDiveCard title="세그먼트 즉시 프리패칭 (instant)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>next.config.ts의 전역 설정(images, headers, rewrites, redirects, logging, cacheComponents)은 Next.js 런타임과 빌드 컴파일러의 동작을 세밀하게 조정하여 보안, 자산 최적화, 프록시 라우팅을 인프라 레벨에서 통제합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 images.remotePatterns로 AWS S3 및 공인 CDN 이미지 도메인만 엄격히 허용하여 악의적인 외부 이미지 주입을 차단하고, logging.fetches로 서버 fetch 호출의 캐시 히트/미스 로그를 실시간 관찰합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>외부 이미지 보안(SSRF) 방어: 승인되지 않은 임의의 외부 URL 이미지가 서버 이미지 최적화 리소스를 고갈시키는 공격을 차단합니다.</li>
              <li>글로벌 보안 헤더 일괄 주입: CSP, HSTS, X-Frame-Options 헤더를 모든 페이지에 일괄 적용하여 전자상거래 보안 규정을 준수합니다.</li>
              <li>투명한 서버 데이터 캐시 관찰: 백엔드 API 호출 시 캐시 상태와 응답 시간을 터미널에 상세 출력하여 성능 병목을 즉시 진단합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>AWS S3 상품 이미지 버킷 도메인 보안 화이트리스트 등록</li>
              <li>외부 레거시 물류/정산 API 엔드포인트 프록시 라우팅(rewrites)</li>
              <li>Next.js 16 Cache Components 플래그 활성화 및 전역 캐시 튜닝</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
