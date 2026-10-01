import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function SsgCatalogDeepDive() {
  return (
    <DemoDeepDiveCard title="generateStaticParams로 만드는 정적 카탈로그와 output: 'export'">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 이 데모가 실제로 쓰는 것</h5>
          <p>
            <code>products/[id]/page.tsx</code>가 <code>generateStaticParams</code>로 001~004를 반환하고{' '}
            <code>dynamicParams = false</code>를 선언합니다. 카탈로그 데이터는 6종이지만 5·6번은 목록 밖이라 404입니다.
            페이지는 <code>cookies</code>·<code>headers</code>·<code>searchParams</code>를 읽지 않으므로 production에서는 빌드 때 한 번 렌더된 HTML이 그대로 서빙됩니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. dev와 production은 다르게 보입니다</h5>
          <p>
            <code>next dev</code>는 사전 렌더링 결과를 재사용하지 않고 요청마다 서버 컴포넌트를 다시 실행합니다. 그래서 dev에서는 렌더 시각이 매번 바뀌어 &quot;고정&quot;을 관찰할 수 없고, 404 응답만 production과 같습니다.
            고정 여부는 <code>next build</code> 후 <code>next start</code>에서 같은 측정을 반복해야 확인됩니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. output: &apos;export&apos;와의 관계 (이 데모는 설정을 바꾸지 않음)</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li><code>output: &apos;export&apos;</code>는 <code>next.config</code> 전역 설정이라 같은 앱의 다른 데모(Server Action, Proxy, cookies)를 막으므로 여기서는 켜지 않았습니다.</li>
            <li>export 모드에서는 <code>generateStaticParams</code> 없는 동적 라우트와 <code>dynamicParams: true</code>가 지원되지 않으며, 빌드 결과는 <code>out/products/001.html</code> 같은 파일이 됩니다.</li>
            <li>export 모드에서는 서버가 없으므로 목록 밖 URL은 호스트(Nginx 등)가 404.html로 응답합니다. 이 데모의 404는 Next.js 서버가 만듭니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>4. 주의사항</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>상품이 수만 개면 빌드 시간이 늘어납니다. 인기 상품만 사전 생성하고 나머지는 <code>dynamicParams = true</code>(기본값)로 요청 시 생성하는 방식을 검토합니다.</li>
            <li>가격·재고처럼 자주 바뀌는 값은 정적 HTML에 고정되므로 재검증(ISR)이나 클라이언트 fetch가 필요합니다.</li>
            <li>렌더 후 경과 시간은 클라이언트와 서버의 시계 차이를 포함하므로 참고값입니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
