import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h5 = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const list = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'
const pre = 'overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300'

/** 서버 컴포넌트 — layout에서 children으로 넘겨 설명 텍스트가 JS 청크에 들어가지 않게 한다. */
export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="서버에서만 사전을 읽는 다국어 page 구성">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h5}>1. 가이드의 흐름: 경로에서 언어를 받고, 그 언어 사전만 읽는다</h5>
          <p>
            Internationalization 가이드는 모든 page를 <code>app/[lang]</code> 아래에 두고, page가 <code>params</code>에서
            <code>lang</code>을 꺼내 <code>getDictionary(lang)</code>로 번역을 가져오게 합니다. 사전은 언어마다{' '}
            <code>{"() => import('./dictionaries/en.json')"}</code> 함수로 등록되어 있어, 호출된 언어의 JSON 모듈 하나만
            로드됩니다. 이 데모는 zone 안의 한 실습이라 <code>dictionary-translation/[lang]</code>에 같은 구조를 둡니다.
          </p>
        </div>
        <div>
          <h5 className={h5}>2. 파일 구성</h5>
          <pre className={pre}>
{`dictionary-translation/
├─ layout.tsx               # 가이드·실습·검증 틀 (런타임 API 없음)
├─ locales.ts               # 언어 코드 목록만 (클라이언트도 import)
├─ dictionaries.ts          # 'server-only' + getDictionary / hasLocale
├─ dictionaries/{ko,en,ja}.json
├─ [lang]/page.tsx          # generateStaticParams → ● /ko /en /ja
│    hasLocale(lang) 실패 → notFound() → /fr 404
└─ source/[lang]/route.ts   # 검증용: 사전 원본 JSON 응답`}
          </pre>
        </div>
        <div>
          <h5 className={h5}>3. 왜 사전이 클라이언트 번들에 들어가지 않는가</h5>
          <ul className={list}>
            <li>
              <code>[lang]/page.tsx</code>와 <code>ProductCard</code>는 서버 컴포넌트입니다. 여기서 import한 JSON과 코드는
              서버 번들에만 들어가고, 브라우저에는 렌더 결과(HTML과 RSC 페이로드)만 갑니다.
            </li>
            <li>
              번역 문자열은 현재 언어의 것만 HTML에 실립니다. 실측 표의 &quot;다른 언어 사전 문자열 0건&quot;이 이를 보여 주고,
              &quot;자기 언어 0건&quot;은 현재 언어 문자열도 JS 청크가 아니라 HTML로만 전달됨을 보여 줍니다.
            </li>
            <li>
              <code>import &apos;server-only&apos;</code>는 실수로 클라이언트 컴포넌트가 <code>dictionaries.ts</code>를 import하면
              빌드를 실패시켜 이 성질을 지켜 줍니다. 반대로 사전을 클라이언트 컴포넌트에서 import하면 모든 언어가 청크에 실립니다.
            </li>
            <li>
              JSON을 <code>fs.readFile</code>이 아니라 <code>import()</code>로 읽으므로 번들러가 파일을 추적합니다. 배포 환경에서
              파일이 빠지는 문제를 따로 신경 쓸 필요가 없습니다.
            </li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>4. 정적 생성과 404</h5>
          <ul className={list}>
            <li>
              <code>generateStaticParams</code>가 <code>ko · en · ja</code>를 반환하면 <code>next build</code>가 언어별 HTML을
              만들고 라우트 표에 <code>●</code>와 생성 경로를 찍습니다. <code>next start</code>에서는 그 HTML이 그대로 응답되어{' '}
              <code>x-nextjs-cache</code> 헤더가 붙습니다.
            </li>
            <li>
              목록 밖 언어는 요청 시 렌더링되지만 <code>hasLocale</code>이 실패해 <code>notFound()</code>로 404가 됩니다. 가이드가
              말하듯 누락된 사전을 런타임 오류 대신 404로 바꾸는 장치입니다. 목록 밖 값을 렌더링조차 하지 않으려면{' '}
              <code>dynamicParams = false</code>를 추가합니다.
            </li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>5. 이 데모가 다루지 않는 것: 로케일 감지와 리다이렉트</h5>
          <p>
            가이드는 <code>proxy.ts</code>에서 <code>Accept-Language</code> 헤더로 선호 언어를 고르고, 경로에 언어가 없으면{' '}
            <code>/products → /en-US/products</code>처럼 리다이렉트하라고 안내합니다. proxy는 앱 전체가 공유하는 파일이라 이
            실습에서는 구현하지 않으며, 서브패스 라우팅 실습에서 다룹니다. 여기서는 언어가 이미 경로에 들어온 뒤의 번역 단계만
            봅니다. 또한 가이드의 <code>next/root-params</code> 방식은 <code>[lang]</code>이 루트 레이아웃 위에 있어야 쓸 수 있어
            이 zone 구조에서는 <code>params</code>로 받습니다.
          </p>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
