'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  isValidProduct?: boolean
  productId?: string
}

export function VerificationFooter({
  isValidProduct = false,
  productId,
}: VerificationFooterProps) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="not-found.tsx 및 notFound() 트리거 검증 결과"
        expected="• DB에 없는 리소스 접근 시 notFound() 호출\n• Next.js 런타임이 세그먼트의 not-found.tsx를 포착하여 404 상태 및 전용 UI 렌더링"
        actual={
          productId
            ? `• [상품 조회 성공] ID: ${productId} -> 200 OK 페이지 마운트`
            : '• 상품 목록 대기 상태 (미등록 상품 링크 클릭 시 not-found.tsx 렌더링 확인 가능)'
        }
        isMatched={productId ? isValidProduct : undefined}
        description="Next.js App Router의 not-found.tsx 파일 컨벤션과 notFound() 함수를 통한 정밀한 404 에러 라우팅을 검증합니다."
      />
      <DemoDeepDiveCard title="not-found.tsx 및 notFound() 기반 404 라우팅 아키텍처">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>notFound()</code> 함수는 <code>NEXT_NOT_FOUND</code> 특수 예외를 throw하여 렌더링 파이프라인을 중단하고, 가장 가까운 부모 세그먼트의 <code>not-found.tsx</code> 컴포넌트를 마운트하는 Next.js 표준 404 처리 API입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 사용자가 DB에 등록되지 않은 상품 ID(예: <code>prod-999</code>)나 단종된 상품 URL로 접근했을 때, 서버 컴포넌트에서 <code>if (!product) notFound()</code>를 호출하여 HTTP 404 상태 코드와 함께 맞춤형 상품 안내 화면을 즉시 렌더링하는 과정을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>검색엔진 SEO 품질 보호</strong>: 브라우저와 크롤러에 정확한 HTTP 404 상태 코드를 반환하여 검색엔진 색인 오염 및 소프트 404 페널티를 방지합니다.</li>
              <li><strong>사용자 이탈 최소화</strong>: 깨진 화면 대신 추천 상품 카탈로그 및 홈 바로가기 링크를 제공하여 체류 시간을 방어합니다.</li>
              <li><strong>세그먼트 단위 맞춤 404</strong>: 전역 404 대신 카테고리 레이아웃 내부에서 동작하는 세부 404 안내를 구성할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 삭제/비공개 처리된 상품 상세 페이지(404 Not Found)</li>
              <li>존재하지 않는 판매자 스토어 및 만료된 프로모션 기획전 URL</li>
              <li>유효하지 않은 게시글 또는 블로그 포스트 접근 차단</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>try/catch 블록 내 notFound() 래핑 금지</strong>: <code>notFound()</code>는 Next.js 내부 예외(NEXT_NOT_FOUND)를 throw하여 동작하므로, <code>try/catch</code> 블록으로 감싸서 삼켜버리면 404 화면이 렌더링되지 않습니다.</li>
              <li><strong>클라이언트 컴포넌트에서의 호출</strong>: <code>notFound()</code>는 서버 컴포넌트뿐 아니라 클라이언트 컴포넌트에서도 호출 가능하며, 루트 <code>not-found.tsx</code> 또는 세그먼트 <code>not-found.tsx</code>를 트리거합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
