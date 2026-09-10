'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  productId?: string
  isPrebuilt?: boolean
  productName?: string
}

export function VerificationFooter({ productId, isPrebuilt, productName }: VerificationFooterProps) {
  const isMatched = productId ? typeof isPrebuilt === 'boolean' : undefined

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="generateStaticParams 사전 SSG 판정 검증"
        expected="• BEST 상품 ID → generateStaticParams() 목록에 포함되어 next build 시점에 정적 HTML 생성\n• 그 외 상품 ID → dynamicParams 기본값(true)에 따라 요청 시 온디맨드 생성"
        actual={
          productId
            ? `• params.productId = "${productId}" (${productName})\n• 실제 판정: ${
                isPrebuilt ? 'generateStaticParams 목록에 포함 → 사전 SSG 빌드됨' : '목록에 없음 → 온디맨드 생성됨'
              }`
            : '• 상품 목록에서 카드를 클릭해 [productId] 서브 라우트로 이동하세요.'
        }
        isMatched={isMatched}
        description="이동한 상품의 params.productId가 generateStaticParams() 반환 배열에 포함되는지를 실제로 판정한 결과입니다."
      />
      <DemoDeepDiveCard title="generateStaticParams() 빌드 타임 SSG & dynamicParams 기본값">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>generateStaticParams()</code>는 동적 세그먼트(<code>[productId]</code>)에 채워 넣을 파라미터
              배열을 반환해, 해당 경로들을 <strong>빌드 시점</strong>에 정적 HTML로 미리 생성(SSG)하는 함수입니다.
              반환 배열에 없는 파라미터는 <code>dynamicParams</code> 설정값에 따라 동작이 갈립니다 —
              기본값 <code>true</code>는 요청 시점 온디맨드 생성, <code>false</code>는 404입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 실제 동작</h5>
            <p>
              이 데모는 <code>MOCK_PRODUCTS.filter(p =&gt; p.isBest)</code>로 뽑은 BEST 상품 ID만
              <code>generateStaticParams()</code>가 반환합니다. BEST 상품 카드를 클릭하면 <em>이미 빌드 타임에
              생성된</em> 페이지를, 일반 상품 카드를 클릭하면 <code>dynamicParams</code> 기본값(true)에 의해
              <em>지금 이 요청에서 새로 생성된</em> 페이지를 보게 됩니다. 3단 검증 패널의 판정은
              <code>generateStaticParams()</code>가 사용하는 것과 동일한 <code>POPULAR_PRODUCT_IDS</code> 배열을
              참조해 계산됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              3. next build 실제 실행 결과로 확인하는 ● SSG vs ƒ Dynamic
            </h5>
            <p className="mb-1.5">
              브라우저 상호작용만으로는 "빌드 타임에 미리 생성되었는지"를 직접 관찰할 수 없습니다 (dev 서버는
              매 요청을 다시 렌더링합니다). 아래는 이 데모 코드로 <code>pnpm --filter @study/demo-baseline
              build</code>를 실제로 실행해 얻은 라우트 표 원본입니다 (Cache Components 미사용 zone 기준 공식
              범례: ○ Static / ● SSG / ƒ Dynamic):
            </p>
            <pre className="text-[11px] bg-zinc-950 text-emerald-400 p-2.5 rounded overflow-x-auto font-mono">
{`├ ○ /zone/baseline/functions/generate-static-params/basic-ssg
├   /zone/baseline/functions/generate-static-params/basic-ssg/products/[productId]
│ ├ ● /zone/baseline/functions/generate-static-params/basic-ssg/products/prod-001
│ ├ ● /zone/baseline/functions/generate-static-params/basic-ssg/products/prod-002
│ ├ ● /zone/baseline/functions/generate-static-params/basic-ssg/products/prod-004
│ └ ● [+2 more paths]

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)`}
            </pre>
            <p className="mt-1.5">
              &quot;+2 more paths&quot;가 나머지 prod-006, prod-008입니다 — generateStaticParams()가 반환한
              5개(prod-001, 002, 004, 006, 008)만 실제로 빌드 산출물에 정적 HTML로 존재합니다. 목록에 없는
              prod-003·005·007은 이 표에 나타나지 않지만 404가 아니라 dynamicParams 기본값(true)에 따라
              첫 요청 시 렌더링되고, 이후 정적 결과로 캐시됩니다 (curl로 직접 확인: 두 경우 모두 200, 존재하지
              않는 productId만 실제 404).
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 및 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>인기 상품 상위 N개만 사전 SSG하고 나머지는 온디맨드로 처리하면, 빌드 시간과 CDN 즉시 응답의
                균형을 맞출 수 있습니다 (공식 문서의 &quot;Subset of paths at build time&quot; 패턴).</li>
              <li><code>export const dynamicParams = false</code>로 바꾸면 목록 밖 productId는 이 페이지에
                도달하지 못하고 곧바로 404가 됩니다 — 진짜 404 동작은
                <code>file-conventions/not-found</code> 데모에서 확인할 수 있습니다.</li>
              <li>이 zone은 Cache Components를 쓰지 않으므로 ◐(Partial Prerender) 표시는 나타나지 않습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
