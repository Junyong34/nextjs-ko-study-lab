import Script from 'next/script'

// 1) 가장 먼저 실행되는 nonce 스크립트: 위반 이벤트 수집기를 설치한다.
const COLLECTOR = `
window.__cspDemo = { nonceRan: false, scriptNonce: null, blockedRan: false, nextScriptRan: false, nextScriptNonce: null, violations: [] };
document.addEventListener('securitypolicyviolation', function (e) {
  window.__cspDemo.violations.push({ directive: e.violatedDirective, sample: e.sample, origin: 'parse' });
});`

// 2) nonce 일치 스크립트: 실행되면 자기 요소의 nonce 값을 기록한다.
const WITH_NONCE = `window.__cspDemo.nonceRan = true; window.__cspDemo.scriptNonce = document.currentScript.nonce;`

// 3) nonce 없는 스크립트: CSP가 동작하면 실행되지 않아 blockedRan이 false로 남는다.
const WITHOUT_NONCE = `window.__cspDemo.blockedRan = true;`

const NEXT_SCRIPT = `window.__cspDemo.nextScriptRan = true; window.__cspDemo.nextScriptNonce = document.currentScript.nonce;`

/**
 * 서버 컴포넌트가 headers()로 읽은 nonce를 각 스크립트에 적용한다.
 * 브라우저는 응답 헤더의 nonce와 같은 값을 가진 스크립트만 실행한다.
 */
export function CspScripts({ nonce }: { nonce: string | null }) {
  if (!nonce) return null
  return (
    <>
      <script nonce={nonce} dangerouslySetInnerHTML={{ __html: COLLECTOR }} />
      <script nonce={nonce} dangerouslySetInnerHTML={{ __html: WITH_NONCE }} />
      {/* nonce 속성 없음 — 파서가 삽입한 인라인 스크립트라 CSP가 차단한다 */}
      <script dangerouslySetInnerHTML={{ __html: WITHOUT_NONCE }} />
      <Script id="csp-next-script" nonce={nonce} strategy="afterInteractive">
        {NEXT_SCRIPT}
      </Script>
    </>
  )
}
