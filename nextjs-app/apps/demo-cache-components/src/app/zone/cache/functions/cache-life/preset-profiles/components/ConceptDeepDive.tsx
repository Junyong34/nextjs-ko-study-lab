import { DemoDeepDiveCard } from '@study/demo-kit'
import { formatDuration, PRESET_SPECS } from '../types'

const CODE = `// cached.ts
export async function getSecondsSnapshot() {
  'use cache'
  cacheLife('seconds')   // stale 30초 · revalidate 1초 · expire 1분
  return { cacheId: random(), generatedAt: Date.now() }
}

export async function getHoursSnapshot() {
  'use cache'
  cacheLife('hours')     // stale 5분 · revalidate 1시간 · expire 1일
  return { cacheId: random(), generatedAt: Date.now() }
}`

export function ConceptDeepDive() {
  return (
    <DemoDeepDiveCard title="내장 프리셋의 세 가지 시간과 재계산 시점">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. stale · revalidate · expire</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li><strong>stale</strong>: 클라이언트 라우터가 서버 확인 없이 쓰는 시간입니다. 서버 캐시 재계산과는 관계가 없습니다.</li>
            <li><strong>revalidate</strong>: 이 시간이 지난 뒤 들어온 요청이 서버 재계산을 일으킵니다. 이 실습에서 관측하는 값입니다.</li>
            <li><strong>expire</strong>: 요청이 없어도 이 시간이 지나면 항목을 더 쓰지 않고, 다음 요청이 새 값을 기다립니다.</li>
          </ul>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 내장 프리셋 값 (next 16.3.2)</h5>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left font-mono text-[11px]">
              <thead className="text-zinc-500">
                <tr>
                  <th className="py-1 pr-3">프리셋</th>
                  <th className="py-1 pr-3">stale</th>
                  <th className="py-1 pr-3">revalidate</th>
                  <th className="py-1 pr-3">expire</th>
                  <th className="py-1 font-sans">용도</th>
                </tr>
              </thead>
              <tbody>
                {PRESET_SPECS.map((s) => (
                  <tr key={s.name} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="py-1 pr-3 font-semibold">{s.name}</td>
                    <td className="py-1 pr-3">{formatDuration(s.stale)}</td>
                    <td className="py-1 pr-3">{formatDuration(s.revalidate)}</td>
                    <td className="py-1 pr-3">{formatDuration(s.expire)}</td>
                    <td className="py-1 font-sans">{s.useCase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            출처: <code>next/dist/server/config-shared.js</code> <code>defaultConfig.cacheLife</code>, 로컬 문서 <code>cacheLife.md</code>의 Preset cache profiles 표.
            이 밖에 <code>default</code>(revalidate 15분, expire 없음), <code>days</code>(1일/1주), <code>weeks</code>(1주/30일)가 있습니다.
          </p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-900 p-3 font-mono text-[11px] text-zinc-100">{CODE}</pre>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. dev와 prod에서 재계산이 보이는 방식이 다르다</h5>
          <p>
            공식 문서는 revalidate가 지나면 “캐시된 값을 먼저 주고 백그라운드에서 다시 만든다”고 설명합니다. 그러나 기본 in-memory 캐시
            핸들러(<code>next/dist/server/lib/cache-handlers/default.js</code>)는 모드에 따라 다르게 동작합니다.
          </p>
          <ul className="mt-1 list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>next start</strong>: revalidate가 지난 항목을 없는 것으로 취급합니다. 그 요청에서 바로 본문을 다시 실행하므로 seconds 행의 경과가
              항상 1초 미만으로 보입니다.
            </li>
            <li>
              <strong>next dev</strong>: 캐시된 항목을 먼저 응답합니다. expire가 5분 미만인 seconds 항목은 요청마다 백그라운드에서 다시 만들어 두므로, 매
              요청에 직전 요청 때 만든 cacheId가 보이고 경과는 요청 간격과 비슷합니다 (<code>use-cache-wrapper.js</code>의 dev 재생성 분기).
            </li>
            <li>Redis 같은 원격 캐시 핸들러를 쓰면 prod에서도 stale-while-revalidate 동작이 달라질 수 있습니다.</li>
          </ul>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 주의사항</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              내장 프리셋 중 <code>seconds</code>만 expire가 5분 미만이라 빌드 프리렌더에서 빠지고 요청 시점에 채워지는 구멍(dynamic hole)이 됩니다. 이 실습은
              모든 프리셋을 같은 조건에서 비교하려고 <code>connection()</code>과 <code>&lt;Suspense&gt;</code> 안에서 호출합니다.
            </li>
            <li>cacheLife는 각 &apos;use cache&apos; 스코프 안에서 한 번만 직접 호출합니다. 공통 유틸로 감싸지 않는 것이 공식 권장입니다.</li>
            <li>in-memory 캐시는 서버 프로세스마다 따로 있습니다. 서버를 재시작하거나 dev에서 파일을 고치면 hours·max 항목도 새로 만들어집니다.</li>
            <li>
              프리셋 값 재정의나 새 프로필 이름 정의는 <code>next.config.ts</code>의 <code>cacheLife</code>로 합니다. 형제 실습 <code>custom-profile</code>에서 다룹니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
