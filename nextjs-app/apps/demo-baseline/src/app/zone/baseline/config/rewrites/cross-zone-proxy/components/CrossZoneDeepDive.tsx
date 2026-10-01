import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function CrossZoneDeepDive() {
  return (
    <DemoDeepDiveCard title="외부 URL rewrites와 Multi-Zones 프록시">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 이 데모의 실제 설정</h5>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">{`const cacheHost = withRelatedProject({
  projectName: 'study-cache',
  defaultHost: stripScheme(process.env.ZONE_CACHE_URL || 'localhost:3002'),
})
const UPSTREAM = \`\${scheme}://\${cacheHost}\`

rewrites: [
  { source: '/…/via-cache/:path*', destination: \`\${UPSTREAM}/zone/cache/:path*\` },
  { source: '/…/api/og',           destination: \`\${UPSTREAM}/zone/cache/og\` },
]`}</pre>
          <p className="mt-1">
            <code>src/config/demo-next-config/rewrites-cross-zone.ts</code>가 <code>next.config.ts</code>의 <code>rewrites()</code>에 합쳐집니다.
            목적지 host는 하드코딩하지 않고 셸과 같은 방식(<code>ZONE_CACHE_URL</code> → Vercel Related Projects)으로 정합니다. <code>source</code>는 이 데모 경로 아래로만 한정했습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 외부 URL을 목적지로 쓰면 무엇이 달라지나</h5>
          <p>
            <code>destination</code>이 <code>http(s)://</code>로 시작하면 Next.js 서버가 그 서버로 요청을 다시 보내고 응답(상태·헤더·본문)을 그대로 전달합니다.
            브라우저 입장에서는 같은 출처의 응답이라 CORS가 필요 없고 주소도 바뀌지 않습니다. 실측에서 cache zone이 붙인 <code>X-Powered-By</code>와 404 상태가 그대로 통과한 이유입니다.
            쿼리 문자열도 함께 넘어가서 <code>?title=</code>이 업스트림 Route Handler에 도달합니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. 셸도 같은 원리로 zone을 묶는다</h5>
          <p>
            이 사이트의 셸 <code>next.config.ts</code>는 <code>/zone/baseline/*</code>, <code>/zone/cache/*</code>를 각 zone 서버로 외부 URL rewrite합니다(Multi-Zones).
            이 데모는 그 구조 안에서 한 단계 더, baseline zone이 cache zone으로 프록시합니다. 셸은 <code>beforeFiles</code>를 쓰지만 이 데모는 배열 형태라 <code>afterFiles</code> 단계이고,
            그래서 <code>source</code>인 <code>via-cache</code>·<code>api</code>에는 page 파일을 두지 않았습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. 업스트림이 실패하면</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>업스트림이 404를 내면 그 404가 그대로 전달됩니다. 프록시한 쪽(baseline)의 not-found로 바뀌지 않습니다.</li>
            <li>업스트림에 연결할 수 없으면(서버 꺼짐) next@16.3.2 dev 서버는 <code>500 Internal Server Error</code>를 돌려주고 터미널에 <code>ECONNREFUSED</code>를 남겼습니다(로컬 실측). 배포 환경에서의 상태 코드는 이 화면에서 검증하지 않았습니다.</li>
            <li>설정 변경은 HMR로 반영되지 않습니다. <code>next dev</code>를 재시작해야 새 규칙이 적용됩니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>5. 이 실습의 선택과 한계</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>인터넷 의존을 피하려고 &quot;외부 API&quot;로 제3자 서비스 대신 cache zone의 OG 이미지 Route Handler를 썼습니다. 별도 프로세스의 실제 HTTP 서버라 프록시 경로는 같지만, JSON API가 아니라 PNG를 돌려줍니다.</li>
            <li>프록시된 HTML은 <code>/demo-static/cache/</code> 자산을 참조하므로, 그 자산 경로를 cache zone으로 보내 주는 셸 없이 baseline만 단독으로 띄우면 화면으로 열었을 때 스타일·스크립트가 깨집니다. 그래서 이 실습은 <code>fetch</code>로 응답만 측정합니다.</li>
            <li>응답한 zone은 HTML의 자산 경로, <code>X-Powered-By</code> 헤더, baseline 자체 <code>/og</code>와의 바이트 비교로 판정합니다. 쿠키·인증 헤더 전달과 배포(Vercel) 환경의 프록시 동작은 이 화면에서 검증하지 않았습니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
