import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const list = 'list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400'

export function HeadersDeepDive() {
  return (
    <DemoDeepDiveCard title="next.config headers()로 보안 응답 헤더 주입">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 방금 관찰한 것</h5>
          <p>
            <code>headers()</code>는 <code>source</code>(path-to-regexp 문법)에 일치하는 요청의 응답에 헤더를 덧붙입니다. 이 데모의 source는{' '}
            <code>/zone/baseline/config/headers/global-security-headers/:path*</code>이고, <code>:path*</code>는 0개 이상의 세그먼트라 데모 페이지 자신과 하위 경로(<code>probe</code>)에 모두 붙었습니다.
            다른 데모 경로에는 붙지 않았고, Server Action이 서버에서 직접 fetch했기 때문에 브라우저 캐시나 확장 프로그램의 영향이 없는 값입니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. &quot;전역&quot;으로 적용하려면, 그리고 이 데모가 하지 않은 이유</h5>
          <p>
            실제 서비스는 보통 <code>source: &apos;/(.*)&apos;</code>로 모든 경로에 한 번에 선언합니다. 이 저장소에서는 그렇게 하지 않았습니다.
            전역 적용은 CSP nonce 데모처럼 자체 CSP를 만드는 다른 데모의 헤더와 겹치고, 같은 키를 가진 규칙이 겹치면 나중에 일치한 규칙이 이깁니다.
          </p>
          <ul className={list}>
            <li><code>X-Frame-Options: DENY</code>(또는 CSP <code>frame-ancestors &apos;none&apos;</code>)를 전역에 걸면 셸이 데모를 iframe으로 임베딩하지 못해 화면이 깨집니다. 그래서 이 데모는 두 헤더를 일부러 넣지 않았고, 검증에서 부재를 확인합니다.</li>
            <li>CSP를 <code>script-src</code>까지 엄격히 걸면 dev 서버의 인라인 스크립트와 서드파티 SDK가 막힙니다. 이 데모는 <code>object-src</code>·<code>base-uri</code>만 제한했습니다. nonce 기반 CSP는 요청마다 값이 달라야 하므로 정적 headers()가 아니라 proxy로 만듭니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>3. HSTS는 localhost에서 효과가 없다</h5>
          <p>
            <code>Strict-Transport-Security</code>는 HTTPS 응답에서만 브라우저가 기억합니다. 이 데모를 HTTP localhost에서 열면 응답 헤더에는 보이지만 브라우저는 무시하므로 아무 일도 일어나지 않습니다.
            운영에서는 <code>max-age=63072000; includeSubDomains; preload</code> 같은 값을 쓰는데, 한번 기억되면 만료 전까지 HTTP로 되돌릴 수 없으니 데모는 300초로 짧게 두었습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. 알아둘 점</h5>
          <ul className={list}>
            <li>headers()는 설정 파일을 읽는 시점에 정해지므로 값을 바꾸면 <code>next dev</code>를 재시작해야 반영됩니다. 재시작 없이는 실제 응답이 옛 값이라 이 화면에서 불일치가 보입니다.</li>
            <li>headers()는 파일 시스템(페이지·<code>public</code> 파일)보다 먼저 검사되어 정적 파일 응답에도 붙습니다. 단 불변 에셋의 <code>Cache-Control</code>은 덮어쓸 수 없습니다.</li>
            <li>Vercel 같은 플랫폼은 HSTS 등을 직접 붙일 수 있습니다. 그래서 대조 경로는 &quot;헤더 없음&quot;이 아니라 &quot;선언한 값과 다름&quot;으로 판정합니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
