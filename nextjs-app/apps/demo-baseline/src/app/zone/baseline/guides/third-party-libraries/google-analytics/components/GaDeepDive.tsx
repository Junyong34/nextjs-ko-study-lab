import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h5 = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const ul = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

export function GaDeepDive() {
  return (
    <DemoDeepDiveCard title="@next/third-parties GoogleAnalytics 동작 원리">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h5}>1. 컴포넌트가 실제로 만드는 것</h5>
          <p>
            <code>{'<GoogleAnalytics gaId="G-…" />'}</code>는 <code>next/script</code> 두 개를 렌더합니다. 인라인 스크립트(<code>id=&quot;_next-ga-init&quot;</code>)가
            <code>window.dataLayer</code>와 전역 <code>gtag()</code>를 만들고 <code>gtag(&apos;js&apos;)</code>, <code>gtag(&apos;config&apos;, ID)</code>를 push합니다.
            외부 스크립트(<code>id=&quot;_next-ga&quot;</code>)는 <code>googletagmanager.com/gtag/js?id=…</code>를 불러옵니다.
            전략을 지정하지 않으니 기본값 <code>afterInteractive</code>이고, <code>next/script</code>가 하이드레이션 뒤 <code>useEffect</code>에서 body에 붙이며 <code>data-nscript</code> 속성으로 전략을 남깁니다.
            App Router에서는 렌더 중 <code>ReactDOM.preload</code>도 호출해 <code>{'<link rel="preload">'}</code>가 head에 생깁니다.
          </p>
        </div>
        <div>
          <h5 className={h5}>2. sendGAEvent는 dataLayer에 push할 뿐입니다</h5>
          <p>
            <code>sendGAEvent(...args)</code>는 <code>window.dataLayer.push(arguments)</code>입니다. 실제 전송은 gtag.js가 dataLayer를 읽어 처리합니다.
            그래서 push는 오프라인에서도 확인할 수 있고, 이 실습도 길이 증가분으로 판정합니다.
            GoogleAnalytics가 한 번도 렌더되지 않았으면 모듈 변수(dataLayer 이름)가 비어 있어 경고만 남기고 push하지 않습니다. 문서가 &quot;같은 파일이나 부모에 GoogleAnalytics가 있어야 한다&quot;고 하는 이유입니다.
          </p>
        </div>
        <div>
          <h5 className={h5}>3. 실제 서비스 배치와 이 실습의 차이</h5>
          <ul className={ul}>
            <li>실서비스는 모든 라우트를 추적하도록 root layout에 둡니다. 이 실습은 외부 요청이 버튼을 누른 뒤에만 나가도록 클라이언트 컴포넌트 안에서 조건부로 렌더합니다.</li>
            <li>GA4는 브라우저 history 변경으로 소프트 내비게이션 pageview를 자동 측정합니다(Enhanced Measurement 설정 필요). pageview를 직접 보내면 기본 측정을 꺼야 중복이 없습니다.</li>
            <li>스크립트 태그·<code>dataLayer</code>·<code>gtag</code>와 <code>next/script</code>의 로드 캐시는 문서 수명 동안 남습니다. 그래서 초기화는 새로고침으로 합니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>4. 이 실습의 외부 요청 허용 목록과 측정 차단</h5>
          <ul className={ul}>
            <li><code>www.googletagmanager.com</code>: gtag.js 1건(렌더 버튼 이후). gtag.js가 내부적으로 더 부를 수 있으며 실습 화면의 호스트별 집계에 그대로 표시됩니다.</li>
            <li>측정 ID <code>G-DEMO000000</code>은 실제 속성이 아닙니다. 렌더 직전에 gtag.js 공식 opt-out 플래그 <code>window[&apos;ga-disable-G-DEMO000000&apos;] = true</code>를 켜서 <code>google-analytics.com</code>으로 가는 collect 요청이 나가지 않게 했습니다(데모 ID 전용 키, 다른 측정 ID에는 영향 없음).</li>
            <li>판정은 데모 전용 이벤트명(<code>demo_add_to_cart</code>)과 호출 전후 길이 차이로만 하므로, 같은 문서에서 다른 코드가 dataLayer에 push해도 결과가 섞이지 않습니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>5. 주의사항</h5>
          <ul className={ul}>
            <li>GTM을 이미 쓰고 있다면 GoogleAnalytics를 따로 넣기보다 GTM 안에서 GA를 구성하는 편이 권장됩니다.</li>
            <li>CSP를 쓰는 앱은 <code>nonce</code> prop을 넘겨야 인라인 초기화 스크립트가 실행됩니다.</li>
            <li><code>@next/third-parties</code>는 실험적 라이브러리라 버전마다 동작을 다시 확인해야 합니다(이 실습은 16.3.2 기준).</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
