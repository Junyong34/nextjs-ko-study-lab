'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  currentId?: string
}

export function VerificationFooter({ currentId }: VerificationFooterProps) {
  const isMatched = Boolean(currentId && currentId.startsWith('PROD-'))

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="[id] 단일 동적 세그먼트 실증 검증"
        expected="• items/[id] 폴더 컨벤션에 매칭되어 params.id가 Promise 객체로 주입\n• URL 경로와 동적 파라미터가 정확히 일치하여 상품 상세 렌더링"
        actual={
          currentId
            ? `• [동적 파라미터 감지] params.id = "${currentId}"\n• items/[id]/page.tsx 서버 컴포넌트 마운트 및 데이터 바인딩 완료`
            : '• 상품 카탈로그 목록 화면 (상품을 클릭하여 [id] 서브 라우트로 이동하세요)'
        }
        isMatched={currentId ? isMatched : undefined}
        description="Next.js App Router의 [folderName] 컨벤션을 통해 URL 경로 변수를 서버 컴포넌트의 params 속성으로 전달받는 동작을 검증합니다."
      />
      <DemoDeepDiveCard title="[id] 단일 동적 세그먼트 & React 19 비동기 params 언래핑">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              대괄호(<code>[folderName]</code>) 폴더는 URL 경로 변수를 캡처하는 단일 동적 세그먼트(Dynamic Segment)를 정의합니다. Next.js 15+ 및 React 19에서는 <code>params</code> Props가 <code>Promise{'<'}{'{'} [key: string]: string {'}'}{'>'}</code> 객체로 전달되어 비동기적으로 언래핑해야 합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 사용자가 상품 카탈로그에서 특정 상품(예: <code>PROD-001</code>)을 클릭했을 때, <code>items/[id]</code> 라우트가 파라미터 <code>id</code> 값을 Promise로 수신하여 <code>await params</code> 또는 <code>use(params)</code>로 언래핑한 후 해당 상품의 상세 데이터를 화면에 렌더링합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>수만 개의 엔티티 라우팅 일원화</strong>: 단 하나의 <code>page.tsx</code> 템플릿으로 방대한 상품, 게시글, 사용자 프로필 상세 페이지를 유연하게 렌더링합니다.</li>
              <li><strong>TypeScript 타입 안전성</strong>: <code>params: Promise{'<'}{'{'} id: string {'}'}{'>'}</code> 제네릭 타입을 통해 컴파일 타임에 파라미터 누락을 검증합니다.</li>
              <li><strong>PPR 및 스트리밍 정렬</strong>: 파라미터 해석을 비동기화하여 정적 레이아웃 셸을 브라우저에 0ms로 즉각 스트리밍합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>이커머스 상품 상세 페이지 (<code>/products/[id]</code>)</li>
              <li>사용자 프로필 및 주문 내역 (<code>/users/[username]</code>, <code>/orders/[orderNumber]</code>)</li>
              <li>블로그 포스트 및 뉴스 기사 본문 (<code>/posts/[slug]</code>)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>하위 다중 세그먼트 미지원</strong>: <code>[id]</code>는 정확히 1개의 URL 슬래시 세그먼트만 매칭되므로, <code>items/1/reviews</code>처럼 하위 경로가 더 이어지는 경우 404가 발생하며 다중 경로 매칭에는 <code>[...slug]</code>를 사용해야 합니다.</li>
              <li><strong>generateStaticParams() 결합</strong>: 빌드 시점에 정적 사전 렌더링(SSG)을 적용하려면 <code>export async function generateStaticParams()</code>를 선언하여 생성할 ID 목록을 반환해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
