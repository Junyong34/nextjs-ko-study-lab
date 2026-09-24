import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const TREE = `cacheTag('catalog' /* 단일 태그 */)                      -> 카탈로그 요약
cacheTag('catalog', 'catalog:category:keyboard')       -> 키보드 목록
cacheTag('catalog', 'catalog:category:mouse')          -> 마우스 목록
cacheTag('catalog', 'catalog:category:keyboard', 'product:k1' | 'product:k2')
cacheTag('catalog', 'catalog:category:mouse',    'product:m1' | 'product:m2')

updateTag('catalog')                    -> 7개 재계산
updateTag('catalog:category:keyboard')  -> 키보드 목록 + k1 + k2 = 3개
updateTag('product:k1')                 -> k1 상품 1개`

export function CascadeDeepDive() {
  return (
    <DemoDeepDiveCard title="태그 계층과 무효화 범위(blast radius)">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 개념</h5>
          <p>
            Next.js의 태그에는 부모-자식 관계가 없다. 태그는 평평한 문자열이고, 무효화는 &quot;그 문자열을
            부착한 모든 캐시 엔트리&quot;를 만료시킬 뿐이다. &quot;연쇄 무효화&quot;는 프레임워크 기능이 아니라{' '}
            <strong>하위 엔트리가 상위 태그까지 함께 부착하도록 설계한 결과</strong>다. 상품 엔트리가{' '}
            <code>catalog</code> 태그도 달고 있기 때문에 <code>updateTag(&apos;catalog&apos;)</code> 한 번으로 상품까지
            같이 재계산된다.
          </p>
        </div>

        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 이 데모의 엔트리와 태그 구조</h5>
          <p>
            <code>cachedData.ts</code>의 <code>&apos;use cache&apos;</code> 함수 3종이 인자별로 서로 다른 엔트리 7개를
            만든다. 각 엔트리는 본문이 실행될 때만 새 <code>cacheId</code>와 생성 시각을 기록하므로, 값이 바뀌었다면 그
            엔트리가 실제로 다시 계산된 것이다. (실제 태그 문자열에는 <code>functions-cache-tag-cascade-invalidation:</code> 접두사가 붙는다.)
          </p>
          <pre className="mt-2 overflow-x-auto rounded border border-zinc-200 bg-zinc-50 p-2.5 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-900">
            {TREE}
          </pre>
        </div>

        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. updateTag를 쓴 이유</h5>
          <p>
            <code>updateTag</code>는 Server Action 전용이며 태그를 즉시 만료시켜, 같은 액션 응답의 렌더가 새 값을 기다려
            읽는다(read-your-own-writes). <code>revalidateTag(tag, &apos;max&apos;)</code>는 stale-while-revalidate라서
            첫 요청은 이전 값을 받고 백그라운드에서 갱신되므로, 클릭 한 번으로 전후를 비교하기 어렵다. Route Handler나
            웹훅에서 무효화할 때는 <code>revalidateTag</code>를 쓴다.
          </p>
        </div>

        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 설계 팁</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>범위는 부착 시점에 정해진다</strong>: 넓게 지울 태그(상위)와 좁게 지울 태그(하위)를 엔트리마다 모두
              달아 두어야 무효화 시점에 범위를 고를 수 있다.
            </li>
            <li>
              <strong>상위 태그는 비용이 크다</strong>: <code>catalog</code> 무효화는 연결된 모든 엔트리를 다음 요청에서
              다시 계산하게 만든다. 데이터 변경 범위에 맞는 가장 좁은 태그를 고른다.
            </li>
            <li>
              <strong>네임스페이스</strong>: <code>catalog:category:keyboard</code>처럼 계층을 문자열에 드러내면 읽기
              쉽지만, 접두사 일치로 지워지지는 않는다. 정확히 같은 문자열만 무효화된다.
            </li>
            <li>
              <strong>측정 시 프리렌더 주의</strong>: 이 페이지를 정적 프리렌더로 두면 화면 값은 빌드 프로세스가 만든
              것이고 운영 서버의 캐시에는 그 엔트리가 없어, 첫 무효화에서 7개가 모두 새로 계산되는 것처럼 보인다(실측).
              그래서 엔트리 영역은 <code>connection()</code> + <code>Suspense</code>로 요청 시점에 실행 중인 서버의 캐시에서 읽는다.
            </li>
            <li>
              <strong>한도</strong>: <code>cacheTag()</code> 한 번에 태그는 최대 128개, 각 256자까지다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
