import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'
import { REVALIDATE_SECONDS } from '../tags'

const KEY_FORMULA = `// next/dist/server/web/spec-extension/unstable-cache.js (16.3.2)
fixedKey      = \`\${cb.toString()}-\${keyParts.join(',')}\`      // unstable_cache() 생성 시
invocationKey = \`\${fixedKey}-\${JSON.stringify(args)}\`            // 호출 시
// tags는 키에 들어가지 않는다 — 무효화 그룹일 뿐이다`

const MIGRATION = `// Before: unstable_cache (이 데모)
const rows = await unstable_cache(
  selectProductsByCategory,                      // 인자 category → 키에 자동 포함
  ['functions-unstable-cache-db-query:', 'products-by-category'],
  { tags: [TAGS.all, TAGS.category(category)], revalidate: ${REVALIDATE_SECONDS} },
)(category)

// After: 'use cache' (Next.js 16 권장)
async function getProductsByCategory(category: Category) {
  'use cache'                                    // 인자·클로저가 키에 자동 포함 → keyParts 불필요
  cacheTag(TAGS.all, TAGS.category(category))    // tags → cacheTag
  cacheLife({ revalidate: ${REVALIDATE_SECONDS} })                  // revalidate → cacheLife
  return selectProductsByCategory(category)
}`

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const pre = 'overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] leading-relaxed text-zinc-200'

export function UnstableCacheDeepDive() {
  return (
    <DemoDeepDiveCard title="unstable_cache의 캐시 키, tags·revalidate, 그리고 레거시 API로서의 위치">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 캐시 키는 &quot;함수 소스 + keyParts + 인자&quot;</h5>
          <p>
            공식 문서는 &quot;기본적으로 인자와 함수의 문자열 표현을 키로 쓰며, keyParts는 인자로 넘기지 않은
            외부 변수를 쓸 때만 필요하다&quot;고 설명한다. 실제 구현도 그대로다. 그래서 A의 카테고리 조회는
            keyParts 없이도 카테고리별로 엔트리가 나뉘고, B의 합계 함수는 소스 문자열이 매번 같아서 클로저의{' '}
            <code>currency</code>를 keyParts에 넣지 않으면 KRW와 USD가 한 엔트리를 공유한다.
          </p>
          <pre className={`mt-2 ${pre}`}>{KEY_FORMULA}</pre>
        </div>

        <div>
          <h5 className={h}>2. tags와 revalidate</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>tags</strong>: 엔트리를 묶는 이름표다. <code>updateTag</code>는 태그를 즉시 만료시켜 다음 호출이
              쿼리를 다시 실행한다(MISS). 태그를 무효화하지 않으면 원본 DB가 바뀌어도 캐시는 옛 행을 계속 돌려준다.
            </li>
            <li>
              <strong>revalidate</strong>: 시간이 지나면 엔트리를 버리는 것이 아니라 <em>stale</em>로 표시한다.
              {` ${REVALIDATE_SECONDS}`}초가 지난 뒤 첫 호출은 옛 값을 즉시 반환하면서 쿼리를 백그라운드로
              재실행하고(STALE), 그다음 호출이 새 결과를 받는다. <code>revalidate: 0</code>은 오류로 거부되며, 생략하거나{' '}
              <code>false</code>면 태그 무효화 전까지 유지된다.
            </li>
          </ul>
        </div>

        <div>
          <h5 className={h}>3. Next.js 16에서의 위치: 레거시지만 별도 계층으로 동작</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              공식 문서 첫머리의 안내: 이 API는 Next.js 16에서 <code>&apos;use cache&apos;</code>로 대체됐고, Cache
              Components를 켜고 <code>&apos;use cache&apos;</code>로 옮기길 권장한다.
            </li>
            <li>
              이 앱은 <code>cacheComponents: true</code>다. 마이그레이션 가이드대로 기존 <code>unstable_cache</code>는
              &quot;별도 계층으로 계속 동작&quot;하며, 위 실습의 HIT/MISS/STALE이 그 실측이다. 저장소는{' '}
              <code>&apos;use cache&apos;</code>의 메모리 캐시가 아니라 fetch Data Cache와 같은 incremental cache다.
            </li>
            <li>
              결과는 <code>JSON.stringify</code>로 저장된다. MISS에서는 <code>executedAt</code>이 <code>Date</code>로,
              HIT·STALE에서는 <code>string</code>으로 돌아오는 것을 호출 기록에서 확인할 수 있다.
            </li>
            <li>
              fetch Data Cache처럼 배포·서버 인스턴스를 넘어 유지된다(<code>&apos;use cache&apos;</code>는 기본이 인메모리).
              운영 모드에서 서버를 재시작하면 쿼리 카운터는 0부터지만 엔트리는 남아 &quot;이전 서버 프로세스가 저장한
              엔트리&quot;로 HIT될 수 있다.
            </li>
            <li>
              페이지 렌더 중에 호출하면 Cache Components 프리렌더가 결과를 정적 셸에 포함시킬 수 있어, 이 데모는 모든
              호출을 Server Action에서 한다.
            </li>
          </ul>
        </div>

        <div>
          <h5 className={h}>4. &apos;use cache&apos; 마이그레이션 대조</h5>
          <pre className={pre}>{MIGRATION}</pre>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
