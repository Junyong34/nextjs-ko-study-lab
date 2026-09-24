import { DemoDeepDiveCard } from '@study/demo-kit'

const CODE = `// queries.ts — 함수 수준: 본문 첫 줄
export async function getCategoryStats(category, options) {
  'use cache'
  cacheLife('hours')
  return { cacheId, generatedAt: new Date(), priceByProduct: new Map(), tags: new Set(), ... }
}

// class-probe.ts — 파일 수준: 파일 첫 줄, export된 async 함수 전부가 캐시 함수
'use cache'
export async function getSummaryInstance(category) { return new PriceSummary(...) }

// StatsStage.tsx — 캐시 밖에서 searchParams를 읽어 인자로 전달
const { category, currency } = await searchParams
await Promise.all([
  getCategoryStats(category, { currency }),   // 호출 A
  getCategoryStats(category, { currency }),   // 호출 B: 새 객체지만 내용이 같아 같은 키
])`

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const list = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

export function ConceptDeepDive() {
  return (
    <DemoDeepDiveCard title="함수 단위 'use cache': 인자 기반 키, 반환값 직렬화, 요청 내 공유">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 무엇이 캐시되는가</h5>
          <p>
            async 함수 본문 첫 줄(또는 파일 첫 줄)에 <code>&apos;use cache&apos;</code>를 두면 그 함수의 <strong>반환값</strong>이
            직렬화되어 캐시 항목으로 저장됩니다. 같은 키로 다시 호출되면 본문을 실행하지 않고 저장된 값을 역직렬화해 돌려줍니다. 그래서
            캐시 HIT 동안 본문 안에서 기록한 cacheId·실행 시각·실행 횟수가 바뀌지 않습니다.
          </p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-900 p-3 font-mono text-[11px] text-zinc-100">{CODE}</pre>
        </div>
        <div>
          <h5 className={h}>2. 캐시 키 = 빌드 ID + 함수 ID + 직렬화된 인자</h5>
          <ul className={list}>
            <li>
              인자는 참조가 아니라 <strong>직렬화된 값</strong>으로 비교됩니다. 호출 A·B가 각자 새 <code>{'{ currency }'}</code> 객체를
              만들어도 내용이 같으면 같은 항목을 씁니다.
            </li>
            <li>category나 currency 중 하나만 달라도 다른 키입니다. 이전 조합으로 돌아오면 이전 항목이 그대로 남아 있습니다.</li>
            <li>바깥 스코프 변수를 참조하면 그 값도 인자처럼 키에 들어갑니다. dev에서는 HMR 해시도 키에 포함되어 코드 수정 시 항목이 새로 만들어집니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>3. 반환값 직렬화</h5>
          <p>
            반환값은 React 클라이언트 컴포넌트 직렬화 규칙을 따릅니다. <code>Date</code>, <code>Map</code>, <code>Set</code>은
            JSON과 달리 타입이 유지되어 호출부의 <code>instanceof</code> 검사를 통과합니다. 클래스 인스턴스는 지원되지 않아, 이 데모의{' '}
            <code>getSummaryInstance()</code>는 값을 돌려주지 않고 오류를 던집니다. 함수·Symbol·URL 인스턴스도 반환할 수 없으니 일반 객체로
            바꿔 반환합니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. 같은 요청 안의 여러 호출</h5>
          <p>
            한 요청에서 같은 키로 동시에 호출하면 진행 중인 실행에 합류합니다(16.3.2 <code>use-cache-wrapper.js</code>의 요청 내
            중복 제거). 처음 보는 인자라도 호출 A·B의 cacheId가 같고 실행 횟수가 한 번만 늘어나는 이유입니다. 데이터 접근 함수를 여러
            컴포넌트에서 따로 불러도 원본 조회는 한 번으로 끝납니다.
          </p>
        </div>
        <div>
          <h5 className={h}>5. 주의사항</h5>
          <ul className={list}>
            <li>
              캐시 함수 안에서 <code>searchParams</code>·<code>cookies()</code>·<code>headers()</code>를 읽으면 오류입니다. 이 데모처럼
              바깥에서 읽고 직렬화 가능한 값으로 넘깁니다.
            </li>
            <li><code>cacheLife</code>를 생략하면 default 프로파일(revalidate 15분)이 적용됩니다. 수명은 호출부에 명시하는 편이 명확합니다.</li>
            <li>기본 in-memory 캐시는 서버 인스턴스마다 따로 있습니다. 서버리스에서는 다른 인스턴스로 간 요청이 HIT이 되지 않을 수 있습니다.</li>
            <li>
              컴포넌트 JSX 출력 캐싱과 children 인터리빙은 <code>component-jsx-cache</code>, 레거시 <code>unstable_cache</code>의 키 구성은{' '}
              <code>functions/unstable-cache/db-query</code> 실습에서 다룹니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
