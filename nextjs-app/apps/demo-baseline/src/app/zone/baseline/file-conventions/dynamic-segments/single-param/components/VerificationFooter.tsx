'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  currentId?: string
}

export function VerificationFooter({ currentId }: VerificationFooterProps) {
  const pathname = usePathname()

  const urlSegment = currentId
    ? decodeURIComponent(pathname.split('/').filter(Boolean).pop() ?? '')
    : undefined
  const isMatched = currentId ? urlSegment === currentId : undefined

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="[id] 단일 다이나믹 세그먼트 검증 결과"
        expected={
          <>
            {'• items/[id] 폴더 컨벤션에 매칭되어 params.id가 Promise 객체로 주입\n'}
            {'• URL의 마지막 세그먼트 값과 params.id가 정확히 일치 (카탈로그 존재 여부와 무관)'}
          </>
        }
        actual={
          currentId ? (
            <>
              {`• 현재 경로: "${pathname}"\n`}
              {`• URL 마지막 세그먼트: "${urlSegment}"\n`}
              {`• 서버 컴포넌트가 수신한 params.id: "${currentId}"\n`}
              {'• 두 값이 일치 → 가짜 state가 아니라 실제 [id] 라우팅이 캡처한 값'}
            </>
          ) : (
            <>{'• 상품 카탈로그 목록 화면 (상품을 클릭하여 [id] 서브 라우트로 이동하세요)'}</>
          )
        }
        isMatched={isMatched}
        description="Next.js App Router의 [folderName] 컨벤션을 통해 URL 경로 변수가 params로 전달되는 동작을, usePathname()으로 읽은 실제 URL과 서버가 받은 params.id를 직접 대조해 검증합니다. PROD-999처럼 DB에 없는 값으로 이동해도 동일하게 일치해야 합니다."
      />
      <DemoDeepDiveCard title="[id] 단일 다이나믹 세그먼트 & React 19 비동기 params 언래핑">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              대괄호(<code>[folderName]</code>) 폴더는 URL 경로 변수를 캡처하는 단일 다이나믹 세그먼트(Dynamic Segment)를 정의합니다. Next.js 16 및 React 19에서는 <code>params</code> Props가 <code>Promise{'<'}{'{'} [key: string]: string {'}'}{'>'}</code> 객체로 전달되어 비동기적으로 언래핑해야 합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 사용자가 상품 카탈로그에서 특정 상품(예: <code>PROD-101</code>)을 클릭했을 때, <code>items/[id]</code> 라우트가 파라미터 <code>id</code> 값을 Promise로 수신하여 <code>await params</code>로 언래핑한 후 해당 상품의 상세 데이터를 화면에 렌더링합니다. <code>[id]</code>는 값의 존재 여부를 검증하지 않으므로 <code>PROD-999</code>처럼 DB에 없는 값도 문자열 그대로 전달됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>수만 개의 엔티티 라우팅 일원화</strong>: 단 하나의 <code>page.tsx</code> 템플릿으로 방대한 상품, 게시글, 사용자 프로필 상세 페이지를 유연하게 렌더링합니다.</li>
              <li><strong>TypeScript 타입 안전성</strong>: <code>params: Promise{'<'}{'{'} id: string {'}'}{'>'}</code> 제네릭 타입을 통해 컴파일 타임에 파라미터 누락을 검증합니다.</li>
              <li><strong>generateStaticParams 결합</strong>: 미리 알고 있는 id 목록만 빌드 시점에 정적 생성하고, 그 외 값은 요청 시점에 런타임으로 처리합니다.</li>
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
              <li><strong>존재 검증은 애플리케이션 책임</strong>: 라우팅 자체는 <code>PROD-999</code> 같은 값도 그대로 통과시키므로, DB에 없는 id를 <code>notFound()</code>로 처리할지 이 데모처럼 폴백 UI로 보여줄지는 페이지 코드가 직접 결정해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
