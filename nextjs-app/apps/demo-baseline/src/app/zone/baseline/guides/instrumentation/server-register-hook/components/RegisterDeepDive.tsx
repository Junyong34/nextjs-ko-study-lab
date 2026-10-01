import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function RegisterDeepDive() {
  return (
    <DemoDeepDiveCard title="register()는 언제, 몇 번, 어느 런타임에서 실행되는가">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 서버 인스턴스당 1회, 요청 처리 전에 끝난다</h5>
          <p>
            Next.js는 새 서버 인스턴스를 시작할 때 <code>register()</code>를 한 번 호출하고, 그 Promise가 끝난 뒤에야 요청을 받습니다.
            이 저장소의 <code>src/instrumentation.ts</code>는 그때 부팅 시각·pid·호출 횟수를 <code>globalThis.__serverBootLogSnapshot</code>에 기록합니다.
            이 데모의 Route Handler는 그 값을 읽기만 하므로, 요청을 몇 번 보내도 값이 바뀌지 않습니다. 같은 모듈 안의 <code>handlerRequestCount</code>는 요청마다 늘어나 대조군이 됩니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 무거운 초기화를 여기에 두는 이유</h5>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">{`export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation-node') // DB 풀, APM/OTel SDK 등
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./instrumentation-edge')
  }
}`}</pre>
          <p className="mt-1">
            요청 핸들러 안에서 SDK를 초기화하면 요청마다 다시 만들어집니다. <code>register()</code>는 런타임별로 한 번이라 연결 풀이나 모니터링 SDK를 둘 자리입니다.
            Edge에서 쓸 수 없는 Node.js 전용 코드는 위처럼 <code>NEXT_RUNTIME</code>으로 나눠 동적 import합니다(공식 가이드의 패턴, 이 저장소 파일은 분기 안에서 로그와 스냅샷만 기록합니다).
          </p>
        </div>
        <div>
          <h5 className={h}>3. Node.js와 Edge는 각자 register()를 가진다</h5>
          <p>
            <code>export const runtime = &apos;edge&apos;</code>로 선언한 Route Handler는 Node.js 프로세스와 분리된 isolate에서 실행되고, 그 isolate가 처음 만들어질 때 <code>register()</code>가 따로 호출됩니다.
            그래서 Edge 스냅샷은 부팅 시각이 Node.js와 다르고(첫 Edge 요청 시점), <code>process.pid</code>가 없어 -1이 기록됩니다. 두 런타임은 <code>globalThis</code>를 공유하지 않습니다.
            next@16.3.2 dev 서버는 Edge 핸들러를 처음 컴파일할 때 &quot;The Edge Runtime is deprecated&quot; 경고를 출력합니다. 새 코드는 Node.js 런타임이 기본 선택입니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. onRequestError</h5>
          <p>
            서버 렌더링·Route Handler·Server Action·proxy(routeType <code>middleware</code>)에서 처리되지 않은 오류가 나면 Next.js가 <code>onRequestError(err, request, context)</code>를 호출합니다. 이 실습의 POST <code>api/fail</code>은 <code>context.routeType</code>이 <code>route</code>로 기록됩니다.
            오류가 나도 서버 인스턴스는 그대로라 <code>register()</code>는 다시 호출되지 않습니다. 이 파일의 <code>onRequestError</code>는 <code>console.error</code>만 남기므로, 화면에 보여 주려고 <code>api/fail</code> 모듈이 <code>console.error</code>를 감싸 해당 접두사 로그만 따로 모읍니다(원래 출력은 그대로 통과).
          </p>
        </div>
        <div>
          <h5 className={h}>5. dev 서버 실측과 이 실습의 한계</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>소유 경로의 파일을 수정해 다시 로드시킨 뒤 요청했을 때(next@16.3.2 dev, 로컬 실측): Node.js 핸들러 모듈은 다시 평가돼 대조 카운터가 1로 돌아갔지만 Node.js의 <code>bootedAt</code>·<code>registerCallCount</code>는 그대로였습니다. Edge는 isolate가 새로 만들어져 <code>register()</code>가 그 안에서 다시 실행됐고 부팅 시각이 바뀌었습니다.</li>
            <li>이 화면에서는 파일을 수정할 수 없으므로 위 Fast Refresh 관찰은 화면 조작으로 재현되지 않습니다. 표의 &quot;핸들러 모듈 로드&quot; 열이 바뀌었는데 bootedAt이 그대로라면 같은 현상입니다.</li>
            <li><code>src/instrumentation.ts</code> 자체를 수정하거나 서버를 재시작하면 새 인스턴스가 되어 값이 모두 바뀝니다. 서버리스 배포(Vercel)에서는 인스턴스가 여러 개이거나 콜드 스타트마다 새로 만들어질 수 있어, 요청마다 다른 pid·부팅 시각이 보일 수 있습니다. 배포 환경은 이 화면에서 검증하지 않았습니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
