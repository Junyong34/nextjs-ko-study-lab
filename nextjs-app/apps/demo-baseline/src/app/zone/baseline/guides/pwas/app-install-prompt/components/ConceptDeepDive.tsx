import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const H = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const UL = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

export function ConceptDeepDive() {
  return (
    <DemoDeepDiveCard title="홈 화면 추가 PWA 프롬프트 및 manifest">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={H}>1. 이 데모가 실제로 만든 파일</h5>
          <ul className={UL}>
            <li>
              <code>manifest.ts</code> — <code>MetadataRoute.Manifest</code>를 반환하는 함수. 앱 루트에서는 파일만 두면 <code>/manifest.webmanifest</code>가
              되지만, 중첩 세그먼트의 <code>manifest.ts</code>는 라우트로 인식되지 않아(이 경로에서 404를 실측) 같은 세그먼트의{' '}
              <code>manifest.webmanifest/route.ts</code>가 이 함수를 호출해 응답을 만든다.
            </li>
            <li>
              <code>page.tsx</code>의 <code>metadata.manifest</code> — 루트가 아니면 <code>&lt;link rel=&quot;manifest&quot;&gt;</code>가 자동으로 붙지 않으므로 직접 연결한다.
            </li>
            <li>
              <code>icon.tsx</code> + <code>generateImageMetadata</code> — <code>public/</code> 파일 없이 192·512 PNG를 코드로 생성하고, manifest의{' '}
              <code>icons[].src</code>가 이 라우트를 가리킨다. 위 검사는 실제로 내려받아 디코딩한 크기까지 확인한다.
            </li>
            <li>
              <code>sw.js/route.ts</code> — <code>public/</code> 없이 Route Handler가 서비스 워커 스크립트를 서빙한다. 데모 앱의 <code>public/</code> 파일은 셸 rewrites에 걸리지 않기 때문이다.
            </li>
          </ul>
        </div>

        <div>
          <h5 className={H}>2. 설치 프롬프트는 &quot;가로채서 나중에 호출&quot;하는 흐름이다</h5>
          <p>
            브라우저가 설치 가능하다고 판단하면 <code>beforeinstallprompt</code>를 보낸다. <code>preventDefault()</code>로 기본 UI를 막고 이벤트를 보관했다가, 사용자가 우리 버튼을
            누를 때 <code>prompt()</code>를 호출하면 네이티브 대화상자가 뜨고 <code>userChoice</code>가 수락/거절을 알려 준다. 수락하면{' '}
            <code>appinstalled</code>가 오고, 설치된 앱으로 실행하면 <code>(display-mode: standalone)</code>가 참이 된다. <code>prompt()</code>는 이벤트 하나당 한 번만 쓸 수 있다.
          </p>
        </div>

        <div>
          <h5 className={H}>3. 서비스 워커 scope 제약 (이 데모에서 확인하는 것)</h5>
          <ul className={UL}>
            <li>
              기본으로 허용되는 scope의 상한은 스크립트가 놓인 경로다. 상한 위로 <code>register()</code>하면 <code>SecurityError</code>로 거부된다 —
              [부모 scope로 등록 시도] 버튼이 이를 실제로 재현한다.
            </li>
            <li>
              이 페이지는 슬래시 없는 경로로 열려 기본 scope(<code>…/app-install-prompt/</code>)에 들어가지 못한다. 그래서 <code>Service-Worker-Allowed</code> 응답 헤더로 허용 범위를
              페이지 경로 하나로 정확히 맞췄다. 헤더를 더 넓게 열면 더 큰 범위를 가로챌 수 있으므로 필요한 만큼만 연다.
            </li>
            <li>
              <code>clients.claim()</code>이 없으면 등록 직후에는 <code>controller</code>가 <code>null</code>이다. <code>sw.js</code>는{' '}
              <code>Cache-Control: no-store</code>로 서빙해 오래된 워커가 갱신을 막지 않게 한다.
            </li>
          </ul>
        </div>

        <div>
          <h5 className={H}>4. 프롬프트가 오지 않을 때 (점검표가 읽는 신호)</h5>
          <ul className={UL}>
            <li>
              <strong>HTTPS</strong>(<code>isSecureContext</code>) — localhost를 제외하면 HTTP에서는 서비스 워커와 설치가 막힌다.
            </li>
            <li>
              <strong>iframe</strong> — 이 화면은 셸 안에 iframe으로 열려 있다. 설치 판단은 최상위 문서 기준이므로 [새 탭에서 열기]로 확인한다.
            </li>
            <li>
              <strong>이미 설치됨</strong> — standalone으로 실행 중이거나 <code>appinstalled</code>를 받았다면 다시 오지 않는다.
            </li>
            <li>
              <strong>브라우저 차이</strong> — <code>beforeinstallprompt</code>는 Chromium 계열 중심이다. Safari·Firefox에서는 이벤트가 없어 설치 방법을 안내 문구로 따로 보여 줘야 한다.
              공식 문서도 모든 브라우저에서 동작하지 않는다는 이유로 이 이벤트 기반 사용자 정의 버튼을 권장하지 않으며, 점진적 향상으로 다룬다.
            </li>
            <li>
              위 조건을 모두 통과해도 이벤트 발송 시점은 브라우저가 정한다. 이 부분은 페이지에서 측정할 수 없어 점검표에 &quot;측정 불가&quot;로 남긴다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
