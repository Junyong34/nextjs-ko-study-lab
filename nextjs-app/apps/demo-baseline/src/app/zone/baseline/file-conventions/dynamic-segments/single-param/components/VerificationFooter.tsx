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
      <DemoDeepDiveCard title="[id] 단일 동적 세그먼트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              대괄호(<code>[folderName]</code>)로 폴더 이름을 지정하면 해당 세그먼트가 동적 파라미터로 동작합니다.
              Next.js 15+ 및 16에서는 <code>PageProps</code>의 <code>params</code>가 비동기 <code>Promise</code>로 제공되므로 <code>await params</code> 또는 React 19의 <code>use(params)</code>로 언래핑해야 합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. generateStaticParams()와의 결합</h5>
            <p>
              빌드 시점에 동적 세그먼트의 정적 HTML을 사전 생성(SSG)하려면 동일한 <code>page.tsx</code>에서 <code>generateStaticParams()</code> 함수를 export하여 가능한 파라미터 배열(<code>{"[{ id: '1' }, { id: '2' }]"}</code>)을 반환할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>유연한 URL 라우팅: 수만 개의 상품, 게시글, 사용자 프로필 페이지를 단 하나의 템플릿으로 처리</li>
              <li>타입 안정성: TypeScript에서 <code>{`params: Promise<{ id: string }>`}</code> 제네릭 타이핑 지원</li>
              <li>서버 최적화: 서버 컴포넌트에서 파라미터를 즉시 받아 병렬 DB 쿼리 수행 가능</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>이커머스 상품 상세 페이지 (<code>/products/[id]</code>)</li>
              <li>사용자 대시보드 및 프로필 (<code>/users/[username]</code>)</li>
              <li>주문 결제 확인 페이지 (<code>/orders/[orderNumber]</code>)</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
