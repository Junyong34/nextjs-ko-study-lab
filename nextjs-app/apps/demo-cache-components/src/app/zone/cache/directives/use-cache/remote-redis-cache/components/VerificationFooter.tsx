'use client'

import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { Observation } from '../types'
import { useObservations } from './ObservationContext'

function evaluate(obs: Observation[]) {
  const last = obs.at(-1)
  const pairs = obs.flatMap((a, i) => obs.slice(i + 1).map((b) => [a, b] as const))
  const remoteHit = pairs.find(([a, b]) => a.argsKey === b.argsKey && a.remoteStats.cacheId === b.remoteStats.cacheId)
  const remoteNewEntry = pairs.find(([a, b]) => a.argsKey !== b.argsKey && a.remoteStats.cacheId !== b.remoteStats.cacheId)
  const crossDirectiveCollision = obs.find((o) => o.defaultStats.cacheId === o.remoteStats.cacheId)
  const handlerCheckFailed = obs.find((o) => o.handlerProbe.initialized && o.handlerProbe.sameInstance !== true)

  return { last, remoteHit, remoteNewEntry, crossDirectiveCollision, handlerCheckFailed }
}

/**
 * 3단 검증. isMatched는 항상 이 컴포넌트 안에서 계산한 boolean 리터럴이고,
 * expected/actual은 항상 JSX로 감싸 문자열 자동 비교(ExpectedActualPanel의 auto-match) 경로를
 * 타지 않게 한다 (isMatched={undefined} + 문자열 조합 버그 우회).
 */
export function VerificationFooter() {
  const { observations: obs, nestingResult } = useObservations()
  const { last, remoteHit, remoteNewEntry, crossDirectiveCollision, handlerCheckFailed } = evaluate(obs)

  const cacheKeyMatched = crossDirectiveCollision
    ? false
    : remoteHit && remoteNewEntry
    ? true
    : undefined

  const handlerMatched = handlerCheckFailed ? false : last?.handlerProbe.initialized ? true : undefined

  const nestingMatched = nestingResult ? !nestingResult.ok && nestingResult.name === 'Error' : undefined

  const cacheKeyExpected = (
    <span>
      {"• 같은 인자로 다시 요청: 'use cache: remote' 결과의 cacheId가 그대로 (본문 미실행 = HIT)\n"}
      {'• 다른 인자로 요청: 새 cacheId (새 캐시 항목)\n'}
      {"• 같은 인자라도 use cache와 use cache: remote는 서로 다른 cacheId (캐시 키에 함수 ID 포함)"}
    </span>
  )
  const cacheKeyActual = (
    <span>
      {obs.length === 0 && '• 관측 대기 중 (위 카드가 최소 1회 렌더된 뒤 기록됩니다)\n'}
      {remoteHit
        ? `• remote HIT 확인: ${remoteHit[0].argsKey} 요청 #${remoteHit[0].seq}·#${remoteHit[1].seq} 모두 cacheId #${remoteHit[0].remoteStats.cacheId}\n`
        : '• remote HIT: 아직 같은 인자로 두 번 요청하지 않았습니다\n'}
      {remoteNewEntry
        ? `• 새 캐시 항목 확인: ${remoteNewEntry[0].argsKey} #${remoteNewEntry[0].remoteStats.cacheId} → ${remoteNewEntry[1].argsKey} #${remoteNewEntry[1].remoteStats.cacheId}\n`
        : '• 새 캐시 항목: 아직 다른 인자로 요청하지 않았습니다\n'}
      {crossDirectiveCollision
        ? `• 불일치: default와 remote가 같은 cacheId #${crossDirectiveCollision.defaultStats.cacheId}를 공유함\n`
        : last && `• 지시어별 분리 확인: default #${last.defaultStats.cacheId} ≠ remote #${last.remoteStats.cacheId}`}
    </span>
  )

  const handlerExpected = (
    <span>
      {"• cacheHandlers를 설정하지 않은 이 앱은 'remote' 키가 'default'와 같은 내장 핸들러 인스턴스를 씀\n"}
      {'(node_modules/next/dist/server/use-cache/handlers.js: initializeCacheHandlers)'}
    </span>
  )
  const handlerActual = (
    <span>
      {!last && '• 관측 대기 중\n'}
      {last?.handlerProbe.initialized
        ? `• Object.is(default, remote) = ${String(last.handlerProbe.sameInstance)} (${last.handlerProbe.defaultHandlerId} / ${last.handlerProbe.remoteHandlerId})`
        : last && '• 내부 레지스트리를 찾지 못함 (버전 차이 가능성)'}
    </span>
  )

  const nestingExpected = (
    <span>
      {"• 'use cache: remote' 안에서 'use cache: private' 호출 → 문서상 금지 조합, 에러 발생 기대"}
    </span>
  )
  const nestingActual = (
    <span>
      {!nestingResult && '• 아직 실행하지 않음 (위 [실제로 실행해 에러 관측] 버튼을 눌러주세요)'}
      {nestingResult && !nestingResult.ok && `• 에러 발생 확인: ${nestingResult.name} — ${nestingResult.message}`}
      {nestingResult?.ok && '• 예상과 달리 에러 없이 완료됨'}
    </span>
  )

  return (
    <div className="space-y-3">
      <ExpectedActualPanel
        title="지시어별 캐시 키 분리 검증"
        description="같은 인자를 use cache와 use cache: remote에 각각 넘겨, 두 지시어가 독립된 캐시 항목을 만드는지 확인합니다."
        expected={cacheKeyExpected}
        actual={cacheKeyActual}
        isMatched={cacheKeyMatched}
      />
      <ExpectedActualPanel
        title="캐시 핸들러 인스턴스 실측 (cacheHandlers 미설정 시)"
        description="globalThis에 등록된 Next.js 내부 레지스트리를 읽어 'default'와 'remote'가 같은 저장소 객체인지 확인합니다."
        expected={handlerExpected}
        actual={handlerActual}
        isMatched={handlerMatched}
      />
      <ExpectedActualPanel
        title="private ⇄ remote 중첩 금지 규칙 검증"
        description="문서가 금지한 조합을 실제로 호출해 Next.js가 던지는 에러를 관측합니다."
        expected={nestingExpected}
        actual={nestingActual}
        isMatched={nestingMatched}
      />

      <DemoDeepDiveCard title="'use cache: remote'가 실제로 다른 지점과, 로컬에서는 확인할 수 없는 지점">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 공식 문서가 말하는 차이</h5>
            <p>
              <code>'use cache: remote'</code>는 <code>cacheComponents: true</code>만 있으면 문법적으로 즉시 쓸 수 있는, v16.0.0부터 정식 활성화된 안정 지시어다.
              문서(<code>use-cache-remote.md</code>)의 핵심 주장은 "인메모리 대신 원격 캐시 핸들러에 저장되어 모든 서버 인스턴스가 공유하는 지속성 높은 캐시 레이어를 제공한다"는 것이다.
              이 저장 위치는 <code>next.config.ts</code>의 <code>cacheHandlers.remote</code>에 등록하는 별도 모듈(<code>get/set/refreshTags/getExpiration/updateTags</code> 5개 메서드를 구현하는 CacheHandler)이 결정한다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 이 데모가 실제로 실측한 것</h5>
            <p>
              이 앱의 <code>next.config.ts</code>는 <code>cacheHandlers</code>를 등록하지 않는다(다른 형제 데모의 설정과 공유하는 파일이라 이 작업 범위에서 건드리지 않았다).
              공식 문서(<code>cacheHandlers.md</code>): <em>&quot;If you don&apos;t configure cacheHandlers, Next.js uses an in-memory LRU cache for both default and remote.&quot;</em>
              위 카드는 이 문장을 실제 실행 중인 Next.js 프로세스의 내부 레지스트리(<code>globalThis[Symbol.for(&apos;@next/cache-handlers-map&apos;)]</code>)를 직접 읽어 실측으로 확인한다 —
              <code>'default'</code>와 <code>'remote'</code> 키가 <code>Object.is</code>로 같은 객체를 가리킨다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 왜 가짜 Redis를 만들지 않았는가</h5>
            <p>
              &quot;여러 서버 인스턴스·콜드 스타트·배포 간 지속성&quot;처럼 remote가 진짜 가치를 내는 지점은 실제 원격 저장소(Redis 등)와 다중 프로세스 없이는 관측할 방법이 없다.
              <code>useState</code>로 &quot;Seoul/Tokyo 인스턴스&quot;를 흉내 내는 것은 Next.js의 실제 동작이 아니라 UI 애니메이션일 뿐이라 이 저장소의 No-Simulation 원칙에 위배된다.
              그래서 이 데모는 로컬 단일 프로세스에서 실제로 검증 가능한 세 가지 — 지시어별 캐시 키 분리, cacheHandlers 미설정 시 저장소 공유, 중첩 금지 규칙의 실제 에러 — 만 진짜 코드로 보여준다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. cacheHandlers.remote를 등록하면 무엇이 달라지는가</h5>
            <p>
              <code>next.config.ts</code>에 <code>cacheHandlers: {'{'} remote: require.resolve(&apos;./cache-handlers/remote-handler.js&apos;) {'}'}</code>를 추가하고
              <code>get/set/refreshTags/getExpiration/updateTags</code>를 구현한 모듈을 연결하면, 위 실측 카드의 <code>Object.is(default, remote)</code>가 <code>false</code>로 바뀐다.
              이 저장소에서는 새 npm 의존성 추가 금지 원칙 때문에(ioredis 등) 그 핸들러를 실제로 구현하지 않았다 — 공식 예제 코드 자체가 <code>redis</code> 패키지를 요구한다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
