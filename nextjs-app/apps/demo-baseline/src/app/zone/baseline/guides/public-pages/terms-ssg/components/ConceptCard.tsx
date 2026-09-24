import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h5 = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const list = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'
const pre = 'overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="공개 약관 페이지를 빌드 때 만들어 CDN에 맡기는 구성">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h5}>1. 왜 약관은 사전 생성 대상인가</h5>
          <p>
            Public pages 가이드는 &quot;모든 사용자에게 같은 콘텐츠를 보여주는 page는 미리 prerender해 재사용할 수 있다&quot;고
            설명합니다. 약관은 언어와 버전만 정해지면 내용이 결정되고 사용자별 차이가 없습니다. 그래서 입력(lang, version)을
            빌드 전에 전부 알려주면 모든 버전을 HTML로 만들어 두고, 요청은 저장된 결과로만 응답할 수 있습니다.
          </p>
        </div>
        <div>
          <h5 className={h5}>2. 이 데모의 파일 구성</h5>
          <pre className={pre}>
{`terms-ssg/
├─ layout.tsx                          # 가이드·실습·검증 틀 (런타임 API 없음)
├─ documents/[lang]/[version]/page.tsx
│    generateStaticParams() → ko/2025-07, ko/2026-03, en/2026-03   → ●
│    dynamicParams = false  → 목록 밖 조합은 404
└─ with-cookies/[version]/page.tsx
     같은 목록 + await cookies()                                   → ƒ`}
          </pre>
          <p className="mt-1.5">
            <code>next build</code>는 <code>generateStaticParams</code>가 반환한 조합마다 page를 한 번 실행합니다. 라우트 표에는
            ●(SSG, generateStaticParams를 쓴 prerender)와 그 아래에 실제로 만들어진 경로 목록이 찍힙니다. 이때 실행된{' '}
            <code>new Date()</code>와 <code>crypto.randomUUID()</code> 값이 HTML에 그대로 저장되므로, 몇 번을 요청해도 같은
            렌더 시각과 렌더 ID가 돌아옵니다.
          </p>
        </div>
        <div>
          <h5 className={h5}>3. 목록에 없는 버전을 어떻게 끝낼 것인가</h5>
          <ul className={list}>
            <li>
              <code>dynamicParams = false</code>: 목록 밖 조합(<code>ko/2019-01</code>, 번역본이 없는 <code>en/2025-07</code>)은
              page를 실행하지 않고 404로 응답합니다. 약관처럼 &quot;존재하는 문서 집합이 빌드 때 확정되는&quot; 콘텐츠에 맞습니다.
            </li>
            <li>
              기본값 <code>true</code>였다면 목록 밖 조합도 요청 시 page를 실행하므로, page 안에서 <code>notFound()</code>를
              호출해야 404가 됩니다. 이 데모의 page에도 <code>notFound()</code>가 있지만, 데이터와 목록이 어긋났을 때의 방어선일
              뿐 실제 404는 dynamicParams가 만듭니다.
            </li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>4. 응답 헤더 읽는 법</h5>
          <ul className={list}>
            <li>
              <strong>x-nextjs-cache</strong>: Next.js 서버가 저장된 prerender 결과로 응답했다는 표시입니다(HIT 등). ƒ 라우트
              응답에는 붙지 않습니다.
            </li>
            <li>
              <strong>cache-control</strong>: ● page는 <code>s-maxage=31536000</code>(1년)으로 나가 CDN 같은 공유 캐시가 응답을
              저장할 수 있습니다. revalidate를 두지 않았으므로 다음 배포 전까지 바뀌지 않는다는 뜻입니다. ƒ page는{' '}
              <code>private, no-cache, no-store, max-age=0, must-revalidate</code>라 CDN이 저장하지 않습니다.
            </li>
            <li>
              <strong>404 응답</strong>: 목록 밖 조합은 미리 만들어 둔 404 화면으로 응답해 <code>x-nextjs-cache</code>가 붙지만,
              cache-control은 <code>no-store</code> 계열이라 CDN에 404가 오래 남지 않습니다. 판정은 상태 코드로만 합니다.
            </li>
            <li>
              <strong>next dev 헤더는 근거로 쓰지 않음</strong>: dev에서는 모든 응답이 <code>no-cache, must-revalidate</code>이고,
              요청마다 렌더링되는데도 <code>x-nextjs-cache: HIT</code>가 붙는 경우가 있습니다.
            </li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>5. 주의사항</h5>
          <ul className={list}>
            <li>
              <strong>generateStaticParams는 정적 생성을 보장하지 않음</strong>: <code>with-cookies/</code>는 같은 목록을
              반환하지만 page가 <code>cookies()</code>를 호출해 ƒ가 됩니다. &quot;이 사용자가 동의했는가&quot; 같은 개인 정보는
              <code>documents/</code>처럼 Client Component에서 브라우저 쿠키로 읽으면 page는 ●로 남습니다.
            </li>
            <li>
              <strong>next dev에서는 차이가 보이지 않음</strong>: 개발 서버는 page를 요청마다 렌더링하므로 렌더 ID가 매번
              바뀝니다. 404 처리는 dev에서도 같습니다. 빌드 시점 고정과 캐시 헤더는 <code>next build && next start</code>에서
              확인합니다.
            </li>
            <li>
              <strong>약관 개정</strong>: 새 버전은 목록에 추가하고 다시 빌드하면 생성됩니다. 재빌드 없이 주기적으로 갱신하는
              방식(ISR)은 별도 실습(<code>guides/caching-legacy/segment-revalidate</code>)에서 다룹니다.
            </li>
            <li>
              <strong>Cache Components를 켠 앱</strong>: 공식 가이드는 <code>&apos;use cache&apos;</code>와 Suspense로
              구성하며, 그 모드에서는 <code>dynamicParams</code>를 쓸 수 없습니다. 이 데모는 Cache Components가 없는 zone 기준입니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
