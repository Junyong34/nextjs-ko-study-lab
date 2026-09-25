import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/intercepting-routes/direct-vs-modal',
)

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton, DemoDeepDiveCard } from '@study/demo-kit'
import { GalleryClient } from './components/GalleryClient'

export default function DirectVsModalDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 가이드 */}
      <DemoGuideCard
        title="직접 진입 vs 모달 대조 (Intercepting Routes)"
        concept="같은 URL(target/[id])이라도 <Link>로 소프트 내비게이션하면 @modal/(.)target/[id]가 가로채 모달로 렌더링되고, 새 탭 직접 진입이나 새로고침으로 하드 내비게이션하면 target/[id]/page.tsx 전체 페이지가 렌더링됩니다."
        steps={[
          {
            step: 1,
            title: '[소프트 내비게이션 (<Link>) → 모달] 클릭',
            description: '갤러리에서 상품 링크를 클릭해 (.)target/[id] 인터셉트 라우트를 실행하고 배경 갤러리 컨텍스트를 유지합니다.',
            actionBadge: '모달 가로채기',
          },
          {
            step: 2,
            title: '[새 탭에서 직접 진입 (하드 내비게이션)] 클릭',
            description: '같은 항목을 새 탭에서 열어 브라우저가 실제로 새 문서를 요청하는 하드 내비게이션을 발생시킵니다.',
            actionBadge: '전체 페이지',
          },
          {
            step: 3,
            title: '두 탭의 검증 패널에서 실측값 대조',
            description: 'Navigation Timing API로 측정한 문서 요청 경로와 현재 경로가 일치하는지 비교해 어느 파일이 렌더링됐는지 실측으로 확인합니다.',
            actionBadge: '결과 대조',
            observe: '동일한 URL이 진입 방식(소프트 vs 하드)에 따라 모달 오버레이 또는 독립 전체 페이지로 분기 렌더링됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 화면 */}
      <DemoPlaygroundCard title="아웃도어 장비 갤러리 (직접 진입 vs 모달 대조)">
        <div className="mb-3 flex justify-end">
          <DemoResetButton label="갤러리 새로고침" />
        </div>
        <GalleryClient />
      </DemoPlaygroundCard>

      {/* 3단. 검증 — 실제 실측은 target/[id] 전체 페이지와 (.)target/[id] 모달 각각의 화면에서 표시됩니다 */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 text-xs leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
        [검증] 실측 패널은 목적지 화면(모달 오버레이 / <code>target/[id]</code> 전체 페이지)에 각각
        표시됩니다. 위의 두 진입 버튼을 각각 눌러 두 화면의 &quot;내비게이션 실측&quot; 패널을 직접
        대조하세요.
      </div>

      {/* 4단. 개념 정리 */}
      <DemoDeepDiveCard title="직접 진입(Direct) vs 모달 인터셉트(Modal) 렌더링 대조">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 스펙 및 파일 구조</h5>
            <p>
              이 데모는 <code>direct-vs-modal/</code> 안에 자체 <code>@modal</code> 병렬 라우트 슬롯을 둡니다.
              <code>@modal/(.)target/[id]/page.tsx</code>가 <code>target/[id]</code>와 같은 레벨(<code>(.)</code>)에서
              가로채므로, 소프트 내비게이션으로 도달하면 모달이, 하드 내비게이션으로 도달하면 형제 라우트인{' '}
              <code>target/[id]/page.tsx</code>가 렌더링됩니다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 실측 방식 (No-Simulation)</h5>
            <p>
              &quot;모달인지 전체 페이지인지&quot;는 <code>useState</code> 토글이 아니라 실제로 어떤 파일이
              호출되었는지로 결정됩니다. 그 위에 브라우저의 <code>performance.getEntriesByType(&apos;navigation&apos;)</code>
              값을 읽어, 문서가 처음 요청된 경로와 현재 경로가 같은지(하드 내비게이션) 다른지(소프트
              내비게이션)를 실측해 기대값과 대조합니다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 같은 URL, 다른 렌더링</h5>
            <p>
              모달을 연 뒤 그 화면에서 새로고침(F5)하면 주소는 그대로인데 렌더 결과만 전체 페이지로
              바뀝니다 — 라우트 가로채기는 URL이 아니라 &quot;진입 방식&quot;에 달려 있다는 것을 가장
              직접적으로 보여주는 지점입니다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 활용</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>공유 가능한 URL을 유지하면서도 탐색 중에는 모달로 빠르게 보여주는 상세/퀵뷰 패턴.</li>
              <li>새로고침·직접 링크 진입 시에는 SEO와 접근성을 위해 완전한 단독 페이지를 서빙.</li>
              <li>형제 데모(<code>file-conventions/intercepting-routes</code>)가 가로채기 자체의 발생 여부를
                실증한다면, 이 데모는 같은 대상 경로에 대한 두 렌더링 결과를 나란히 실측 대조합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </DemoContainer>
  )
}
