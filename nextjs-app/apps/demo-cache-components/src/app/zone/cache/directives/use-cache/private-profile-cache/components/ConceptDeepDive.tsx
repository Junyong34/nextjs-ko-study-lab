import { DemoDeepDiveCard } from '@study/demo-kit'

const CODE = `// queries.ts — 캐시 스코프 "안에서" 쿠키를 읽는다
export async function getMyOrders() {
  'use cache: private'
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 })
  const userId = (await cookies()).get(USER_COOKIE)?.value
  return { cacheId, generatedAt, orders: buildOrders(userId) }
}

// page.tsx, shipping/page.tsx — 이 세그먼트만 Partial Prefetching
export const prefetch = 'partial'
// <Suspense>로 감싼 <PrivateOrdersPanel /> 가 getMyOrders()를 호출

// shared-cache-probe.ts — 대조군 (오류)
export async function getOrdersWithSharedCache() {
  'use cache'
  const value = (await cookies()).get(USER_COOKIE)?.value // ← 거부됨
}`

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const list = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'
const cell = 'border-t border-zinc-200 px-2 py-1 dark:border-zinc-800'

const ROWS: [string, string, string][] = [
  ['서버 측 저장', '메모리 또는 cache handler', '없음'],
  ['캐시 범위', '모든 사용자 공유', '브라우저(클라이언트)별'],
  ['cookies()/headers() 직접 읽기', '불가 (인자로 전달)', '가능'],
  ['새로고침 후', '서버 항목 유지', '사라짐'],
]

export function ConceptDeepDive() {
  return (
    <DemoDeepDiveCard title="'use cache: private': 요청 데이터를 읽는 브라우저 전용 캐시">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 무엇이 다른가</h5>
          <p>
            일반 <code>&apos;use cache&apos;</code> 결과는 서버에 저장되어 같은 키를 쓰는 모든 사용자가 공유하므로, 사용자마다 다른
            쿠키를 캐시 스코프 안에서 읽을 수 없습니다. <code>&apos;use cache: private&apos;</code>는 이 제한을 풀어 주는 대신 결과를{' '}
            <strong>서버에 저장하지 않고 브라우저 메모리에만</strong> 둡니다. 그래서 서버에서는 렌더할 때마다 본문이 실행되고(실행 순번이
            계속 증가), 공유할 서버 항목이 없으니 다른 사용자에게 섞일 수 없습니다.
          </p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-900 p-3 font-mono text-[11px] text-zinc-100">{CODE}</pre>
        </div>
        <div>
          <h5 className={h}>2. 브라우저는 무엇을 재사용하는가</h5>
          <ul className={list}>
            <li>
              두 탭은 <code>prefetch = &apos;partial&apos;</code> 세그먼트입니다. <code>&lt;Link&gt;</code>가 화면에 보이면 라우트의 App
              Shell을 프리페치하는데, 쿠키로 결정되는 부분도 <code>&apos;use cache: private&apos;</code>로 수명이 정해져 있으면 셸에
              포함됩니다. 이 프리페치 요청에서도 서버는 본문을 실행합니다.
            </li>
            <li>
              셸은 세션(브라우저)별로 클라이언트 메모리에 보관되어, 탭을 오갈 때 서버 요청 없이 같은 cacheId가 다시 표시됩니다. 새로고침하면
              메모리가 비워져 새 값을 받습니다.
            </li>
            <li>
              App Shell에 포함되려면 <code>stale</code>이 5분 이상이어야 하고, 런타임 프리페치에는 30초 이상이 필요합니다. 그래서{' '}
              <code>cacheLife</code>의 <code>stale</code>을 300초로 지정했습니다.
            </li>
            <li>
              같은 페이지에 캐시 지시어 없이 <code>cookies()</code>를 읽는 부분이 있으면 그 부분은 셸에 담기지 않고 이동할 때마다 서버에서
              새로 렌더됩니다.
            </li>
          </ul>
        </div>
        <div>
          <h5 className={h}>3. 세 지시어 비교 (use-cache-remote 문서 표 기준)</h5>
          <table className="w-full text-left text-[11px]">
            <thead className="text-zinc-500">
              <tr>
                <th className="px-2 py-1">항목</th>
                <th className="px-2 py-1">&apos;use cache&apos;</th>
                <th className="px-2 py-1">&apos;use cache: private&apos;</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([k, a, b]) => (
                <tr key={k}>
                  <td className={cell}>{k}</td>
                  <td className={cell}>{a}</td>
                  <td className={cell}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h5 className={h}>4. 주의사항</h5>
          <ul className={list}>
            <li>
              공식 문서는 가능하면 쿠키를 캐시 밖에서 읽어 인자로 넘기는 일반 <code>&apos;use cache&apos;</code>를 권장합니다. private은
              리팩터링이 어렵거나 규정상 서버에 데이터를 남길 수 없을 때 씁니다.
            </li>
            <li>
              <code>connection()</code>은 private 스코프에서도 금지되고, Route Handler에서는 이 지시어를 쓸 수 없으며, 커스텀 cache
              handler도 지정할 수 없습니다.
            </li>
            <li>
              런타임 데이터에 의존하므로 static shell 생성 때는 실행되지 않습니다. 호출하는 컴포넌트를 <code>&lt;Suspense&gt;</code>로
              감쌉니다.
            </li>
            <li>
              쿠키를 바꾸는 Server Action(사용자 전환)은 현재 라우트를 다시 렌더하므로, 전환 직후에는 이전 사용자의 값이 아니라 새로 실행된
              값이 표시됩니다.
            </li>
            <li>
              대조군 오류 메시지는 프로덕션에서 가려지고 digest만 전달됩니다. 원문(&quot;used `cookies()` inside &quot;use cache&quot;&quot;)은
              서버 로그와 dev 화면에서 확인할 수 있습니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
