import { DemoDeepDiveCard } from '@study/demo-kit'

const H = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const LIST = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

const TREE = `catalog/layout.tsx        ← CatalogFrame (sticky 헤더 · 필터 버튼 · 실측) — 유지
└─ catalog/page.tsx       ← Server Component, await searchParams
   └─ <article data-scroll-page>   ← Next.js가 스크롤 판정에 쓰는 첫 Page 엘리먼트
      ├─ 패널 A  <div data-pane="kept">                 key 없음 → 같은 DOM
      ├─ 패널 B  <div data-pane="keyed" key={category}> key 변경 → 새 DOM
      └─ 전체 상품 목록 (문서 스크롤)`

export function RetentionDeepDive() {
  return (
    <DemoDeepDiveCard title="searchParams 필터 이동에서 스크롤이 움직이는 곳과 멈추는 곳">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={H}>1. searchParams만 바뀌어도 Page는 "새 Page"로 처리된다</h5>
          <p>
            <code>?cat=outer</code> → <code>?cat=knit</code>는 pathname이 같지만, Server Component page가 새{' '}
            <code>searchParams</code>로 다시 렌더링되는 내비게이션입니다. 그래서 기본값(<code>scroll</code> 미지정 = true)에서는
            Next.js가 Page 첫 엘리먼트가 뷰포트 안에 있는지 확인하고, 밖에 있으면 문서 상단으로 올린 뒤 Page 상단이 보이게
            합니다. 긴 목록 아래쪽에서 필터를 바꾸면 목록 맨 위로 튀는 이유입니다. 이미 보이면 아무 것도 하지 않으므로 "항상
            맨 위로"가 아닙니다.
          </p>
        </div>
        <div>
          <h5 className={H}>2. 문서 스크롤 보존: scroll=false (Link · push · replace 동일)</h5>
          <p>
            <code>{'<Link scroll={false}>'}</code>, <code>{'router.push(url, { scroll: false })'}</code>,{' '}
            <code>{'router.replace(url, { scroll: false })'}</code>는 이 스크롤 처리 자체를 건너뜁니다. 가이드의 dialog 예제도
            URL 상태를 바꿀 때 <code>{"router.replace('?', { scroll: false })"}</code>를 씁니다. push와 replace의 차이는
            history 항목 추가 여부이지 스크롤이 아닙니다.
          </p>
        </div>
        <div>
          <h5 className={H}>3. 목록 컨테이너 스크롤: DOM이 남아 있으면 보존, key로 초기화</h5>
          <p>
            Preserving UI state 가이드는 스크롤 위치를 &quot;DOM 상태&quot;로 봅니다. DOM이 문서에 남아 있으면 scrollTop도
            남습니다. searchParams만 바뀌면 Page는 언마운트되지 않고 다시 렌더링만 되므로(패널 A), 컨테이너의 scrollTop은{' '}
            <code>scroll</code> 옵션과 무관하게 그대로입니다. 필터가 바뀔 때 목록을 처음부터 보여 주고 싶다면 가이드가 제시한
            대로 <code>key</code>를 바꿔 React가 새 DOM을 만들게 합니다(패널 B).
          </p>
          <pre className="mt-2 overflow-x-auto rounded bg-zinc-100 p-2 font-mono text-[10px] leading-relaxed dark:bg-zinc-900">
            {TREE}
          </pre>
        </div>
        <div>
          <h5 className={H}>4. 실무 선택 기준</h5>
          <ul className={LIST}>
            <li>필터·정렬 칩이 목록 위에 붙어 있고 결과를 이어서 보는 화면: scroll=false로 문서 위치 유지</li>
            <li>필터 결과를 처음부터 봐야 하는 화면: 기본값(Page 상단으로) 또는 결과 컨테이너에 key 부여</li>
            <li>
              결과 개수가 크게 줄면 scroll=false여도 브라우저가 scrollY를 문서 높이에 맞춰 잘라냅니다. 이 데모는 카테고리마다
              24개로 높이를 같게 두어 이 효과를 뺐습니다.
            </li>
            <li>
              이 가이드의 Activity 기반 라우트 보존은 <code>cacheComponents</code> 전제입니다. 이 zone(baseline)은 그 설정이 없고,
              같은 Page 안에서 searchParams만 바뀌는 경우에는 Activity 없이도 DOM이 유지됩니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
