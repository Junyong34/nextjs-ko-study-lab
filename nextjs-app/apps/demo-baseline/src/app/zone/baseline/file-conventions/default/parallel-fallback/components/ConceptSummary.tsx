import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function ConceptSummary() {
  return (
    <DemoDeepDiveCard title="default.tsx: 슬롯의 활성 상태를 복구하지 못할 때의 폴백">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 이번 실습에서 본 것</h5>
          <p>
            <code>@promo</code>에는 <code>shoes</code> 페이지가 없다. <code>Link</code>로 <code>/shoes</code>에 가면 배너가 그대로 남았다(소프트 내비게이션은 슬롯별 활성 상태를 기억한다).
            같은 URL을 문서로 새로 받으면 그 기억이 없으므로 <code>@promo/default.tsx</code>가 그 자리를 채웠다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 파일 구조</h5>
          <pre className="overflow-x-auto rounded bg-zinc-100 p-2 dark:bg-zinc-900">{`parallel-fallback/
├─ layout.tsx          # children, cart, promo 세 슬롯을 props로 받는다
├─ page.tsx, default.tsx
├─ shoes/page.tsx      # children
├─ @cart/  page.tsx, shoes/page.tsx, default.tsx
├─ @promo/ page.tsx, default.tsx
└─ strict/@side/  page.tsx, default.tsx (notFound)`}</pre>
        </div>
        <div>
          <h5 className={h}>3. default.tsx가 없으면</h5>
          <p>
            Next.js 16.3.2 문서 기준으로 이름 있는 슬롯(<code>@team</code> 등)에 <code>default.js</code>가 없으면 하드 로드 때 오류가 나고 빌드에서도 정의를 요구한다.
            예전처럼 404를 원하면 <code>default.tsx</code>에서 <code>notFound()</code>를 호출한다. <code>/strict/detail</code> 프로브가 그 경우다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. 주의점</h5>
          <ul className="list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
            <li><code>children</code>도 암시적 슬롯이라 부모 페이지 상태를 복구하지 못하는 경우를 위해 <code>default.tsx</code>가 필요하다.</li>
            <li>모달 슬롯은 <code>@modal/default.tsx</code>에서 <code>null</code>을 반환해 닫힌 상태를 표현하는 것이 관례다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
