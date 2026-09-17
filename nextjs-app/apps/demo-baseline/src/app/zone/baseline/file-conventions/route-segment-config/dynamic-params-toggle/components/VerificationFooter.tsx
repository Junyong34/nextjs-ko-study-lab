import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { KNOWN_PRODUCT_IDS, UNKNOWN_PRODUCT_ID } from '../catalog'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="dynamicParams true vs false 대조 대기"
        expected={`• 미생성 ID(${UNKNOWN_PRODUCT_ID}) 접근 시\n• on-demand(true): 실제 응답 200, 요청 시점 SSR\n• blocked(false): 실제 응답 404, 프레임워크가 렌더링 자체를 차단`}
        actual="• 위 2×2 링크 중 하나를 클릭해 실제 서브 라우트로 이동하세요. on-demand 페이지와 blocked의 정상 상품 페이지 하단에서 실시간 fetch로 측정한 실제 HTTP 상태 코드를 보여줍니다."
        description="이 페이지 자체는 상태를 갖지 않습니다 — dynamicParams는 라우트 세그먼트 단위 빌드 설정이라 런타임 토글이 불가능하므로, on-demand/blocked를 실제 서브 라우트 두 개로 분리했습니다."
      />
      <DemoDeepDiveCard title="dynamicParams: generateStaticParams 미포함 경로 처리">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>export const dynamicParams = true | false</code>는 <code>generateStaticParams()</code>가 반환하지 않은 다이나믹 세그먼트 값에 접근했을 때의 동작을 결정하는 라우트 세그먼트 설정입니다. 기본값은 <code>true</code>이며, 이때는 요청 시점에 온디맨드로 서버 렌더링됩니다. <code>false</code>로 두면 목록에 없는 값은 렌더링 자체가 시도되지 않고 즉시 404가 반환됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              두 브랜치(<code>on-demand</code>, <code>blocked</code>) 모두 동일한 <code>generateStaticParams()</code>로 <code>{KNOWN_PRODUCT_IDS.join(', ')}</code>만 사전 생성합니다. 그 외 값(<code>{UNKNOWN_PRODUCT_ID}</code>)으로 접근하면, <code>dynamicParams</code> 값에 따라 <code>on-demand</code>는 정상 렌더링되고 <code>blocked</code>는 404로 거절됩니다 — 두 페이지 코드 어디에도 <code>notFound()</code> 호출이 없습니다. 404는 라우팅 계층이 <code>dynamicParams = false</code> 설정만 보고 강제하는 것입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>생성 페이지 총량 예측</strong>: 빌드 시점에 정적으로 생성될 경로 수를 <code>generateStaticParams</code> 반환값으로 고정해 빌드 시간과 배포 결과를 예측 가능하게 만듭니다.</li>
              <li><strong>임의 URL로 인한 불필요한 렌더링 방지</strong>: 무작위 슬러그로 접근해도 <code>false</code>면 서버가 렌더링을 시도하지 않고 즉시 404로 응답합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>블로그 상위 N개 글만 빌드 시점에 생성하고 나머지는 <code>true</code>로 요청 시 생성(예: <code>posts.slice(0, 10)</code>)</li>
              <li>한정판 상품·비공개 카탈로그처럼 사전 정의된 목록 밖은 <code>false</code>로 완전히 차단</li>
              <li><code>output: 'export'</code> 정적 내보내기 환경에서 생성 경로를 엄격히 제한</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>generateStaticParams와 결합해서만 의미 있음</strong>: <code>generateStaticParams()</code>가 없는 다이나믹 라우트에서는 <code>dynamicParams</code>가 아무 영향을 주지 않습니다.</li>
              <li><strong>dev 모드에서는 판단 근거가 다름</strong>: <code>next dev</code>는 라우트 진입마다 <code>generateStaticParams</code>를 다시 호출하므로 정적 생성 결과(next build 산출물)와 완전히 같은 조건이 아닙니다. false의 실제 404는 <code>next build && next start</code>로 확인해야 합니다.</li>
              <li><strong>Cache Components와 함께 쓸 수 없음</strong>: Cache Components가 활성화된 라우트에서는 <code>dynamicParams</code> 옵션 자체를 사용할 수 없습니다.</li>
              <li><strong>차단된 404는 세그먼트 not-found.tsx가 아니라 앱 루트 not-found.tsx를 씀</strong>: <code>notFound()</code> 호출과 달리 <code>dynamicParams=false</code> 차단은 라우트 세그먼트 트리에 진입하지 못하므로, 같은 폴더에 <code>not-found.tsx</code>를 둬도 쓰이지 않습니다. blocked 브랜치 페이지의 개념 정리에서 실측으로 확인합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
