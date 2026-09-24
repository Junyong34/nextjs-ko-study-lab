import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const H = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const UL = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

export function RuntimeConceptCard() {
  return (
    <DemoDeepDiveCard title="runtime 라우트 세그먼트 설정: 'nodejs'(기본) vs 'edge'(deprecated)" className="min-w-0">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={H}>1. 핵심 스펙</h5>
          <p>
            <code>layout</code>·<code>page</code>·<code>route</code> 파일에서 <code>export const runtime</code>을 내보내면
            해당 세그먼트를 어떤 서버 JavaScript 런타임에서 실행할지 고릅니다. 값은 <code>&apos;nodejs&apos;</code>(기본값)와{' '}
            <code>&apos;edge&apos;</code> 두 가지이며, Next.js 16.3.2 공식 문서는 <code>&apos;edge&apos;</code>를{' '}
            <strong>deprecated</strong>로 표시하고 <code>runtime</code> export를 제거하라고 안내합니다. Proxy 파일에서는 이 옵션을 쓸 수 없습니다.
          </p>
        </div>

        <div>
          <h5 className={H}>2. 이 예제의 구조</h5>
          <pre className="overflow-x-auto rounded bg-zinc-100 p-2.5 font-mono text-[10.5px] dark:bg-zinc-900">
{`runtime-nodejs-edge/
├── page.tsx            ← 이 화면 (runtime 미지정 → nodejs)
├── probe.ts            ← 세 핸들러가 공유하는 측정 함수
├── default/route.ts    ← runtime export 없음
├── node/route.ts       ← export const runtime = 'nodejs'
└── edge/route.ts       ← export const runtime = 'edge'`}
          </pre>
          <p className="mt-1.5">
            세 핸들러는 같은 <code>collectRuntimeProbe()</code>를 호출해 실행 환경을 그대로 JSON으로 돌려줍니다.
            Next.js는 실행 환경마다 <code>process.env.NEXT_RUNTIME</code>을 주입하고, Edge 샌드박스에는 전역{' '}
            <code>EdgeRuntime</code>이 정의됩니다. Node 런타임에서는 <code>process.versions.node</code>와{' '}
            <code>process.getBuiltinModule(&apos;node:fs&apos;)</code>가 동작하지만, Edge에서는 버전 정보가 없고 Node API 호출이
            예외로 끝납니다. <code>fetch</code>·<code>Response</code>·<code>crypto.subtle</code> 같은 Web API는 양쪽에 모두 있어 대조군 역할을 합니다.
          </p>
        </div>

        <div>
          <h5 className={H}>3. 빌드·실행 단계에서 드러나는 차이</h5>
          <ul className={UL}>
            <li>
              <code>next dev</code>와 <code>next build</code> 모두 edge 세그먼트를 만나면{' '}
              <code>The Edge Runtime is deprecated. You can use the &quot;nodejs&quot; runtime instead.</code> 경고를 출력합니다. <code>next build</code>는 이어서{' '}
              <code>Using edge runtime on a page currently disables static generation for that page</code>도 출력합니다.
            </li>
            <li>
              <code>instrumentation.ts</code>의 <code>register()</code>도 런타임마다 따로 실행되므로, 이 앱에서는 edge 핸들러를 처음
              호출할 때 Edge 초기화 로그가 한 번 더 찍힙니다. 공용 코드를 런타임별로 분기할 때도 같은{' '}
              <code>process.env.NEXT_RUNTIME</code> 검사를 씁니다.
            </li>
            <li>
              <code>next build</code> 라우트 표에는 세 핸들러 모두 <code>ƒ</code>(Dynamic)로만 표시되고 Edge 표식은 따로 없습니다. 대신
              edge 핸들러만 <code>.next/server/middleware-manifest.json</code>의 <code>functions</code>에 Edge 함수로 등록되고
              <code>.next/server/edge/chunks/</code>로 번들되며, <code>node</code>·<code>default</code>는 일반 <code>route.js</code>로 남습니다.
            </li>
            <li>
              이 예제는 <code>node:*</code> 모듈을 <code>import</code>하지 않고 전역 객체를 실행 시점에 조사합니다. edge 세그먼트의 의존성
              그래프에 Node 모듈 import가 섞이면 배포 플랫폼의 Edge Function 빌드가 거부할 수 있습니다. 모듈 차단은{' '}
              <code>edge/v8-lightweight/nodejs-modules-bailout</code>, 런타임별 Node API 실호출 비교는{' '}
              <code>functions/server-runtime/edge-vs-nodejs</code> 예제에서 다룹니다.
            </li>
          </ul>
        </div>

        <div>
          <h5 className={H}>4. 언제 무엇을 쓰나</h5>
          <ul className={UL}>
            <li>새 코드: <code>runtime</code> export를 생략하고 기본값 <code>nodejs</code>를 씁니다. 모든 Node.js API와 npm 생태계를 쓸 수 있습니다.</li>
            <li>기존 <code>runtime = &apos;edge&apos;</code> 코드: 제거하고 Node 런타임으로 옮기는 것이 공식 권장 방향입니다.</li>
            <li>
              <code>runtime</code>은 <code>layout</code>·<code>page</code>·<code>route</code> 파일 어디에나 선언할 수 있습니다. 이 예제는
              대조 범위를 좁히려고 개별 <code>route.ts</code>에만 선언했고, 이 화면(<code>page.tsx</code>) 자체는 기본값으로 실행됩니다.
            </li>
          </ul>
        </div>

        <div>
          <h5 className={H}>5. 주의사항</h5>
          <ul className={UL}>
            <li>Edge 런타임은 ISR(Incremental Static Regeneration)을 지원하지 않습니다.</li>
            <li>
              Cache Components(<code>cacheComponents: true</code>)는 Node.js 런타임을 요구합니다. 그래서 이 데모는 Cache Components를 켜지
              않은 <code>demo-baseline</code> zone에 있습니다.
            </li>
            <li>
              Edge에서는 <code>eval</code>, <code>new Function(evalString)</code>, 직접 <code>require</code> 호출이 동작하지 않습니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
