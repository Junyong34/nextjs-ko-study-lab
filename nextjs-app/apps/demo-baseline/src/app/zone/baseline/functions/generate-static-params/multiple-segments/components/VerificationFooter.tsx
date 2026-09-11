'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  category?: string
  id?: string
  productName?: string
  isPrebuilt?: boolean
  isCategoryPrebuilt?: boolean
}

export function VerificationFooter({
  category,
  id,
  productName,
  isPrebuilt,
  isCategoryPrebuilt,
}: VerificationFooterProps) {
  const hasCombo = Boolean(category && id)
  const isMatched = hasCombo ? typeof isPrebuilt === 'boolean' : undefined

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="generateStaticParams [category]/[id] 조합 판정 검증"
        expected={
          '• layout(부모)+page(자식) generateStaticParams()가 모두 반환한 category+id 조합 → next build 시점에 정적 HTML 생성\n' +
          '• 실제 카테고리·상품이지만 목록 밖 조합 → dynamicParams 기본값(true)에 따라 요청 시 온디맨드 생성\n' +
          '• 존재하지 않는 카테고리/id, 또는 category와 id가 불일치하는 조합 → notFound()로 실제 404'
        }
        actual={
          hasCombo
            ? `• params = { category: "${category}", id: "${id}" } (${productName})\n` +
              `• [category] 레이어 판정: ${
                isCategoryPrebuilt
                  ? '부모 generateStaticParams 목록에 포함 → 카테고리 자체가 사전 SSG됨'
                  : '부모 목록에 없음 → 카테고리 레이어부터 온디맨드'
              }\n` +
              `• [id] 레이어 판정: ${
                isPrebuilt ? '자식 generateStaticParams 목록에 포함 → 사전 SSG 빌드됨' : '자식 목록에 없음 → 온디맨드 생성됨'
              }`
            : '• 실습 화면에서 조합을 클릭해 [category]/[id] 서브 라우트로 이동하세요. 잘못된 조합을 클릭하면 이 페이지 대신 실제 404 화면으로 이동합니다.'
        }
        isMatched={isMatched}
        description="이동한 조합의 params.category / params.id가 각 레이어(부모 layout, 자식 page)의 generateStaticParams() 반환 배열에 포함되는지를 실제로 판정한 결과입니다."
      />
      <DemoDeepDiveCard title="generateStaticParams() 다중 세그먼트([category]/[id]) 조합 & Top-down 생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              여러 동적 세그먼트가 중첩된 라우트(<code>[category]/[id]</code>)에서 파라미터를 만드는 방법은 두
              가지입니다. ①<strong>bottom-up</strong>: 자식 <code>page.tsx</code> 하나가{' '}
              <code>{'{ category, id }'}</code> 조합 전체를 한 번에 반환. ②<strong>top-down</strong>: 부모{' '}
              <code>[category]/layout.tsx</code>가 먼저 카테고리 목록을 반환하면, 자식{' '}
              <code>[category]/[id]/page.tsx</code>의 <code>generateStaticParams({'{ params }'})</code>가 그
              카테고리를 넘겨받아 해당 카테고리의 id만 반환합니다. 이 데모는 ②top-down 방식입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 실제 동작</h5>
            <p>
              부모 <code>layout.tsx</code>는 <code>MOCK_PRODUCTS</code>에서 BEST 상품이 있는 카테고리만
              반환합니다. 자식 <code>page.tsx</code>는 부모가 반환한 <strong>카테고리 개수만큼</strong>{' '}
              호출되며, 매 호출마다 <code>params.category</code>로 받은 값으로 <code>PREBUILT_COMBINATIONS</code>
              를 필터링해 그 카테고리의 BEST 상품 id만 반환합니다. 그 결과 카테고리·id 레이어의 판정이 서로
              다른 조합(카테고리는 사전 SSG, id는 온디맨드 / 카테고리·id 모두 온디맨드)이 실제로 존재합니다.
              category와 id가 실존해도 서로 짝이 맞지 않으면(<code>product.category !== category</code>)
              자식 <code>page.tsx</code>가 <code>notFound()</code>를 호출해 진짜 404를 반환합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              3. next build 실제 실행 결과로 확인하는 ● SSG vs ƒ Dynamic
            </h5>
            <p className="mb-1.5">
              브라우저 상호작용만으로는 "빌드 타임에 미리 생성되었는지"를 직접 관찰할 수 없습니다 (dev
              서버는 매 요청을 다시 렌더링합니다). 아래는 이 데모 코드로{' '}
              <code>pnpm --filter @study/demo-baseline build</code>를 실제로 실행해 얻은 라우트 표 원본입니다
              (Cache Components 미사용 zone 기준 공식 범례: ○ Static / ● SSG / ƒ Dynamic):
            </p>
            <pre className="text-[11px] bg-zinc-950 text-emerald-400 p-2.5 rounded overflow-x-auto font-mono">
{`├ ○ /zone/baseline/functions/generate-static-params/multiple-segments
├   /zone/baseline/functions/generate-static-params/multiple-segments/shop/[category]/[id]
│ ├ ● /zone/baseline/functions/generate-static-params/multiple-segments/shop/electronics/prod-001
│ ├ ● /zone/baseline/functions/generate-static-params/multiple-segments/shop/electronics/prod-002
│ ├ ● /zone/baseline/functions/generate-static-params/multiple-segments/shop/fashion/prod-004
│ └ ● [+2 more paths]

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)`}
            </pre>
            <p className="mt-1.5">
              (<code>pnpm --filter @study/demo-baseline build</code> 실제 실행 결과 원본. "+2 more paths"가
              books/prod-006, sports/prod-008입니다.) 빌드 산출물에는 정확히 이 5개 조합만 정적 HTML로
              존재합니다 — <code>living</code> 카테고리는 부모 <code>generateStaticParams()</code> 목록에 없어
              표에 아예 나타나지 않지만, 404가 아니라 첫 요청 시 카테고리·id 레이어가 모두 온디맨드로
              렌더링됩니다 (curl로 직접 확인: 200 응답). <code>electronics/prod-003</code>처럼 카테고리는
              사전 SSG되었지만 id가 목록 밖인 경우도 같은 방식으로 200 온디맨드 응답이며,{' '}
              <code>fashion/prod-001</code>(category/id 불일치)과 <code>toys/prod-001</code>(존재하지 않는
              카테고리)만 실제 404입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 및 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                자식의 <code>generateStaticParams({'{ params }'})</code>는 부모가 반환한 파라미터{' '}
                <strong>각각에 대해 한 번씩</strong> 호출됩니다 — 카테고리가 4개면 자식 함수도 4번 호출됩니다.
              </li>
              <li>
                자식은 조상 세그먼트의 파라미터만 만들 수 있고, 그 반대(하위 세그먼트가 상위 파라미터를
                생성)는 불가능합니다.
              </li>
              <li>
                category+id처럼 서로 다른 두 자원을 조합할 때는, id만 존재 여부를 검사하는 것으로 부족합니다.
                반드시 <code>product.category === category</code>처럼 두 세그먼트가 같은 레코드를 가리키는지
                교차 검증해야 잘못된 조합이 다른 카테고리의 상세 페이지로 새는 것을 막을 수 있습니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
