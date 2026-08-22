'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  currentSlug?: string[]
  isDocsRoute?: boolean
}

export function VerificationFooter({
  currentSlug,
  isDocsRoute = false,
}: VerificationFooterProps) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="[[...slug]] 선택적 포괄 세그먼트 실증 검증"
        expected="• docs/[[...slug]] 폴더 컨벤션에 매칭되어 루트(/docs) 접근 시 undefined, 하위 경로(/docs/a/b) 접근 시 string[] 주입\n• 단일 page.tsx에서 루트 인덱스와 N단계 서브 페이지 일원화 처리"
        actual={
          isDocsRoute
            ? currentSlug && currentSlug.length > 0
              ? `• [하위 경로 감지] params.slug = [${currentSlug.map(s => `"${s}"`).join(', ')}] (길이: ${currentSlug.length})\n• docs/[[...slug]] 서브 문서 렌더링 완료`
              : '• [루트 경로 감지] params.slug = undefined\n• docs/[[...slug]] 루트 인덱스 렌더링 완료'
            : '• 문서 네비게이션 대기 중 (위 링크를 클릭하여 [[...slug]] 라우트로 이동하세요)'
        }
        isMatched={isDocsRoute ? true : undefined}
        description="Next.js App Router의 [[...folderName]] 컨벤션을 통해 파라미터가 없는 루트 경로와 가변 하위 경로를 단일 컴포넌트에서 처리하는 동작을 검증합니다."
      />
      <DemoDeepDiveCard title="[[...slug]] 선택적 포괄 세그먼트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              이중 대괄호(<code>[[...folderName]]</code>)는 <b>Optional Catch-all Segments</b>로 동작합니다.
              단일 대괄호 포괄 세그먼트(<code>[...slug]</code>)와 달리, 파라미터가 아예 없는 루트 디렉토리(<code>/docs</code>)까지 매칭되며 이때 <code>params.slug</code>는 <code>undefined</code>가 됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. [...slug] vs [[...slug]] 비교표</h5>
            <p>
              <code>/docs</code> 요청 시: <code>[...slug]</code>는 404 Not Found를 반환하지만, <code>[[...slug]]</code>는 <code>slug: undefined</code>로 매칭되어 루트 페이지를 렌더링합니다.
              <code>/docs/a/b</code> 요청 시: 두 컨벤션 모두 <code>slug: ['a', 'b']</code>로 동일하게 매칭됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>중복 파일 제거: <code>docs/page.tsx</code>와 <code>docs/[...slug]/page.tsx</code> 2개 파일을 만들 필요 없이 <code>docs/[[...slug]]/page.tsx</code> 1개로 통합</li>
              <li>일관된 레이아웃 & 상태 관리: 루트 문서와 서브 문서가 동일한 템플릿과 뷰어를 공유</li>
              <li>CMS 기반 사이트 최적화: 헤드리스 CMS의 동적 페이지 트리를 가장 유연하게 렌더링</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>통합 개발자 문서 및 기술 블로그 (<code>/docs</code> 및 <code>/docs/*</code>)</li>
              <li>다국어 랜딩 페이지 (<code>/kr</code>, <code>/kr/pricing</code>, <code>/kr/features/enterprise</code>)</li>
              <li>카테고리 메인 홈 및 세부 상품 필터링 일체형 뷰어</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
