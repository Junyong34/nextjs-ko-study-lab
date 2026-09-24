import { DemoDeepDiveCard } from '@study/demo-kit'

const H = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

const TREE = `soft-navigation-scroll/
├─ page.tsx                 ← 이 화면 (가이드 · iframe · 검증)
└─ viewport/
   ├─ layout.tsx            ← sticky 헤더 + <Link> 4개 + 실측 훅 (이동해도 유지)
   └─ [chapter]/page.tsx    ← <article data-scroll-page> = "첫 Page 엘리먼트"
                               (1·2·3장, 이동 시 이 세그먼트만 교체)`

export function ScrollDeepDive() {
  return (
    <DemoDeepDiveCard title="<Link scroll>의 실제 동작 (16.3.2)" className="min-w-0 [&_code]:break-all">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={H}>1. 기본값 true는 &quot;맨 위로&quot;가 아니다</h5>
          <p>
            공식 문서: &quot;The default scrolling behavior of <code>&lt;Link&gt;</code> is to maintain scroll position
            … if the Page is not visible in the viewport, Next.js will scroll to the top of the first Page element.&quot;
            실제 코드(<code>client/components/layout-router.js</code>)는 새로 마운트된 Page 세그먼트의 첫 DOM 노드를
            찾아 <code>rect.top</code>이 <code>[scroll-padding-top, documentElement.clientHeight]</code> 안이면 아무것도
            하지 않고, 밖이면 <code>htmlElement.scrollTop = 0</code>을 한 뒤 그래도 안 보이면{' '}
            <code>scrollIntoView()</code>를 호출합니다. 그래서 조금만 내린 상태(Page 상단이 아직 보임)에서 기본 링크를
            누르면 scrollY가 그대로 남습니다 — 표에서 &quot;판별 불가 조건&quot;으로 표시되는 경우입니다.
          </p>
        </div>

        <div>
          <h5 className={H}>2. scroll={'{false}'}와 해시(#id)</h5>
          <p>
            <code>scroll={'{false}'}</code>는 라우터 상태의 <code>ScrollBehavior.NoScroll</code>로 전달되어 새 세그먼트의
            scrollRef를 <code>false</code>로 무효화합니다(<code>segment-cache/navigation.js</code>). 해시만 바뀌는
            이동(<code>onlyHashChange</code>)은 세그먼트가 새로 생기지 않아도 스크롤하도록 별도 ref를 만들고, 대상은{' '}
            <code>getElementById</code> → <code>getElementsByName</code> 순으로 찾아 <code>scrollIntoView()</code>합니다.
            반대로 <code>scroll={'{false}'}</code>를 준 해시 링크는 주소창의 해시만 바뀌고 스크롤하지 않습니다(공식 문서의{' '}
            <code>href=&quot;/#hashid&quot; scroll={'{false}'}</code> 예시).
          </p>
          <p className="mt-1.5">
            공식 문서에 없는 경계 동작도 실측됩니다. 이미 같은 해시인 기본 링크를 다시 누르면 <code>onlyHashChange</code>가
            아니고 새 세그먼트도 없어 스크롤이 일어나지 않는데, 이때 라우터 상태의 <code>hashFragment</code>는 소비되지
            않고 남습니다. 그 뒤 기본 링크로 다른 장에 가면 Page 상단이 보이는 상태였더라도 새 Page의 같은 id로
            스크롤됩니다([#s-5 결론 · 기본] 두 번 → 조금만 내린 채 [다음 장 · 기본]). 검증 로직은 이 순서 의존 동작을
            기대값에 반영합니다.
          </p>
        </div>

        <div>
          <h5 className={H}>3. 왜 iframe 안의 별도 문서인가</h5>
          <p>
            이 데모 페이지는 셸 iframe 높이에 맞춰 늘어나므로 자체 <code>window.scrollY</code>가 항상 0이고,{' '}
            <code>clientHeight</code>도 페이지 전체 높이라 Next.js 판정에서는 무엇이든 &quot;보이는&quot; 상태가 됩니다.
            그래서 고정 높이(440px) iframe에 실제 라우트 <code>viewport/[chapter]</code>를 띄워 document 스크롤을 Next.js
            라우터가 직접 다루게 했습니다. 스크롤을 흉내 내는 <code>div.scrollTop</code> 조작은 없습니다.
          </p>
          <pre className="mt-2 overflow-x-auto rounded bg-zinc-100 p-2 font-mono text-[11px] text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {TREE}
          </pre>
        </div>

        <div>
          <h5 className={H}>4. 하드 리로드가 없었다는 증거</h5>
          <p>
            <code>performance.timeOrigin</code>은 문서가 새로 로드될 때만 바뀌고, 레이아웃 카운터는{' '}
            <code>viewport/layout.tsx</code>의 React state입니다. 1장 → 2장 → 3장으로 이동해도 두 값이 이어진다는 것은
            레이아웃이 언마운트되지 않고 Page 세그먼트만 교체됐다는 뜻입니다. [기록 초기화]는 일부러 iframe 문서를 새로
            로드하므로 새 timeOrigin과 카운터 0에서 다시 시작합니다.
          </p>
        </div>

        <div>
          <h5 className={H}>5. 실무 주의사항</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              sticky 헤더가 있으면 해시 대상이 헤더 뒤에 가려집니다. 공식 문서 권장대로 <code>scroll-padding-top</code>(html)
              또는 대상의 <code>scroll-margin-top</code>으로 보정합니다 — 이 데모는 섹션에 112px(모바일 192px)을 줬고, 실측 top이 이 값과
              같아야 일치입니다.
            </li>
            <li>
              <code>scrollIntoView()</code>는 같은 출처의 조상 문서도 스크롤합니다. 셸 안에서 [#s-5 결론 · 기본]을 누르면
              바깥 페이지도 함께 움직일 수 있는 것은 이 브라우저 동작 때문입니다.
            </li>
            <li>
              프로그래밍 방식 이동도 같습니다: <code>router.push(href, {'{ scroll: false }'})</code>.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
