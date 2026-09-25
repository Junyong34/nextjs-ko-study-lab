import { DemoDeepDiveCard } from '@study/demo-kit'
import { BINDING_SPECS, CUSTOM_PROFILE_NAME, formatDuration } from '../types'

const CONFIG_CODE = `// next.config.ts (이 앱이 실제로 쓰는 설정)
const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    '${CUSTOM_PROFILE_NAME}': {
      stale: 30,
      revalidate: 4,
      expire: 20,
    },
  },
}`

const CALL_CODE = `// cached.ts
export async function getBreakingNewsCustom() {
  'use cache'
  cacheLife('${CUSTOM_PROFILE_NAME}')  // next.config.ts에 정의한 이름 그대로 호출
  return { cacheId: random(), generatedAt: Date.now() }
}

export async function getBreakingNewsDefault() {
  'use cache'
  // cacheLife() 호출 없음 → 내장 default 프로필이 암묵적으로 적용됨
  return { cacheId: random(), generatedAt: Date.now() }
}`

export function ConceptDeepDive() {
  return (
    <DemoDeepDiveCard title="next.config.ts 커스텀 cacheLife 프로필과 cacheLife() 바인딩">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 프로필은 이름만 있는 설정, cacheLife()는 그 이름을 부르는 호출</h5>
          <p>
            <code>next.config.ts</code>의 <code>cacheLife</code> 객체는 키가 프로필 <strong>이름</strong>, 값이 <code>{'{ stale, revalidate, expire }'}</code>인
            일반 설정 객체다. 이 자체로는 아무 캐시에도 적용되지 않는다. 실제로 특정 <code>&apos;use cache&apos;</code> 함수의 수명을 그 프로필로
            바꾸는 것은 함수 본문 안에서 <code>cacheLife(&apos;이름&apos;)</code>을 호출하는 순간이다. 이름이 한 글자라도 다르면 바인딩되지 않고
            &quot;Unknown cacheLife() profile&quot; 빌드 에러가 난다 (출처: <code>next/dist/server/use-cache/cache-life.js</code>).
          </p>
        </div>

        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 이 데모의 실제 설정과 호출부</h5>
          <pre className="overflow-x-auto rounded-md bg-zinc-900 p-3 font-mono text-[11px] text-zinc-100">{CONFIG_CODE}</pre>
          <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-900 p-3 font-mono text-[11px] text-zinc-100">{CALL_CODE}</pre>
        </div>

        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. custom vs default 비교값</h5>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left font-mono text-[11px]">
              <thead className="text-zinc-500">
                <tr>
                  <th className="py-1 pr-3">바인딩</th>
                  <th className="py-1 pr-3">stale</th>
                  <th className="py-1 pr-3">revalidate</th>
                  <th className="py-1 pr-3">expire</th>
                  <th className="py-1 font-sans">출처</th>
                </tr>
              </thead>
              <tbody>
                {BINDING_SPECS.map((s) => (
                  <tr key={s.mode} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="py-1 pr-3 font-semibold">{s.mode}</td>
                    <td className="py-1 pr-3">{formatDuration(s.stale)}</td>
                    <td className="py-1 pr-3">{formatDuration(s.revalidate)}</td>
                    <td className="py-1 pr-3">{formatDuration(s.expire)}</td>
                    <td className="py-1 font-sans">{s.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. experimental.cacheLife가 아니라 top-level cacheLife를 쓴 이유</h5>
          <p>
            공식 문서와 이 앱이 이미 쓰는 <code>cacheComponents</code>처럼, <code>cacheLife</code>도 next 16.3.2에서는 <strong>top-level</strong>{' '}
            옵션이다. <code>experimental.cacheLife</code>는 폐기(deprecated)되어 있어, 그 자리에 값을 두면 next가
            &quot;<code>experimental.cacheLife</code> has been moved to <code>cacheLife</code>&quot; 경고를 내며 자동으로
            top-level로 옮겨 적용한다 (출처: <code>next/dist/server/config.js</code>의{' '}
            <code>warnOptionHasBeenMovedOutOfExperimental(result, &apos;cacheLife&apos;, &apos;cacheLife&apos;, ...)</code> 호출). 이 데모는 경고 없이
            깨끗하게 동작하는 실제 경로를 그대로 실증하기 위해 처음부터 top-level <code>cacheLife</code>로 정의했다.
          </p>
        </div>

        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">5. 프로필 이름에 데모 접두사를 붙이는 이유</h5>
          <p>
            <code>cacheLife</code> 객체는 <code>next.config.ts</code> 하나를 공유하는 앱 전체 설정이다. 이 zone에는 이미 내장 프리셋만
            쓰는 형제 실습 <code>preset-profiles</code>가 있고, 앞으로 다른 실습이 자기만의 커스텀 이름을 추가할 수도 있다. 이름이 짧으면
            (예: <code>&apos;breaking-news&apos;</code>) 다른 실습이 같은 이름으로 다른 값을 정의해 서로 덮어쓸 위험이 있다. 그래서 이
            실습의 프로필 이름은 경로를 그대로 반영한 <code>{CUSTOM_PROFILE_NAME}</code>로 지었다.
          </p>
        </div>

        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">6. 주의사항</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>expire(20초)는 revalidate(4초)보다 반드시 커야 한다. 그렇지 않으면 next dev/build가 즉시 에러를 낸다.</li>
            <li>
              커스텀 프로필의 특정 속성(stale/revalidate/expire 중 일부)을 생략하면 그 속성만 default 프로필 값을 상속한다. 이 데모는 세
              값을 모두 명시해 상속에 의존하지 않는다.
            </li>
            <li>in-memory 캐시는 서버 프로세스마다 따로 있다. 서버를 재시작하거나 dev에서 파일을 고치면 default 행도 새로 만들어진다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
