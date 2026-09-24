import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const TREE = `page.tsx (Server Component, async)
 ├─ await searchParams → parseFilters → queryProducts   ← 필터링·정렬은 서버에서
 └─ <ShopDemo snapshot products categories>  ('use client')
     ├─ useState(cart)                                  ← 클라이언트 전용 상태는 여기 하나
     ├─ <div className="group">
     │   ├─ <FilterBar>   useSearchParams + router.push  ← URL만 결정 (가이드의 LabelFilter)
     │   │   └─ <ChipGroup changeAction>  startTransition + useOptimistic ×2
     │   │        └─ data-pending                       ← 대기 상태를 DOM 속성으로 노출
     │   └─ 상품 목록  group-has-data-pending:opacity-50  ← 조상이 CSS로만 반응
     └─ <CartSummary items={cart}>`

const MATRIX: [string, string, string, string][] = [
  ['필터 칩 클릭', '새 항목 push', '새 searchParams로 다시 렌더', '유지 (같은 인스턴스)'],
  ['뒤로가기', '이전 항목으로 복원', '이전 URL 기준 결과로 복원', '유지 — 되돌아가지 않음'],
  ['새로고침', '그대로', '같은 URL로 다시 렌더', '초기화 (새 문서, 새 인스턴스)'],
  ['링크 공유 / 새 탭', '그대로 전달', '같은 결과 렌더', '빈 장바구니로 시작'],
]

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="상태를 어디에 두는가 — URL · 서버 · 클라이언트">
      <div className="space-y-4 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 가이드의 흐름 (Interactive apps, Step 3)</h5>
          <p>
            선택된 필터는 URL에서 옵니다. <code>router.push()</code>는 클라이언트 내비게이션을 시작하고, 서버는 새 search params로
            page를 다시 렌더링합니다. 이 내비게이션이 끝날 때까지 페이지는 이전 URL 상태를 그리므로, 가이드는 필터를 둘로 나눕니다.
            URL을 정하는 <code>LabelFilter</code>(여기서는 <code>FilterBar</code>)와, 전달받은 <code>changeAction</code>을 자신의{' '}
            <code>startTransition</code> 안에서 실행하며 <code>useOptimistic</code>으로 선택 칩과 <code>data-pending</code>을 즉시 바꾸는{' '}
            <code>ChipGroup</code>입니다. 목록은 스켈레톤으로 바뀌지 않고 <code>group-has-data-pending:</code>으로 흐려지기만 합니다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 컴포넌트 트리와 상태 위치</h5>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] leading-snug text-zinc-200">{TREE}</pre>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 위치별 결과 (검증 패널이 실측하는 내용)</h5>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-[11px]">
              <thead className="text-zinc-500">
                <tr>
                  <th className="py-1 pr-2 font-normal">조작</th>
                  <th className="py-1 pr-2 font-normal">URL (필터)</th>
                  <th className="py-1 pr-2 font-normal">서버 (목록)</th>
                  <th className="py-1 font-normal">클라이언트 (장바구니)</th>
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row) => (
                  <tr key={row[0]} className="border-t border-zinc-200 dark:border-zinc-800">
                    {row.map((cell, i) => (
                      <td key={i} className={`py-1 pr-2 ${i === 0 ? 'font-semibold text-zinc-900 dark:text-zinc-100' : ''}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 주의사항</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              공유·북마크·뒤로가기로 되살아나야 하는 값(필터, 정렬, 페이지 번호)은 URL에, 그렇지 않은 값(장바구니 초안, 펼침 여부)은
              클라이언트 상태에 둡니다. 장바구니를 새로고침 뒤에도 남기려면 서버 저장(Server Function)이나 쿠키 같은 별도 저장소가 필요합니다.
            </li>
            <li>
              검색 쿼리로 목록이 바뀌는 page는 요청마다 렌더링되는 다이나믹 렌더링입니다. 뒤로가기 시 서버를 다시 거치는지는 관측 로그의
              renderId 재사용 여부로 확인하세요.
            </li>
            <li>
              <code>FilterBar</code>는 클릭 시점의 <code>useSearchParams()</code>로 다음 URL을 만듭니다. 이전 이동이 끝나기 전에 다른 그룹의
              칩을 누르면 아직 반영되지 않은 URL을 기준으로 계산되므로, 빠른 연속 입력이 잦다면 이 점을 고려해야 합니다.
            </li>
            <li>
              가이드의 설명대로 <code>:has()</code> 기반 <code>data-pending</code> 스타일은 필터처럼 드물게 바뀌는 상호작용에 적합합니다.
              드래그·스크롤처럼 고빈도 상호작용에는 클라이언트 상태를 씁니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
