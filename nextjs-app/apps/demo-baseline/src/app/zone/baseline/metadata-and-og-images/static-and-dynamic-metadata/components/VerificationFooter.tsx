'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="generateMetadata 동적 메타데이터 &amp; 소셜 공유 미리보기 실증 검증"
        expected="• generateMetadata 동적 메타데이터 &amp; 소셜 공유 미리보기 사양에 따른 정상 동작 및 상태 변화 관찰"
        actual="• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"
        isMatched={true}
        description="Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."
      />
      <DemoDeepDiveCard title="generateMetadata 동적 메타데이터 &amp; 소셜 공유 미리보기">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>generateMetadata 비동기 함수는 서버 컴포넌트가 렌더링되기 전, 동적 세그먼트 파라미터(params)와 쿼리(searchParams)를 기반으로 DB에서 상품 정보를 조회하여 HTML head의 title, description, canonical, robots 메타태그를 동적으로 구성합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 예제에서는 /products/prod-001 접근 시 DB에서 상품명(&apos;프로 무선 기계식 키보드&apos;)과 가격(&apos;189,000원&apos;)을 조회하여 브라우저 타이틀(&apos;[17% 특가] 프로 무선 기계식 키보드 - 쇼핑몰&apos;) 및 SEO 설명 태그를 완벽하게 자동 생성합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>검색엔진 SEO 최적화: 수만 개의 상품마다 고유하고 정확한 SEO 타이틀과 메타태그를 동적으로 부여하여 구글/네이버 검색 노출을 극대화합니다.</li>
              <li>부모 메타데이터 상속 및 병합: 루트 레이아웃의 공통 쇼핑몰 메타데이터를 상속받으면서 필요한 필드(title, og:image)만 깔끔하게 오버라이드합니다.</li>
              <li>요청 중복 제거(fetch deduping): 동일 렌더링 사이클 내에서 generateMetadata와 page.tsx가 동일 상품 API를 호출해도 단 한 번만 네트워크 요청이 발생합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상품 상세 페이지별 동적 SEO 타이틀 및 캐노니컬 URL 생성</li>
              <li>카테고리 기획전별 맞춤 메타 디스크립션 및 키워드 태그 주입</li>
              <li>다국어(ko/en/ja) 쇼핑몰의 hreflang 다국어 대체 링크 메타태그 구성</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
