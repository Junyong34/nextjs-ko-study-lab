'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  currentSlug?: string[]
}

export function VerificationFooter({ currentSlug }: VerificationFooterProps) {
  const isMatched = Boolean(currentSlug && currentSlug.length > 0)

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="[...slug] 포괄적 동적 세그먼트 실증 검증"
        expected="• shop/[...slug] 폴더 컨벤션에 매칭되어 params.slug가 문자열 배열(string[])로 주입\n• 가변 깊이 URL(1~N단계)을 단일 라우트 파일에서 완벽히 수신 및 브레드크럼 파싱"
        actual={
          currentSlug
            ? `• [배열 파라미터 감지] params.slug = [${currentSlug.map(s => `"${s}"`).join(', ')}] (길이: ${currentSlug.length})\n• shop/[...slug]/page.tsx 계층 구조 동적 파싱 완료`
            : '• 카테고리 진입 대기 상태 (원하는 계층 카테고리를 클릭하여 [...slug] 라우트로 이동하세요)'
        }
        isMatched={currentSlug ? isMatched : undefined}
        description="Next.js App Router의 [...folderName] 컨벤션을 통해 1단계 이상의 모든 하위 경로 세그먼트를 배열 형태로 전달받는 동작을 검증합니다."
      />
      <DemoDeepDiveCard title="[...slug] 포괄적 동적 세그먼트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              대괄호 안에 줄임표(<code>[...folderName]</code>)를 포함한 폴더는 <b>Catch-all Segments</b>로 동작하며, 해당 위치 이후의 모든 경로 세그먼트를 <code>string[]</code> 배열로 묶어 제공합니다.
              예를 들어 <code>/shop/a/b/c</code> 요청 시 <code>params.slug</code>는 <code>['a', 'b', 'c']</code>가 됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. [id] vs [...slug] 차이점</h5>
            <p>
              단일 동적 세그먼트 <code>[id]</code>는 정확히 1개의 세그먼트(<code>/shop/123</code>)만 매칭되며 하위 경로(<code>/shop/123/reviews</code>)는 404를 반환합니다.
              반면 <code>[...slug]</code>는 깊이에 상관없이 1개 이상의 모든 하위 경로를 하나의 페이지 파일에서 처리합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>가변 깊이 카테고리: 대분류/중분류/소분류/세분류 등 N단계 카테고리 트리를 일원화된 파일로 구축</li>
              <li>파일 탐색기 및 문서 시스템: 폴더 트리 깊이에 유연하게 대응하는 CMS 및 문서 뷰어 구현</li>
              <li>브레드크럼 자동화: <code>slug.map()</code>으로 상위 경로 링크를 손쉽게 동적 생성</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 다계층 카테고리 브라우징 (<code>/shop/category/sub/leaf</code>)</li>
              <li>위키 및 지식 베이스 아티클 경로 (<code>/wiki/section/topic/page</code>)</li>
              <li>클라우드 파일 스토리지 디렉토리 탐색</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
