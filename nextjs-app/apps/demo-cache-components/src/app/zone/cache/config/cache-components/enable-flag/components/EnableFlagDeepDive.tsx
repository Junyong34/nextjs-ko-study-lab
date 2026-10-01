import { DemoDeepDiveCard } from '@study/demo-kit'

const H5 = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const UL = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

export function EnableFlagDeepDive() {
  return (
    <DemoDeepDiveCard title="cacheComponents: true — next@16.3.2 기준 동작과 규칙">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={H5}>1. 설정 위치와 이름</h5>
          <p>
            Next.js 16에서는 <code>next.config.ts</code> <strong>최상위</strong>에 <code>cacheComponents: true</code>를 둡니다.
            15 시절의 <code>experimental.dynamicIO</code>·<code>experimental.useCache</code>·<code>experimental.ppr</code>와
            세그먼트 설정 <code>experimental_ppr</code>는 이 옵션 하나로 합쳐지거나 제거됐습니다(버전 16 업그레이드 가이드).
            Cache Components는 Node.js 런타임에서만 동작이 보장되므로 <code>runtime = &apos;edge&apos;</code> 라우트는 옮겨야 합니다.
          </p>
        </div>

        <div>
          <h5 className={H5}>2. 이 데모에서 실측한 세 가지</h5>
          <ul className={UL}>
            <li>
              <strong>정적 셸 + 스트리밍(PPR이 기본 동작)</strong>: <code>probe</code> 라우트는 정적 마크업, <code>&apos;use cache&apos;</code> 결과,
              Suspense fallback을 먼저 보내고, <code>connection()</code> 뒤의 데이터는 같은 응답 뒤쪽 <code>&lt;div hidden id=&quot;S:0&quot;&gt;</code>
              세그먼트로 이어서 보냅니다.
            </li>
            <li>
              <strong><code>&apos;use cache&apos;</code> 사용 가능</strong>: 플래그가 켜져야 쓸 수 있는 지시어입니다. 캐시된 결과는 Suspense 없이 await해도
              셸에 포함되고, 다음 요청에서 같은 ID로 재사용됩니다.
            </li>
            <li>
              <strong>&lt;Activity&gt;로 라우트 보존</strong>: 떠난 라우트를 언마운트하지 않고 <code>display: none</code>으로 숨겨 state와 DOM을 유지합니다(최대 3개).
            </li>
          </ul>
        </div>

        <div>
          <h5 className={H5}>3. Suspense 밖 요청 시점 데이터 = 오류 (blocking 라우트가 존재하는 이유)</h5>
          <p>
            플래그가 켜지면 모든 라우트가 정적 셸을 만들 수 있는지 검증됩니다. <code>cookies()</code>·<code>headers()</code>·
            <code>connection()</code>·캐시하지 않은 <code>fetch</code>를 <code>&lt;Suspense&gt;</code> 밖에서 await하면, 이 zone의 dev 서버는
            실제로 다음 오류를 냈습니다(데모 작성 중 임시 라우트로 확인).
          </p>
          <pre className="mt-1.5 overflow-x-auto rounded bg-zinc-950 p-2.5 font-mono text-[10.5px] text-rose-300">
            {`Route "...": Next.js encountered uncached data during prerendering.
\`fetch(...)\` or \`connection()\` accessed outside of \`<Suspense>\` ...
  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\`
  - [cache] Cache the data access with "use cache" (does not apply to \`connection()\`)
  - [block] Set \`export const instant = false\` to allow a blocking route`}
          </pre>
          <p className="mt-1.5">
            <code>next build</code>에서는 같은 상황이 빌드 실패가 됩니다. <code>blocking</code> 라우트는 세 번째 해법(
            <code>export const instant = false</code>)으로 셸을 포기한 경우라, 데이터가 끝날 때까지 응답 헤더조차 오지 않습니다.
          </p>
        </div>

        <div>
          <h5 className={H5}>4. 플래그가 꺼져 있다면 (공식 문서 근거 설명 — 이 zone에서는 실측하지 않음)</h5>
          <ul className={UL}>
            <li><code>&apos;use cache&apos;</code>·<code>cacheLife</code>·<code>cacheTag</code> 조합과 <code>instant</code> 세그먼트 설정을 쓸 수 없습니다.</li>
            <li>라우트는 정적/동적 둘 중 하나로 통째로 결정되고, 위의 &quot;Suspense 밖 데이터&quot; 검증 오류도 생기지 않습니다.</li>
            <li>내비게이션 시 이전 페이지는 언마운트되어 페이지 state가 사라집니다(공유 layout에 둔 state만 유지).</li>
            <li>이 저장소의 <code>demo-baseline</code> zone이 플래그를 끈 앱입니다. 두 zone은 next.config가 달라 별도 앱으로 나뉘어 있습니다.</li>
          </ul>
        </div>

        <div>
          <h5 className={H5}>5. 실무 주의사항</h5>
          <ul className={UL}>
            <li>
              <strong>dev의 캐시 우회</strong>: dev 서버는 요청에 <code>Cache-Control: no-cache</code>가 있으면 <code>&apos;use cache&apos;</code>를
              다시 계산합니다(curl로 실측). 강력 새로고침이나 <code>fetch(..., {'{'} cache: &apos;no-store&apos; {'}'})</code>가 이 헤더를 붙이므로,
              이 데모의 측정 fetch는 기본 캐시 모드를 씁니다.
            </li>
            <li>
              <strong>dev와 프로덕션의 셸 차이</strong>: dev는 요청마다 셸을 렌더해 바로 보내고, 프로덕션은 빌드 때 만든 셸을 그대로 보냅니다.
              측정되는 헤더 도착 시각은 환경마다 다르지만 &quot;데이터보다 셸이 먼저&quot;라는 순서는 같습니다.
            </li>
            <li>
              <strong>Activity 보존은 양날의 검</strong>: 열린 드롭다운처럼 되돌려야 할 state는 <code>useLayoutEffect</code> cleanup으로 직접 초기화합니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
