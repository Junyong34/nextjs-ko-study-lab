import { DemoDeepDiveCard } from '@study/demo-kit'

const code = 'rounded bg-zinc-100 px-1 font-mono text-[11px] dark:bg-zinc-800'
const pre =
  'overflow-x-auto rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed dark:border-zinc-800 dark:bg-zinc-900'

export function DeepDive() {
  return (
    <DemoDeepDiveCard title="하이드레이션 전에 DOM을 맞춘다">
      <div>
        <h4 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">1. 왜 useEffect로는 깜빡이는가</h4>
        <p className="leading-relaxed">
          서버는 <code className={code}>localStorage</code>를 읽을 수 없어 기본 테마(light)로 HTML을 만듭니다. 브라우저는 이
          HTML을 받자마자 그리고, JS 번들이 내려받아져 실행되고 React가 하이드레이션을 끝낸 뒤에야{' '}
          <code className={code}>useEffect</code>가 저장값을 적용합니다. 그 사이의 프레임은 전부 잘못된 테마입니다.{' '}
          <code className={code}>useLayoutEffect</code>도 하이드레이션 이후에 실행되므로 HTML 도착~하이드레이션 사이의 깜빡임은
          막지 못합니다.
        </p>
      </div>
      <div>
        <h4 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">2. 이 데모의 구조</h4>
        <pre className={pre}>{`darkmode-script/
├─ page.tsx                 # 비교 화면: 두 하위 라우트를 iframe으로 하드 로드
├─ use-effect/page.tsx      # A: useState(기본값) + useEffect로 적용
├─ inline-script/page.tsx   # B: 인라인 스크립트 + suppressHydrationWarning + DOM 직접 전환
└─ lib/theme.ts             # 저장 키·판정 규칙·스크립트 문자열을 한곳에서 공유

<section id="darkmode-script-area" data-theme="light" suppressHydrationWarning>
  <script>/* localStorage → data-theme (파싱 중 동기 실행) */</script>
  ...내용...
</section>`}</pre>
        <p className="mt-1.5 leading-relaxed">
          가이드는 <code className={code}>{'<html>'}</code>에 <code className={code}>data-theme</code>을 두고{' '}
          <code className={code}>{'<head>'}</code>에서 스크립트를 실행합니다. 이 데모는 앱 전체 테마를 건드리지 않도록 같은
          기법을 데모 영역 요소 하나에 적용했습니다. 스크립트가 그 요소의 첫 자식이라 내용이 파싱되기 전에 속성이 바뀝니다.
        </p>
      </div>
      <div>
        <h4 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">3. B를 이루는 세 가지</h4>
        <ul className="list-disc space-y-1 pl-4 leading-relaxed">
          <li>
            <strong>인라인 스크립트</strong>: 첫 페인트 전에 DOM을 최종 초기 상태로 맞춥니다. 하드 내비게이션(첫 방문·새로고침)에서만
            실행되며, 소프트 내비게이션에서는 가이드의 <code className={code}>InlineScript</code> 헬퍼가{' '}
            <code className={code}>text/plain</code>으로 바꿔 실행하지 않습니다.
          </li>
          <li>
            <strong>suppressHydrationWarning</strong>: B의 JSX는 가이드처럼 항상 <code className={code}>data-theme=&quot;light&quot;</code>를
            렌더하므로, 하이드레이션 때 React는 DOM의 dark와 차이를 봅니다. 이 속성을 빼고 dev에서 실행하면 &quot;A tree hydrated but some
            attributes ... didn&apos;t match&quot; 경고가 1건 기록됩니다. 경고를 끌 뿐 깜빡임을 고치지는 않으며 한 단계 깊이에만 적용되므로,
            테마별 문구는 텍스트 대신 CSS로 전환했습니다.
          </li>
          <li>
            <strong>테마 전환</strong>: 가이드의 ThemeToggle처럼 DOM 속성과 저장소를 직접 바꿉니다. 테마를 React state로 관리한다면 lazy{' '}
            <code className={code}>useState</code> 초기화가 스크립트와 같은 키·판정 규칙을 읽어야 하이드레이션 뒤 값이 되돌아가지 않습니다.
          </li>
        </ul>
      </div>
      <div>
        <h4 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">4. 실무 주의사항</h4>
        <ul className="list-disc space-y-1 pl-4 leading-relaxed">
          <li>스크립트에는 사용자 입력을 문자열로 결합하지 말고 JSON.stringify로 직렬화한 고정 값만 넣습니다(XSS).</li>
          <li>엄격한 CSP(unsafe-inline 불허)를 쓰면 nonce가 필요합니다.</li>
          <li>
            cookie에 테마를 저장하면 서버가 처음부터 맞는 HTML을 만들 수 있지만, 루트 레이아웃에서{' '}
            <code className={code}>cookies()</code>를 읽으면 앱 전체가 정적 프리렌더에서 빠집니다.
          </li>
          <li>개발 모드의 Strict Mode 재마운트에도 결과가 같도록 스크립트를 멱등하게 작성합니다.</li>
        </ul>
      </div>
    </DemoDeepDiveCard>
  )
}
