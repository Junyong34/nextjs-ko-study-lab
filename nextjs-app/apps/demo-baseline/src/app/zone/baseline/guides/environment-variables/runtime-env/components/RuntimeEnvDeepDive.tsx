import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function RuntimeEnvDeepDive() {
  return (
    <DemoDeepDiveCard title="process.env 런타임 환경변수 동적 참조">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 방금 관찰한 것</h5>
          <p>
            Route Handler(<code>api/status</code>)는 호출될 때마다 실행되어 <code>process.env[name]</code>을 새로 읽었고, 요청 번호가 올라가는 동안 <code>pid</code>는 그대로였습니다.
            <code>page.tsx</code>는 <code>await connection()</code> 뒤에서 같은 변수를 읽었고, <code>router.refresh()</code>를 누를 때마다 서버에서 다시 실행되어 새 시각이 도착했습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 서버는 요청 시점에, 브라우저는 빌드 시점에</h5>
          <p>
            서버 환경변수는 동적 렌더링 중에 <code>process.env</code>로 읽으면 <strong>실행 시점 값</strong>입니다. 그래서 하나의 이미지를 환경별 값으로 승격 배포할 수 있습니다.
            반대로 <code>NEXT_PUBLIC_</code> 변수는 <code>next build</code> 때 번들에 값으로 <strong>인라인</strong>됩니다. 브라우저의 리터럴 참조가 값을 가졌던 이유이며, <code>process.env[name]</code> 같은 동적 조회는 치환되지 않아 값을 못 찾습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. 흔한 오용</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>요청 시점 API(<code>cookies</code>, <code>headers</code>, <code>connection()</code> 등)가 없는 서버 컴포넌트는 <code>next build</code>에서 프리렌더링되어, 그 시점의 환경변수 값이 결과에 고정될 수 있습니다.</li>
            <li>런타임에 바꿔야 하는 값을 <code>NEXT_PUBLIC_</code>으로 노출하면 빌드 후에는 바꿀 수 없습니다.</li>
            <li>서버 전용 변수를 클라이언트 컴포넌트에서 읽으려 하면 값이 없습니다 (이 실습의 INTERNAL_ADMIN_EMAIL).</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>4. 이 실습으로 확인할 수 없는 것</h5>
          <p>
            <code>next dev</code>에서는 모든 페이지가 요청마다 렌더링되므로, &quot;빌드 때 값이 고정된다&quot;는 쪽은 여기서 관찰되지 않습니다.
            그 차이는 <code>connection()</code>을 뺀 페이지를 <code>next build</code> 후 <code>next start</code>로 띄워 환경변수를 바꿔 실행해야 보입니다.
          </p>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
