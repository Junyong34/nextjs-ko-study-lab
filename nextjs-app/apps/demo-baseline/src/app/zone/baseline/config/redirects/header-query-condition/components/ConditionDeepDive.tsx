import { DemoDeepDiveCard } from '@study/demo-kit'

const h = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const list = 'list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400'

export function ConditionDeepDive() {
  return (
    <DemoDeepDiveCard title="redirects()의 has / missing 조건과 값 캡처">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h}>1. 조건은 어떻게 평가되는가</h5>
          <p>
            <code>source</code> 경로가 맞고, <code>has</code>의 모든 항목이 맞고, <code>missing</code>의 항목이 하나도 맞지 않을 때만 리다이렉트가 적용됩니다.
            항목의 <code>type</code>은 <code>header</code>, <code>cookie</code>, <code>query</code>, <code>host</code> 중 하나이며, <code>host</code>만 <code>key</code> 없이 <code>value</code>를 씁니다.
            <code>value</code>를 생략하면 값이 무엇이든 존재만 확인합니다.
          </p>
        </div>
        <div>
          <h5 className={h}>2. 값 캡처와 쿼리 전달</h5>
          <p>
            <code>value</code>는 전체 일치 정규식이라 <code>Spring_2026</code>처럼 패턴 밖 문자가 있으면 통과합니다. 이름 캡처 그룹 <code>(?&lt;campaign&gt;...)</code>의 값은
            <code>destination</code>에서 <code>:campaign</code>으로 쓰입니다. 원래 요청의 쿼리는 destination으로 그대로 전달되므로 Location에는 <code>ref</code>도 함께 남습니다.
          </p>
        </div>
        <div>
          <h5 className={h}>3. 이 화면이 측정하는 방법</h5>
          <ul className={list}>
            <li>브라우저는 임의 헤더나 Host를 보낼 수 없어서, Server Action이 서버에서 <code>http.request</code>로 이 서버의 probe 경로를 호출합니다.</li>
            <li>redirect를 따라가지 않고 응답을 그대로 읽으므로 307 상태 코드와 Location 헤더를 직접 볼 수 있습니다.</li>
            <li>조건이 어긋난 요청은 <code>redirects()</code>가 파일 시스템보다 먼저 검사된 뒤에도 남아 있는 Route Handler(<code>probe/[kind]/route.ts</code>)까지 도달해 200을 받습니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h}>4. 주의사항</h5>
          <ul className={list}>
            <li>OR이 필요하면 규칙 객체를 나눠야 합니다. 한 규칙의 <code>has</code> 항목은 모두 AND입니다.</li>
            <li><code>redirects()</code>는 서버 시작 때 읽으므로, 설정을 바꾸면 dev 서버를 재시작해야 반영됩니다. HMR로는 갱신되지 않습니다.</li>
            <li>헤더 이름은 대소문자를 구분하지 않지만 <code>value</code> 정규식은 구분합니다.</li>
            <li>모든 규칙의 source를 이 데모의 <code>/probe/*</code> 경로로 한정했습니다. 전역 규칙은 다른 페이지를 가로챌 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
