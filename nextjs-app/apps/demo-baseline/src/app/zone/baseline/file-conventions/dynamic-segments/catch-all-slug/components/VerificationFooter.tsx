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
      <DemoDeepDiveCard title="[...slug] 포괄적 동적 세그먼트 (Catch-all Segments)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              대괄호 안에 줄임표(<code>[...folderName]</code>)를 포함한 폴더는 <b>Catch-all Segments</b>로 동작하며, 해당 위치 이후의 모든 하위 경로 세그먼트를 <code>string[]</code> 문자열 배열로 캡처하여 전달합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>shop/[...slug]</code> 라우트에서 1단계 대분류(<code>/shop/fashion</code>), 2단계 중분류(<code>/shop/fashion/shoes</code>), 3단계 세분류(<code>/shop/fashion/shoes/sneakers</code>) 등 임의의 깊이 URL을 단일 <code>page.tsx</code>에서 수신하여 브레드크럼(Breadcrumb)과 필터 트리를 동적으로 파싱합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>가변 깊이 계층 구조 단일화</strong>: N단계의 카테고리 트리나 폴더 구조를 여러 파일 생성 없이 단 하나의 파일로 처리합니다.</li>
              <li><strong>자동 브레드크럼 파싱</strong>: <code>slug.map()</code>을 활용하여 상위 카테고리 내비게이션 경로를 손쉽게 동적 렌더링합니다.</li>
              <li><strong>파일 탐색기 및 위키 아키텍처 최적화</strong>: 깊이를 예측할 수 없는 문서나 스토리지 디렉토리에 유연하게 대응합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대규모 쇼핑몰 다계층 카테고리 브라우저 (<code>/shop/category/sub/item</code>)</li>
              <li>사내 위키 및 지식 베이스 아티클 뷰어 (<code>/wiki/section/topic/page</code>)</li>
              <li>클라우드 파일 스토리지 및 탐색기 UI</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>루트 경로 미매칭 (404 발생)</strong>: <code>[...slug]</code>는 최소 1개 이상의 하위 세그먼트가 있어야 매칭되므로, 파라미터가 없는 루트 경로(<code>/shop</code>) 접근 시 404 에러가 발생합니다. 루트까지 포함하려면 <code>[[...slug]]</code>(Optional Catch-all)을 사용해야 합니다.</li>
              <li><strong>params 언래핑 타입</strong>: <code>params: Promise{'<'}{'{'} slug: string[] {'}'}{'>'}</code> 형태로 배열 타입을 명시하고 비동기 언래핑해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
