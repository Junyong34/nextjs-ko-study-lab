import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

const TREE = `브라우저 (셸 origin 하나)
├─ /demo/...                       → 셸 앱이 직접 렌더 (학습자 URL)
├─ /zone/baseline/:path*           → rewrites(beforeFiles) → ZONE_BASELINE_URL
├─ /zone/cache/:path*              → rewrites(beforeFiles) → ZONE_CACHE_URL
├─ /demo-static/baseline/:path*    → rewrites(afterFiles)  → baseline의 _next 자산
└─ /demo-static/cache/:path*       → rewrites(afterFiles)  → cache의 _next 자산`

export function CrossZoneDeepDive() {
  return (
    <DemoDeepDiveCard title="셸에서 zone으로의 rewrites 라우팅 (Multi-zones)">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 방금 관찰한 것</h5>
          <p>
            같은 origin에 보낸 요청인데 응답 HTML의 script 경로 접두사가 셸은 <code>/_next/</code>, baseline은 <code>/demo-static/baseline/_next/</code>, cache는 <code>/demo-static/cache/_next/</code>로 달랐습니다.
            각 zone이 <code>assetPrefix</code>를 따로 두었기 때문이고, 이 접두사가 &quot;어느 앱이 응답했는가&quot;의 증거입니다.
            baseline은 <code>poweredByHeader: false</code>라 <code>x-powered-by</code>가 없고 cache는 있어서, 헤더도 응답한 zone을 그대로 드러냅니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 이 저장소의 실제 라우팅 표 (apps/shell/next.config.ts)</h5>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">{TREE}</pre>
          <p className="mt-1">
            목적지 host는 하드코딩하지 않고 <code>ZONE_BASELINE_URL</code>·<code>ZONE_CACHE_URL</code>(배포에서는 Related Projects)로 정합니다.
            rewrite는 주소창을 바꾸지 않으므로, baseline 서버는 자기 host로 요청을 받고 학습자가 보던 셸 host는 <code>x-forwarded-host</code>로 전달됩니다.
            학습자 URL(<code>/demo/...</code>)에는 zone 이름이 없어서 데모가 zone을 옮겨도 주소가 바뀌지 않습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. zone 경계에서 &lt;Link&gt;가 실패하는 이유</h5>
          <p>
            <code>&lt;Link&gt;</code>는 지금 앱의 라우터가 RSC payload를 받아 같은 문서 안에서 화면을 바꾸는 방식입니다. 다른 zone은 다른 빌드의 라우트 트리와 번들을 가지므로 baseline 라우터가 그 화면을 이어 그릴 수 없습니다.
            이 실습의 개발 서버에서는 cache zone의 RSC와 청크까지 내려받은 뒤에도 주소와 문서가 그대로 남았습니다. 그래서 zone 사이 링크는 <code>&lt;a&gt;</code>로 두어 처음부터 새 문서를 로드하게 합니다.
          </p>
        </div>
        <div>
          <h5 className={h}>4. 흔한 오용과 이 실습의 한계</h5>
          <ul className="list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
            <li>두 zone이 같은 경로를 제공하면 라우팅이 충돌합니다. 경로 하나는 한 zone에만 속해야 합니다.</li>
            <li><code>assetPrefix</code>는 <code>_next</code> 자산에만 붙습니다. zone의 <code>public/</code> 파일은 셸 rewrites에 걸리지 않습니다.</li>
            <li>baseline zone 주소로 직접 열면 /zone/cache/...를 baseline이 받아 404가 나므로, 셸 경유 항목은 &quot;판정 불가&quot;로 표시합니다.</li>
            <li>운영 빌드(서로 다른 배포 ID)에서 <code>&lt;Link&gt;</code>가 전체 로드로 대체되는지는 이 개발 서버 실습으로 확인하지 않았습니다. 어느 쪽이든 soft navigation으로 넘지 못한다는 점만 판정합니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
