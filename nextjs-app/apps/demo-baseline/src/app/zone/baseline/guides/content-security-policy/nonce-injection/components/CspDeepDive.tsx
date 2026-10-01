import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const ul = 'list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400'

export function CspDeepDive() {
  return (
    <DemoDeepDiveCard title="Proxy nonce 기반 CSP와 동적 렌더링">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 방금 관찰한 흐름</h5>
          <p>
            <code>proxy.ts</code>가 요청마다 <code>crypto.randomUUID()</code>로 nonce를 만들어 <strong>응답 헤더</strong>{' '}
            <code>Content-Security-Policy</code>와 <strong>요청 헤더</strong> <code>x-nonce</code>·<code>Content-Security-Policy</code>에 넣었습니다.
            서버 컴포넌트는 <code>(await headers()).get(&apos;x-nonce&apos;)</code>로 값을 읽어 <code>&lt;script nonce&gt;</code>와{' '}
            <code>&lt;Script nonce&gt;</code>에 적용했고, 브라우저는 헤더의 nonce와 같은 스크립트만 실행했습니다.
            Next.js는 요청 CSP 헤더에서 <code>&apos;nonce-…&apos;</code>를 추출해 프레임워크 스크립트와 페이지 번들에도 같은 값을 붙입니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 왜 이 페이지는 동적 렌더링인가</h5>
          <p>
            nonce는 요청마다 달라야 하므로 HTML에 한 번 구워 두고 CDN에서 재사용할 수 없습니다. <code>headers()</code>는 요청 시점 API라서
            이 페이지를 정적 프리렌더링에서 제외하고, 요청마다 서버에서 다시 렌더링하게 만듭니다. 정적 최적화·ISR·CDN 캐시를 포기하는 대신 nonce를 얻는 거래입니다.
            정적 페이지가 필요하면 nonce 대신 SRI(<code>experimental.sri</code>) 기반 CSP를 검토해야 합니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. 파일 구조</h5>
          <pre className="overflow-x-auto rounded bg-zinc-100 p-2 font-mono text-[11px] dark:bg-zinc-900">{`proxy.ts            → nonce 생성, CSP/x-nonce 헤더 (이 데모 경로에만)
page.tsx            → await headers() → x-nonce → CspScripts
CspScripts.tsx      → <script nonce>, <Script nonce>
CspLab.tsx (client) → fetch로 헤더·HTML 대조, 주입 시도`}</pre>
        </div>
        <div>
          <h5 className={h}>4. 주의사항</h5>
          <ul className={ul}>
            <li>
              <code>strict-dynamic</code>은 nonce가 붙은 스크립트가 <em>동적으로 만든</em> 스크립트를 신뢰합니다. 그래서 이 데모는 파서가 삽입한 인라인 스크립트와
              인라인 이벤트 핸들러로 차단을 보였습니다. 신뢰된 스크립트가 만든 <code>createElement(&apos;script&apos;)</code>는 nonce 없이도 실행됩니다.
            </li>
            <li>
              개발 서버에서는 React의 디버깅 정보 복원 때문에 <code>&apos;unsafe-eval&apos;</code>가 포함됩니다. 운영에서는 필요하지 않습니다.
            </li>
            <li>
              이 분기는 <code>nonce-injection</code> 경로에만 적용됩니다. CSP를 앱 전체에 걸면 서드파티 스크립트·인라인 스타일이 한꺼번에 막힐 수 있으니
              <code>matcher</code>로 범위를 좁히고 prefetch 요청을 제외하는 것이 좋습니다.
            </li>
            <li>브라우저는 DOM에서 nonce 속성값을 숨깁니다(<code>getAttribute</code>는 빈 문자열). 값은 <code>script.nonce</code> 프로퍼티로만 읽을 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
