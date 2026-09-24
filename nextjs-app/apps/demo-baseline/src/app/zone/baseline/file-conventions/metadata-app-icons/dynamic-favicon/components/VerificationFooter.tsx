'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { EXPECTED_ICONS } from '../specs'
import { evaluate, expectedPath } from '../evaluate'
import type { ProbeSnapshot } from '../types'

export function VerificationFooter({ snapshot }: { snapshot: ProbeSnapshot | null }) {
  const evaluation = evaluate(snapshot)

  const expected = (
    <ul className="space-y-1">
      {EXPECTED_ICONS.map((spec) => (
        <li key={expectedPath(spec)} className="break-all">
          • &lt;head&gt;에 rel=&quot;{spec.rel}&quot; href=&quot;{expectedPath(spec)}?&lt;해시&gt;&quot; sizes=&quot;
          {spec.width}x{spec.height}&quot; type=&quot;{spec.contentType}&quot; → fetch 200, {spec.contentType},{' '}
          {spec.width}x{spec.height}px
        </li>
      ))}
      <li>• no-reset(루트 layout의 metadata.icons 상속) 라우트에는 이 세그먼트의 파일 아이콘이 주입되지 않음</li>
    </ul>
  )

  const actual = !evaluation ? (
    <span>• 측정 대기 중 (상단 [head 아이콘 링크 읽고 fetch] 버튼을 눌러 주세요)</span>
  ) : (
    <ul className="space-y-1.5">
      {evaluation.lines.map((line) => (
        <li key={line.label} className="break-all">
          <span className={line.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
            {line.ok ? '[일치]' : '[불일치]'}
          </span>{' '}
          {line.label}
          <div className="pl-3 font-mono text-[10px] text-zinc-500">{line.observed}</div>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="icon.tsx / apple-icon.tsx → head 링크 주입 및 실제 이미지 응답"
        expected={expected}
        actual={actual}
        isMatched={evaluation?.isMatched}
        description="기대값은 icon.tsx·apple-icon.tsx가 import하는 specs.ts에서 계산하고, 실제값은 이 문서의 DOM에서 읽은 link 속성과 그 href를 fetch·디코딩한 결과입니다."
      />
      <DemoDeepDiveCard title="코드로 만드는 앱 아이콘 (icon.tsx / apple-icon.tsx)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 동작 원리</h5>
            <p>
              라우트 세그먼트에 <code>icon.tsx</code> / <code>apple-icon.tsx</code>를 두면 Next.js가 두 가지를 동시에 만듭니다.
              (1) 기본 export 함수가 반환한 <code>ImageResponse</code>를 서빙하는 특수 Route Handler
              (<code>…/icon</code>, <code>…/apple-icon</code>), (2) 그 세그먼트 페이지의 <code>&lt;head&gt;</code>에 들어가는{' '}
              <code>&lt;link rel=&quot;icon&quot;&gt;</code> / <code>&lt;link rel=&quot;apple-touch-icon&quot;&gt;</code>.
              <code> size</code>는 <code>sizes</code> 속성으로, <code>contentType</code>은 <code>type</code> 속성과 응답
              Content-Type으로 반영되고, href 끝에는 캐시 무효화용 해시 쿼리가 붙습니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 이 데모의 파일 구조</h5>
            <pre className="overflow-x-auto rounded bg-zinc-100 p-2 font-mono text-[11px] dark:bg-zinc-900">{`dynamic-favicon/
├─ icon.tsx        generateImageMetadata → id: small(32) / large(192)
│                  → /icon/small?<해시>, /icon/large?<해시>
├─ apple-icon.tsx  export size(180) + contentType → /apple-icon?<해시>
├─ specs.ts        두 파일과 검증 패널이 공유하는 크기/타입
├─ page.tsx        metadata = { ...getDemoMetadata(), icons: null }
└─ no-reset/page.tsx  icons 초기화 없음 (비교용)`}</pre>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. generateImageMetadata</h5>
            <p>
              한 <code>icon.tsx</code>에서 여러 아이콘을 만들 때 사용합니다. 반환 배열의 항목마다 링크가 하나씩 생기고
              URL은 <code>/icon/[id]</code>가 되며, 기본 export 함수는 <code>id</code>를 Promise로 받습니다. 동적 세그먼트
              (<code>app/shop/[slug]/icon.tsx</code>) 아래라면 <code>params</code>도 Promise로 전달됩니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 주의사항 (16.3.2 실측)</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>상위 layout의 metadata.icons가 파일 아이콘을 가립니다</strong>: 이 zone의 루트 layout은{' '}
                <code>icons</code>를 직접 지정합니다. Next.js는 해석된 <code>icons</code>가 비어 있을 때만 파일 기반 아이콘을
                넣으므로(<code>resolve-metadata.js</code>), 이 페이지는 <code>icons: null</code>로 상속값을 비웁니다.
                no-reset 비교 결과가 그 차이입니다.
              </li>
              <li>
                <strong>기본은 정적 최적화</strong>: Request-time API를 쓰지 않으면 빌드 시 생성·캐시됩니다. dev와{' '}
                <code>next build</code> 후의 Cache-Control / x-nextjs-cache 값을 비교해 보세요.
              </li>
              <li>
                <strong>favicon은 코드로 만들 수 없습니다</strong>: <code>favicon.ico</code>는 app 루트의 정적 파일만 가능하며,
                세그먼트별 아이콘은 <code>icon</code>을 씁니다.
              </li>
              <li>
                <strong>탭 아이콘은 셸 문서가 결정합니다</strong>: 이 데모는 셸 iframe 안에서 렌더링되므로 브라우저 탭에는
                셸의 아이콘이 보일 수 있습니다. 그래서 이 문서의 링크와 응답을 직접 측정합니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
