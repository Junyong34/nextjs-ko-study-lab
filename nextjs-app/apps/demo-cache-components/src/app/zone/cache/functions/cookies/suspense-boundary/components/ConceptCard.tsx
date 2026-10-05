import { DemoDeepDiveCard } from '@study/demo-kit'

const h5 = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const list = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="cookies()를 Suspense로 감싸면 바깥은 정적으로 남는다 — 응답 순서로 본 정적 셸">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h5}>1. 이 데모가 보여 주는 것</h5>
          <ul className={list}>
            <li>
              <strong>inside</strong>: <code>cookies()</code>를 읽는 컴포넌트만 <code>&lt;Suspense&gt;</code> 안에 둡니다. 바깥의 정적
              마크업과 fallback은 쿠키를 기다리지 않고 먼저 도착하고, 쿠키 영역은 뒤이어 스트리밍 세그먼트로 채워집니다.
            </li>
            <li>
              <strong>outside</strong>: 같은 읽기를 Suspense 없이 하면 정적 마크업도 쿠키 읽기가 끝날 때까지 함께 기다립니다. 정적
              셸을 만들 수 없어 <code>export const instant = false</code>로 셸을 포기한다고 명시해야 허용됩니다.
            </li>
            <li>
              <strong>쿠키 값은 요청마다 읽힘</strong>: 쿠키 없음/있음 두 상태 모두 서버가 읽은 값이 HTML에 그대로 나타납니다. 쿠키
              영역은 정적 셸에 포함되지 않습니다.
            </li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>2. 대조 구조</h5>
          <pre className="w-0 min-w-full overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">
{`suspense-boundary/
├─ inside/page.tsx    # <p 정적/> + <Suspense><cookies() 읽기/></Suspense>
└─ outside/page.tsx   # instant = false, Suspense 없이 cookies() 읽기`}
          </pre>
          <p className="mt-1.5">
            두 라우트 모두 <code>&apos;use cache&apos;</code>를 쓰지 않습니다. 셸에 들어가는 것은 정적 마크업과 fallback뿐입니다.
            캐시된 컴포넌트까지 셸에 넣는 구성은 <code>static-layout-session-context</code> 데모가 다룹니다.
          </p>
        </div>
        <div>
          <h5 className={h5}>3. 주의사항</h5>
          <ul className={list}>
            <li>
              <strong>dev와 production의 셸 차이</strong>: dev는 요청마다 셸을 렌더해 바로 보내고, production은 빌드 때 만든 셸을
              보냅니다. 이 데모의 판정은 두 모드 모두 마커 도착 간격으로 하지만, 셸이 빌드 산출물인지는 production에서만 해당합니다.
            </li>
            <li>
              <strong>지연은 학습용</strong>: 쿠키 읽기 뒤 {1200}ms를 일부러 기다려 도착 시각 차이를 눈에 보이게 했습니다. 실제
              <code> cookies()</code> 자체는 즉시 끝납니다.
            </li>
            <li>
              <strong>쿠키는 httpOnly로 발급</strong>: 브라우저 JS가 읽지 못하므로, 화면의 &quot;현재 쿠키&quot; 표시는 Server Action이
              돌려준 값입니다. 판정은 서버가 실제로 읽은 값(HTML)과 대조합니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
