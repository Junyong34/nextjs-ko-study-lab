import { DemoDeepDiveCard } from '@study/demo-kit'

const h5 = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const list = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="Partial Prefetching이 해결하는 것 — 링크마다가 아니라 라우트마다 한 번">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h5}>1. 해결하려는 문제</h5>
          <p>
            기존 방식은 화면에 보이는 링크마다 prefetch가 나갑니다. 같은 <code>[id]</code> 라우트를 가리키는 링크가 N개면 요청도
            약 N개입니다. Partial Prefetching은 라우트마다 재사용 가능한 App Shell 하나를 가져오고, 같은 라우트의 링크들이 그것을
            공유합니다.
          </p>
        </div>
        <div>
          <h5 className={h5}>2. 이 데모에서 관찰한 것 (production, 배포 환경에서 2회 반복 확인)</h5>
          <ul className={list}>
            <li>
              <strong>partial 라우트의 기본 링크 3개 → 런타임 셸 요청(<code>Next-Router-Prefetch: 3</code>) 1건</strong>. 링크 3개가
              하나를 공유했습니다.
            </li>
            <li>
              <strong><code>prefetch={'{false}'}</code> 링크는 요청 0건</strong>, <code>&lt;Link prefetch&gt;</code> 링크는 요청이 나갔습니다.
            </li>
            <li>
              <strong>legacy 라우트는 URL별 세그먼트 요청</strong>(<code>__PAGE__</code>)이 나갔습니다. 다만 관찰 시점에 따라 1~3건으로
              달라서 건수는 판정하지 않았습니다.
            </li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>3. 설정 방법과 이 데모의 선택</h5>
          <pre className="w-0 min-w-full overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">
{`// partial/[id]/page.tsx — 도착지에 둔다 (링크가 아니라)
export const prefetch = 'partial'   // Server Component 세그먼트에서만 가능

// next.config.ts: partialPrefetching: true  → 앱 전체에 적용 (이 데모는 켜지 않음)`}
          </pre>
          <p className="mt-1.5">
            전역 <code>partialPrefetching</code>은 앱 전체의 prefetch 동작을 바꾸므로 같은 zone의 다른 데모에 영향을 줍니다. 그래서
            세그먼트 단위 <code>prefetch = &apos;partial&apos;</code>만 사용했습니다. 두 옵션 모두 <code>cacheComponents</code>가 필요합니다.
          </p>
        </div>
        <div>
          <h5 className={h5}>4. 확인하지 못한 것</h5>
          <ul className={list}>
            <li>
              <strong>기본 링크 1·2·3에도 PPR 런타임 요청(<code>Next-Router-Prefetch: 2</code>)이 URL마다 나갔습니다.</strong> 문서는 기본
              링크가 App Shell만 가져온다고 설명하는데, 이 데모에서는 그 요청이 추가로 관찰됐습니다. 이 도착지가 <code>params</code>를
              Suspense 안에서 읽는 구조 때문일 수 있지만 원인은 확인하지 못했습니다. &quot;요청이 링크 수만큼 늘지 않는다&quot;는 결론으로
              일반화하지 마세요.
            </li>
            <li>
              <strong>dev에서는 prefetch가 없습니다.</strong> 요청 0건이 정상이며, 이 데모의 판정도 dev에서는 그것을 기대값으로 씁니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
