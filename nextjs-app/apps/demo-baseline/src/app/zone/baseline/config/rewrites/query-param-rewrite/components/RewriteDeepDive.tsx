import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function RewriteDeepDive() {
  return (
    <DemoDeepDiveCard title="rewrites() 규칙과 라우트 확인 순서">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 이 데모의 실제 설정</h5>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">{`rewrites: [
  { source: '/…/old',
    has: [{ type: 'query', key: 'id', value: '(?<id>\\\\d+)' }],
    destination: '/…/products/:id?source=rewrite' },
  { source: '/…/legacy/:category/:sku',
    destination: '/…/lookup?category=:category&sku=:sku&source=rewrite' },
]`}</pre>
          <p className="mt-1">
            <code>src/config/demo-next-config/rewrites-query.ts</code>가 <code>next.config.ts</code>의 <code>rewrites()</code>에 합쳐집니다.
            <code>source</code>는 이 데모 경로 아래로만 한정해 다른 데모와 셸 라우팅에 영향을 주지 않습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. redirect와 무엇이 다른가</h5>
          <p>
            redirect는 3xx 응답과 <code>Location</code>으로 브라우저가 새 주소를 다시 요청합니다. rewrite는 서버가 같은 요청을 다른 목적지로 처리하고 200을 돌려주므로 주소창의 URL이 그대로입니다.
            검증 패널이 상태 200·<code>opaqueredirect</code> 아님·응답 URL 동일을 함께 보는 이유입니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. 어느 단계에서 실행되는가</h5>
          <p>
            이 데모는 배열 형태라 <code>afterFiles</code> 단계입니다. 라우트 확인 순서는 headers → redirects → proxy → <code>beforeFiles</code> → 파일 시스템 page → <code>afterFiles</code> → 동적 라우트 → <code>fallback</code>입니다.
            <code>afterFiles</code>는 일치하는 page가 있으면 그쪽이 먼저 응답하므로, <code>source</code>인 <code>/old</code>와 <code>/legacy/*</code>에는 page 파일을 두지 않았습니다.
            실제 page를 가로채야 한다면 <code>beforeFiles</code>를 써야 합니다. 이 실습은 설정 조각이 배열만 합치므로 <code>beforeFiles</code>·<code>fallback</code>은 실행해 보지 않았습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. has(query)와 캡처 그룹, 쿼리 전달</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li><code>value</code>의 정규식 이름 그룹 <code>(?&lt;id&gt;\d+)</code>이 <code>destination</code>의 <code>:id</code>가 됩니다. 숫자가 아니면 <code>has</code>가 맞지 않아 규칙이 건너뜁니다.</li>
            <li>목적지가 받은 <code>searchParams</code>에는 <code>destination</code>에 적은 <code>source=rewrite</code>뿐 아니라 요청의 원래 쿼리(<code>id</code>)도 남아 있었습니다(next@16.3.2 실측).</li>
            <li>설정 변경은 HMR로 반영되지 않습니다. <code>next dev</code>를 재시작해야 새 규칙이 적용됩니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>5. 이 실습으로 확인할 수 없는 것</h5>
          <p>
            브라우저 주소창을 직접 보지 않고 <code>fetch</code>의 응답 URL·상태·<code>redirect: &apos;manual&apos;</code> 결과로 대신 판정합니다. 셸(iframe) 경유 환경과 <code>next build</code>·배포 환경에서의 동작은 이 화면에서 검증하지 않았습니다.
          </p>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
