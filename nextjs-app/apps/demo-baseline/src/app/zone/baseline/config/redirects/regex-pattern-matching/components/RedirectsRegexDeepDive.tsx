import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function RedirectsRegexDeepDive() {
  return (
    <DemoDeepDiveCard title="redirects() 의 path-to-regexp 패턴 매칭">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 방금 관찰한 것</h5>
          <p>
            <code>probe/route.ts</code>가 같은 앱의 가상 경로로 <code>fetch(url, &#123; redirect: &apos;manual&apos; &#125;)</code>를 보내, 따라가지 않은 3xx 응답의 상태 코드와 <code>Location</code>을 그대로 읽었습니다.
            브라우저의 같은 옵션은 응답을 <code>opaqueredirect</code>로 가려 이 값을 읽을 수 없어서 서버에서 측정했습니다.
            <code>permanent: true</code>는 308, <code>false</code>는 307이었고, 308 응답에는 <code>Refresh</code> 헤더도 함께 붙었습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 패턴 문법</h5>
          <ul className="list-disc space-y-1 pl-4">
            <li><code>:slug</code>는 슬래시 없는 한 세그먼트, <code>:path*</code>는 0개 이상, <code>:path+</code>는 1개 이상 세그먼트에 일치합니다.</li>
            <li><code>:year(\d&#123;4&#125;)</code>처럼 파라미터 뒤 괄호에 정규식을 넣으면 그 파라미터가 정규식에 일치할 때만 규칙이 적용됩니다. 어긋나면 리다이렉트되지 않고 원래 라우팅이 이어집니다.</li>
            <li>캡처한 값은 <code>destination</code>에서 <code>:year</code>, <code>:path*</code>처럼 다시 쓰고, 요청의 쿼리 문자열은 목적지로 그대로 전달됩니다.</li>
            <li><code>( ) &#123; &#125; : * + ?</code>를 값 그대로 일치시키려면 <code>source</code>에서 <code>\\</code>로 이스케이프합니다. JS 문자열이므로 <code>\d</code>는 <code>&apos;\\d&apos;</code>로 씁니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>3. 주의사항</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>redirects는 파일 시스템(페이지, <code>/public</code>)보다 먼저 검사됩니다. 넓은 패턴(<code>/:path*</code>)은 실제 페이지까지 가로챌 수 있으니 source를 좁게 잡으세요.</li>
            <li>파라미터 앞의 <code>/</code>를 빠뜨리면 리터럴로 취급되어 무한 리다이렉트 위험이 생깁니다.</li>
            <li>308은 클라이언트와 검색엔진이 영구 캐시하므로, 규칙을 되돌려도 이미 받은 브라우저에는 남습니다. 확신이 없으면 307로 시작하세요.</li>
            <li><code>redirects()</code>는 서버 시작 때 한 번 읽습니다. 설정을 바꾸면 dev 서버를 재시작해야 반영됩니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>4. 이 실습으로 확인할 수 없는 것</h5>
          <p>
            <code>has</code>/<code>missing</code> 조건과 <code>basePath</code>·i18n 동작은 다루지 않습니다(조건부 리다이렉트는 별도 실습).
            리다이렉트 목적지(<code>/products/…</code> 등)는 페이지가 없는 가상 경로라 따라가면 404이며, 이 실습은 3xx 응답 자체만 측정합니다.
          </p>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
