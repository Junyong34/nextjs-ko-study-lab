'use client'

import { DemoDeepDiveCard } from '@study/demo-kit'

/**
 * 이 실습의 핵심 발견을 그대로 옮긴 개념 정리다. 문구는 이 저장소에서 실제로
 * `(shop)/layout.tsx`, `(admin)/layout.tsx`에 <html>/<body>를 직접 넣어 next dev로
 * 실행하고 SSR 응답과 브라우저 DOM, 콘솔을 실측한 결과를 근거로 작성했다.
 */
export function RouteGroupsDeepDive() {
  return (
    <DemoDeepDiveCard title="다중 루트 레이아웃 — 이 위치에서는 왜 진짜 <html>이 2개가 될 수 없는가">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            1. 공식 정의: root layout은 "위치"로 결정된다
          </h5>
          <p>
            Next.js 공식 문서(<code>layout.js</code> 레퍼런스)는 root layout을{' '}
            <code>app</code> 디렉토리 최상단의 layout이라 정의하고, &ldquo;any layout without
            a layout.js above it is a root layout&rdquo;이라고 명시한다. 이 zone의 실제
            최상단에는 이미 <code>apps/demo-baseline/src/app/layout.tsx</code>가
            <code>&lt;html&gt;</code>/<code>&lt;body&gt;</code>를 정의하고 있다 — 즉 이
            실습 폴더(<code>shop-vs-admin-roots/(shop)</code>,{' '}
            <code>shop-vs-admin-roots/(admin)</code>)는 layout.js 위에 이미 layout.js가
            있는 자리이므로, 공식 정의상 root layout이 될 수 없다.
          </p>
        </div>

        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            2. 실측: 그래도 &lt;html&gt;을 넣으면 무슨 일이 벌어지는가
          </h5>
          <p>
            직접 <code>(shop)/layout.tsx</code>에 <code>&lt;html data-root=&quot;shop&quot;&gt;</code>을 넣고
            <code>next dev --port 3011</code>로 실행해 확인했다. SSR 응답 원문에는
            <code>&lt;html&gt;</code> 태그가 실제로 2개 찍혔다(바깥쪽 root layout의
            것 + 이 layout의 것). 그런데 브라우저는 이미 <code>&lt;html&gt;</code> 안에서
            또 <code>&lt;html&gt;</code>을 만나면 새 엘리먼트를 만들지 않고 속성만
            기존 엘리먼트에 병합한다 — Playwright로 확인한 실제 DOM에는{' '}
            <code>document.querySelectorAll(&apos;html&apos;).length === 1</code>,
            <code>...(&apos;body&apos;).length === 1</code>뿐이었다. 그 결과 React의 서버 트리(중첩된
            html/body 2쌍)와 실제 DOM(평탄화된 1쌍)이 어긋나 콘솔에 다음 하이드레이션
            경고가 그대로 떴다: <code>&quot;Invalid HTML tag nesting&quot;</code> —{' '}
            <code>A tree hydrated but some attributes of the server rendered HTML didn&apos;t match
            the client properties&quot;</code>.
          </p>
        </div>

        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            3. 그래서 이 실습이 실제로 증명하는 것
          </h5>
          <p>
            위 실측 때문에 이 실습의 (shop)/(admin) <code>layout.tsx</code>는{' '}
            <code>&lt;html&gt;</code>/<code>&lt;body&gt;</code>를 선언하지 않는다 — 대신
            GNB·배색·내비게이션 구조가 완전히 다른 진짜 중첩 레이아웃 2개를 실제 파일로
            구현했다. 그 결과 자연스러운 귀결도 실측했다: 위 실습 화면의 3단 검증 패널에서
            <code>(shop)</code> ↔ <code>(admin)</code>을 오갈 때 모듈 스코프 상수{' '}
            <code>BOOT_ID</code>가 그대로 유지된다 — 즉 <b>문서 전체 리로드가 일어나지
            않는다</b>. 공식 문서의 &ldquo;서로 다른 root layout 사이를 이동하면 전체
            페이지 리로드가 트리거된다&rdquo;는 캐비어트는{' '}
            <b>진짜 root layout일 때만</b> 적용되는데, 이 위치의 두 그룹은 공유 root
            layout 아래 있는 평범한 중첩 layout이라 애초에 그 캐비어트의 적용 대상이
            아니라는 뜻이다.
          </p>
        </div>

        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            4. 진짜 다중 루트 레이아웃을 만들려면 (참고 코드)
          </h5>
          <p className="mb-1.5">
            <code>app/layout.tsx</code> 자체를 지우고, 아래처럼 <code>app/</code> 바로
            아래에 그룹별 layout만 남겨야 각 layout이 진짜 root layout이 되어
            <code>&lt;html&gt;</code>/<code>&lt;body&gt;</code>를 독립적으로 가질 수 있다.
          </p>
          <pre className="overflow-x-auto rounded bg-zinc-900 p-2.5 text-[11px] leading-relaxed text-zinc-100 dark:bg-black">
{`// app/(shop)/layout.tsx — 진짜 root layout (app/layout.tsx 없음)
export default function ShopRootLayout({ children }) {
  return (
    <html lang="ko" data-theme="shop">
      <body>{children}</body>
    </html>
  )
}

// app/(admin)/layout.tsx — 또 다른 진짜 root layout
export default function AdminRootLayout({ children }) {
  return (
    <html lang="ko" data-theme="admin">
      <body>{children}</body>
    </html>
  )
}`}
          </pre>
        </div>

        <div>
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항</h5>
          <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
            <li>
              <strong>&lt;html&gt; 중복 선언은 조용히 실패한다</strong>: 빌드 에러 없이
              하이드레이션 경고만 남기고 눈으로는 잘 동작하는 것처럼 보일 수 있어 더
              위험하다.
            </li>
            <li>
              <strong>경로 충돌 주의</strong>: <code>(shop)/about/page.tsx</code>와{' '}
              <code>(admin)/about/page.tsx</code>처럼 같은 하위 경로가 두 그룹에 동시에
              있으면 둘 다 <code>/about</code>으로 해석되어 빌드 에러가 난다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
