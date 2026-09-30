import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="[lang] 세그먼트로 만드는 서브패스 라우팅">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 이번 실습에서 실제로 일어난 일</h5>
          <p>
            <code>[lang]/products/page.tsx</code>는 <code>await params</code>로 <code>lang</code>을 받아 서버에서 그 언어의
            문자열과 통화로 렌더링합니다. 링크를 누르면 URL이 <code>/ko/products → /en/products</code>처럼 바뀌고, 언어마다 고유한
            URL이 생깁니다. 상태(<code>useState</code>)로 언어를 바꾸는 것이 아니라 경로가 언어를 결정합니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 파일 구조와 params 전달</h5>
          <pre className="overflow-x-auto rounded bg-zinc-100 p-2 font-mono text-[11px] dark:bg-zinc-900">{`subpath-routing/
├─ [lang]/layout.tsx          hasLocale 검사 + generateStaticParams
├─ [lang]/products/page.tsx   params: { lang }
└─ [lang]/products/[id]/page.tsx  params: { lang, id }`}</pre>
          <p className="mt-1">
            <code>generateStaticParams</code>는 지원 언어만 빌드 때 미리 만듭니다. 목록 밖 값(<code>/fr</code>)도 요청 시 라우트에
            매칭되므로 <code>hasLocale</code>로 걸러 <code>notFound()</code>를 호출해야 404가 됩니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. 이 실습이 다루지 않는 부분 (주의)</h5>
          <ul className="list-inside list-disc space-y-1 pl-1">
            <li>
              <strong>Accept-Language 감지와 redirect</strong>는 <code>proxy.ts</code>의 역할입니다. 이 zone의 <code>proxy.ts</code>는
              공용이라 수정하지 않았고, 그래서 언어 없는 경로의 자동 redirect는 실습하지 않습니다.
            </li>
            <li>
              <code>[lang]</code>을 root layout으로 두면 <code>&lt;html lang&gt;</code>을 설정할 수 있고, <code>next/root-params</code>로
              깊은 서버 컴포넌트에서 <code>lang()</code>을 읽을 수 있습니다. 이 zone의 root layout은 <code>app/layout.tsx</code>라 중첩
              layout에서는 래퍼 <code>lang</code> 속성으로 대신했습니다.
            </li>
            <li>언어별 JSON 사전과 번들 분리는 dictionary-translation 실습에서 다룹니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
