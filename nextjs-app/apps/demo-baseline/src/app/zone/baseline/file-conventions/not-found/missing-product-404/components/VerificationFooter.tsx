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
        title="not-found.tsx 및 notFound() 트리거 실증 검증"
        expected="• DB에 없는 리소스 접근 시 notFound() 호출\n• Next.js 런타임이 세그먼트의 not-found.tsx를 포착하여 404 상태 및 전용 UI 렌더링"
        actual={
          productId
            ? `• [상품 조회 성공] ID: ${productId} -> 200 OK 페이지 마운트`
            : '• 상품 목록 대기 상태 (미등록 상품 링크 클릭 시 not-found.tsx 렌더링 확인 가능)'
        }
        isMatched={productId ? isValidProduct : undefined}
        description="Next.js App Router의 not-found.tsx 파일 컨벤션과 notFound() 함수를 통한 정밀한 404 에러 라우팅을 검증합니다."
      />
      <DemoDeepDiveCard title="not-found.tsx 및 notFound()">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 동작 원리</h5>
            <p>
              <code>notFound()</code> 함수는 Next.js 전용 에러(<code>NEXT_NOT_FOUND</code>)를 throw하여 현재 렌더링을 중단하고, 가장 가까운 부모 세그먼트의 <code>not-found.tsx</code> 파일을 화면에 마운트합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. HTTP 상태 코드 404 반환</h5>
            <p>
              클라이언트 렌더링뿐만 아니라 서버 렌더링(SSR) 및 정적 생성(SSG) 환경에서도 브라우저와 검색 엔진 크롤러에게 실제 <b>HTTP 404 Not Found</b> 헤더를 전송하여 SEO 품질을 보호합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>사용자 이탈 방지: 깨진 화면 대신 추천 상품 목록이나 홈 링크가 포함된 친절한 안내 UI 제공</li>
              <li>도메인 보안: 비공개 또는 권한 없는 리소스에 대해 존재 여부를 감추고 404로 응답</li>
              <li>중첩 세그먼트 격리: 전역 404 페이지가 아닌 해당 카테고리/상품 레이아웃 내부의 부분 404 지원</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
