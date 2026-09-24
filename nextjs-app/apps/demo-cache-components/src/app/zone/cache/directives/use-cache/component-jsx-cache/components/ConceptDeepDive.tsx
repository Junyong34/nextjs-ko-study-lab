import { DemoDeepDiveCard } from '@study/demo-kit'

const TREE = `CategoryStage (동적: await searchParams)
└─ <CachedRankingPanel category="fashion">   ← 'use cache'
   │   캐시 키 = 빌드 ID + 함수 ID + 직렬화된 props { category }
   │   (dev에서는 HMR 해시도 포함)
   ├─ 랭킹 JSX, 렌더 시각·ID·실행 횟수      ← 캐시된 RSC 페이로드
   └─ {children}                              ← 구멍(hole)만 캐시됨
       └─ <RequestTimeSlot />                 ← 캐시 밖, 매 요청 렌더`

export function ConceptDeepDive() {
  return (
    <DemoDeepDiveCard title="컴포넌트 단위 'use cache'와 children 인터리빙">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 무엇이 캐시되는가</h5>
          <p>
            async 서버 컴포넌트 본문 첫 줄에 <code>&apos;use cache&apos;</code>를 두면 그 컴포넌트가 반환한 JSX(RSC 페이로드)가
            캐시 항목으로 저장됩니다. 같은 직렬화 props로 다시 렌더되면 본문을 실행하지 않고 저장된 출력을 씁니다. 그래서 이 데모의 렌더 시각·ID·실행
            횟수는 캐시 HIT 동안 바뀌지 않습니다. 이 값들은 본문이 마지막으로 실제 실행될 때 기록된 값입니다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. props가 캐시 키가 된다</h5>
          <p>
            공식 문서의 캐시 키 구성은 빌드 ID, 함수 ID, 직렬화 가능한 인자(컴포넌트는 props), 그리고 dev 전용 HMR 해시입니다.{' '}
            <code>category</code>가 바뀌면 다른 항목이 만들어지고, 이전 값으로 돌아오면 이전 항목이 다시 쓰입니다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. children은 키에 들어가지 않는다 (pass-through)</h5>
          <p>
            <code>children</code> 같은 React 요소는 캐시 컴포넌트가 읽거나 가공하지 않고 그대로 반환할 때만 받을 수 있습니다. 이 슬롯은 캐시 항목에 영향을 주지
            않으며, 채워지는 내용은 바깥(캐시 밖)에서 매 요청 렌더됩니다. 캐시된 틀 안에 동적 콘텐츠를 끼워 넣는 이 구성을 인터리빙이라고 부릅니다.
          </p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-900 p-3 font-mono text-[11px] text-zinc-100">{TREE}</pre>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 주의사항</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              캐시 컴포넌트 안에서 <code>searchParams</code>, <code>cookies()</code>, <code>headers()</code>를 읽으면 오류입니다. 이 데모처럼 바깥에서 읽고
              문자열 prop으로 넘깁니다.
            </li>
            <li>캐시된 출력 안의 Client Component props도 함께 캐시됩니다. 요청마다 달라야 하는 값은 children 슬롯으로 넘깁니다.</li>
            <li>
              기본 in-memory 캐시는 서버 인스턴스마다 따로 존재합니다. 서버리스 환경에서는 요청이 다른 인스턴스로 가면 HIT이 되지 않을 수 있습니다.
            </li>
            <li>
              함수 결과(데이터) 캐싱은 형제 실습 <code>function-cache</code>에서 다룹니다. 이 실습은 컴포넌트 출력(JSX) 단위 캐싱만 다룹니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
