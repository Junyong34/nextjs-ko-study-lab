'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { RuntimeCheckState } from '../types'

interface VerificationFooterProps {
  state: RuntimeCheckState
}

const EXPECTED =
  "• edge 라우트: process.env.NEXT_RUNTIME === 'edge'로 실행되고, node:fs / node:crypto 호출은 둘 다 실패해야 한다\n" +
  "  (Edge Runtime 샌드박스에는 이 네이티브 모듈이 없다)\n" +
  "• nodejs 라우트: process.env.NEXT_RUNTIME === 'nodejs'로 실행되고, node:fs / node:crypto 호출은 둘 다 성공해야 한다"

function describeActual(state: RuntimeCheckState): string {
  const { edge, nodejs } = state
  if (!edge && !nodejs) {
    return '• 실습 화면에서 [Edge 라우트 호출] / [Node.js 라우트 호출] 버튼을 눌러 실제 응답을 받으면 결과가 표시됩니다.'
  }
  const lines: string[] = []
  if (edge) {
    const okCount = edge.nodeApiProbes.filter((p) => p.ok).length
    lines.push(
      `• edge 라우트 응답: NEXT_RUNTIME=${edge.runtimeEnv ?? '(null)'}, node API ${okCount}/${edge.nodeApiProbes.length}개 성공`,
    )
  } else {
    lines.push('• edge 라우트: 아직 호출하지 않음')
  }
  if (nodejs) {
    const okCount = nodejs.nodeApiProbes.filter((p) => p.ok).length
    lines.push(
      `• nodejs 라우트 응답: NEXT_RUNTIME=${nodejs.runtimeEnv ?? '(null)'}, node API ${okCount}/${nodejs.nodeApiProbes.length}개 성공`,
    )
  } else {
    lines.push('• nodejs 라우트: 아직 호출하지 않음')
  }
  return lines.join('\n')
}

function computeIsMatched(state: RuntimeCheckState): boolean | undefined {
  const { edge, nodejs } = state
  if (!edge || !nodejs) return undefined
  const edgeOk = edge.runtimeEnv === 'edge' && edge.nodeApiProbes.every((p) => !p.ok)
  const nodeOk = nodejs.runtimeEnv === 'nodejs' && nodejs.nodeApiProbes.every((p) => p.ok)
  return edgeOk && nodeOk
}

export function VerificationFooter({ state }: VerificationFooterProps) {
  const isMatched = computeIsMatched(state)

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="runtime 세그먼트 설정에 따른 실제 실행 환경 분기 검증"
        expected={EXPECTED}
        actual={describeActual(state)}
        isMatched={isMatched}
        description="두 라우트를 모두 호출한 뒤에만 검증 결과가 나온다. isMatched는 '선언한 runtime과 실제 process.env.NEXT_RUNTIME이 일치하는가 + Node.js 전용 API의 성공/실패가 런타임별로 정확히 갈리는가'를 함께 확인한다."
      />
      <DemoDeepDiveCard title="route segment config: runtime ('edge' | 'nodejs')">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 스펙</h5>
            <p>
              <code>export const runtime = 'nodejs' | 'edge'</code>는 layout/page/route 세그먼트가 실행될 JavaScript 런타임을
              고르는 route segment config다. 기본값은 <code>&apos;nodejs&apos;</code>이며, 이 프로젝트의 기준 버전인{' '}
              <strong>Next.js 16.3.2에서 &apos;edge&apos;는 지원 중단(deprecated)</strong> 상태다 — 공식 문서는 신규 코드에서
              <code>runtime</code> export 자체를 제거하고 nodejs를 쓰라고 안내한다(
              <a
                href="https://nextjs.org/docs/messages/edge-runtime-deprecated"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Edge Runtime Deprecated
              </a>
              ). 이 데모는 deprecated 상태에서도 여전히 동작한다는 것과, 왜 동작하면서도 권장되지 않는지를 함께 보여주기 위해
              의도적으로 edge를 사용한다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 왜 page.tsx가 아니라 route.ts 2개인가</h5>
            <p>
              하나의 세그먼트(같은 page.tsx/layout.tsx)에는 <code>runtime</code>을 하나만 선언할 수 있다. edge와 nodejs를 같은
              화면에서 비교하려면 이 데모처럼 <code>api/edge/route.ts</code>, <code>api/nodejs/route.ts</code>로 물리적으로
              분리된 Route Handler 두 개를 만들고, 각자 다른 <code>runtime</code>을 선언해야 한다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 이 데모가 실제로 측정하는 것</h5>
            <p>
              두 신호 모두 실측값이다. ① <code>process.env.NEXT_RUNTIME</code>은 Next.js가 각 런타임에 실제로 주입하는 값으로,
              공식 instrumentation 문서도 이 값으로 <code>if (process.env.NEXT_RUNTIME === 'nodejs')</code>처럼 분기하라고
              안내한다. ② <code>node:fs.readFileSync</code> / <code>node:crypto.randomBytes</code>는 화면에서 버튼을 누를 때마다
              실제로 호출되며, edge 라우트에서는 Turbopack의 Edge 샌드박스가 던지는 실제 에러 메시지(&quot;Failed to load
              external module node:fs: TypeError: Native module not found&quot;)가, nodejs 라우트에서는 실제 파일 개수/난수
              값이 그대로 응답에 담긴다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 서버 콘솔에서 함께 확인할 수 있는 것</h5>
            <p>
              <code>npx next dev</code>를 실행 중인 터미널을 보면, edge 라우트를 처음 컴파일할 때 다음 두 경고가 실제로
              출력된다:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>
                <code>The Edge Runtime is deprecated. You can use the &quot;nodejs&quot; runtime instead.</code>
              </li>
              <li>
                <code>A Node.js module is loaded (&apos;node:fs&apos; at line ...) which is not supported in the Edge
                Runtime.</code>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">5. 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>
                <code>x-vercel-runtime</code> 같은 헤더는 Vercel 플랫폼이 배포된 함수 앞단에서 주입하는 값이라 로컬{' '}
                <code>next dev</code>에는 나타나지 않는다. 로컬에서는 <code>process.env.NEXT_RUNTIME</code>과 서버 콘솔 경고가
                실행 환경을 구분하는 실측 신호다.
              </li>
              <li>
                신규 프로젝트라면 <code>runtime = 'edge'</code>를 새로 추가하지 않는다. 이미 있는 edge 세그먼트는
                <code>runtime</code> export를 제거해 nodejs로 옮기는 것이 공식 마이그레이션 방향이다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
