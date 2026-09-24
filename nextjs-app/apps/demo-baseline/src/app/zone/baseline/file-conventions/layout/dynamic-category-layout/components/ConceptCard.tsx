import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="[category]/layout.tsx가 받는 것과 다시 그려지는 순간" className="min-w-0">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. params는 루트부터 자기 세그먼트까지만</h5>
          <p>
            layout의 <code>params</code>는 루트 세그먼트부터 <strong>그 layout이 있는 세그먼트까지</strong>의 동적 파라미터를
            담은 Promise다. <code>[category]/layout.tsx</code>는 <code>/electronics/prod-001</code>에서도{' '}
            <code>{'{"category":"electronics"}'}</code>만 받는다. 하위 <code>[item]</code> 값은 그 아래의{' '}
            <code>page.tsx</code>(또는 <code>[item]/layout.tsx</code>)만 받는다. 서버에서는 <code>await params</code>,
            클라이언트에서는 <code>use(params)</code>로 푼다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 이 데모의 파일 트리</h5>
          <pre className="min-w-0 overflow-x-auto rounded bg-zinc-100 p-2.5 font-mono text-[11px] leading-relaxed dark:bg-zinc-900">
{`dynamic-category-layout/
├─ layout.tsx               (Server) 기록 Provider + 실습 틀 + 내비게이션
├─ page.tsx                 (Server) 시작 화면
└─ [category]/
   ├─ layout.tsx            (Server) await params → { category }, render ID
   ├─ page.tsx              (Server) params + searchParams(?sort) 수신
   └─ [item]/page.tsx       (Server) params → { category, item }`}
          </pre>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. searchParams를 받지 못하는 이유</h5>
          <p>
            layout은 내비게이션마다 다시 렌더되지 않는다. <code>?sort=price</code>만 바뀌어도 layout의 render ID가 그대로인
            것이 그 증거다. 이런 layout이 쿼리를 받으면 값이 금세 낡으므로 Next.js는 layout에 <code>searchParams</code>를
            넘기지 않는다. 쿼리가 필요하면 page의 <code>searchParams</code> prop이나 클라이언트의{' '}
            <code>useSearchParams</code>를 쓴다 (이 데모의 layout 프로브도 경로 기록에 <code>useSearchParams</code>를 쓴다).
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. category 값이 바뀌면 다른 layout이다</h5>
          <p>
            같은 <code>[category]</code> 값 안에서 page만 바뀌면 layout은 서버에서 다시 렌더되지 않고(render ID 유지) 클라이언트
            인스턴스도 유지된다(mount ID·메모·카운터 유지). 반면 <code>electronics → fashion</code>처럼 세그먼트 값이 바뀌면
            라우터는 이를 다른 세그먼트로 보고 layout을 서버에서 새로 렌더한 뒤 새 인스턴스로 마운트한다. 그래서 layout 안의
            상태가 초기화된다. 카테고리를 넘어 유지할 상태는 이 데모의 기록 장치처럼 <code>[category]</code> 바깥에 둔다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">5. 관측 방법</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              render ID·시각: <code>[category]/layout.tsx</code>가 <code>connection()</code> 뒤 렌더마다 만드는 값
            </li>
            <li>props 키: layout 함수가 받은 props 객체의 실제 키 목록</li>
            <li>mount ID·메모·카운터: layout이 렌더하는 클라이언트 컴포넌트의 useState</li>
            <li>이동 전후 비교는 [category] 바깥 layout의 Provider가 기록한다</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
