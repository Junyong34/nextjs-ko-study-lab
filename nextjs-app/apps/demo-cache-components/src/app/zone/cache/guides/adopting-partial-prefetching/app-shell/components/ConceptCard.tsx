import { DemoDeepDiveCard } from '@study/demo-kit'

const h5 = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const list = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'
const th = 'border border-zinc-200 px-2 py-1 text-left dark:border-zinc-800'
const td = 'border border-zinc-200 px-2 py-1 align-top dark:border-zinc-800'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="Partial Prefetching — 링크마다가 아니라 라우트마다 App Shell 하나">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h5}>1. 페이지 안의 내용은 &quot;무엇에 따라 달라지는가&quot;로 나뉩니다</h5>
          <div className="w-0 min-w-full overflow-x-auto">
            <table className="w-full min-w-[460px] border-collapse text-[11px]">
              <thead>
                <tr><th className={th}>영역</th><th className={th}>달라지는 기준</th><th className={th}>App Shell에 들어가나 (문서 기준)</th></tr>
              </thead>
              <tbody>
                <tr><td className={td}>A 고정 문구</td><td className={td}>없음</td><td className={td}>들어감</td></tr>
                <tr><td className={td}>B 캐시(<code>hours</code>)</td><td className={td}>없음 (<code>stale</code> ≥ 5분)</td><td className={td}>들어감</td></tr>
                <tr><td className={td}>B2 캐시(<code>stale</code> 60초)</td><td className={td}>없음</td><td className={td}>문서는 &quot;제외&quot;. <strong>이 측정에서는 확인되지 않음</strong></td></tr>
                <tr><td className={td}>C URL별(<code>params</code>)</td><td className={td}>링크마다</td><td className={td}>못 들어감 (URL 데이터는 링크마다 다르다)</td></tr>
                <tr><td className={td}>D 실시간</td><td className={td}>요청마다</td><td className={td}>못 들어감</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h5 className={h5}>2. 이 데모에서 측정한 것 (왕복 300ms를 건 production, 클릭 기준)</h5>
          <ul className={list}>
            <li>
              <strong>셸을 prefetch한 라우트: A·B가 약 5~17ms</strong>에 보였습니다. 클릭하기 전에 이미 가져와 둔 것을 그리기 때문입니다.
            </li>
            <li>
              <strong>어떤 링크도 prefetch하지 않은 <code>cold</code> 라우트: A·B가 약 330~350ms</strong>에 보였습니다. 왕복 시간만큼 기다린 것입니다.
            </li>
            <li>
              <strong>C·D는 어느 경우든 약 970ms</strong>에 보였습니다. 서버가 800ms 지연 뒤에 만들기 때문이며, prefetch로 앞당겨지지 않습니다.
            </li>
            <li>
              <strong><code>prefetch={'{false}'}</code> 링크(상품 5)도 즉시 보였습니다.</strong> 같은 라우트로 가는 다른 링크(상품 1~3)가 셸을 이미 가져왔고 셸은
              라우트당 하나라 공유했기 때문입니다. 이것이 &quot;링크마다가 아니라 라우트마다&quot;의 의미입니다.
            </li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>3. 정적 셸과 App Shell은 다릅니다</h5>
          <ul className={list}>
            <li><strong>정적 셸</strong>: 빌드 때 만들어 <em>첫 접속</em>에서 먼저 보내는 HTML.</li>
            <li><strong>App Shell</strong>: 라우트별로 URL 데이터에 의존하지 않는 부분을 묶은 것. <em>링크 prefetch</em>에 쓰이고 클라이언트에 캐시됩니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>4. 설정 방법과 이 데모의 선택</h5>
          <pre className="w-0 min-w-full overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">
{`// 도착지 세그먼트에 둔다 (링크가 아니라). Server Component에서만 가능
export const prefetch = 'partial'

// next.config.ts: partialPrefetching: true → 앱 전체에 적용 (이 데모는 켜지 않음)`}
          </pre>
          <p className="mt-1.5">
            전역 설정은 같은 zone의 다른 데모에 영향을 주므로 세그먼트 단위 <code>prefetch = &apos;partial&apos;</code>만 썼습니다. 두 방식 모두{' '}
            <code>cacheComponents</code>가 필요합니다.
          </p>
        </div>
        <div>
          <h5 className={h5}>5. 확인하지 못한 것</h5>
          <ul className={list}>
            <li>
              <strong>B2가 App Shell에서 제외되는지.</strong> 문서(<code>cacheLife</code>)는 <code>stale</code> 30초~5분 캐시를 셸에서 제외한다고 하지만, 이 측정에서는
              B2가 B와 같은 시점에 도착했습니다. 이 방식(마운트 시각)으로는 셸에 실려 왔는지 클릭 직후 응답으로 왔는지 구분되지 않아, 문서와 다르다고 결론짓지는
              않습니다.
            </li>
            <li>
              <strong>세션 데이터(<code>cookies()</code>)가 App Shell에 들어가는지.</strong> 문서는 세션별로 들어간다고 하지만 이 데모에서는 측정하지 않았습니다.
            </li>
            <li>
              <strong>기본 링크에도 URL별 PPR 런타임 요청(<code>Next-Router-Prefetch: 2</code>)이 나가는 이유.</strong> 문서는 기본 링크가 셸만 가져온다고 하지만
              관찰은 달랐고 원인을 확인하지 못했습니다. 이 때문에 &quot;prefetch는 셸만 가져온다&quot;로 일반화하지 마세요.
            </li>
            <li>
              <strong>네트워크가 빠른 환경(로컬 등)에서는 prefetch 유무의 시간 차이가 보이지 않습니다.</strong> 이때는 그 비교를 생략합니다. dev에서는 prefetch 자체가 없습니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
