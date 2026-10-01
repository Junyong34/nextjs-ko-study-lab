'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

const EXPECTED = [
  '• lazyOnload 스크립트는 window load 이벤트 이후에 요청되고, afterInteractive가 먼저 실행된다.',
  '• parallel: 지연이 없는 플러그인이 1200ms 지연된 SDK보다 먼저 실행되어 PgSdk를 찾지 못한다 (next/script는 같은 strategy끼리 실행 순서를 보장하지 않는다).',
  '• chained: 플러그인을 SDK onLoad 이후에 마운트하면 PgSdk가 있고 위젯 등록에 성공한다. onReady는 onLoad 다음에 1회 호출된다.',
  '• error: HTTP 500이면 onError만 호출되고 window.PgSdk는 끝내 정의되지 않는다. onLoad 이전의 결제 호출은 TypeError, 이후는 성공한다.',
].join('\n')

export function VerificationFooter({ matched, actual }: { matched: boolean | undefined; actual: string[] }) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="PG SDK 로드 순서와 콜백 시점 검증"
        expected={EXPECTED}
        // 문자열끼리는 ExpectedActualPanel이 자동 비교(→ 불일치)하므로 ReactNode로 넘긴다
        actual={<span>{actual.length > 0 ? actual.join('\n') : '• 상호작용 대기 중 (페이지 로드 측정이 끝나면 parallel과 chained 시도를 실행해 보세요.)'}</span>}
        isMatched={matched}
        description="strategy 타이밍과 parallel·chained 시도를 모두 실측해야 검증 완료가 됩니다. error 시도와 결제 호출은 실행한 경우에만 판정에 포함됩니다."
      />
      <DemoDeepDiveCard title="next/script strategy와 onLoad · onReady · onError">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. strategy별 실행 시점</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li><code>beforeInteractive</code>: 서버 HTML에 주입되고 Next.js 코드보다 먼저 받는다. 루트 레이아웃(<code>app/layout.tsx</code>)에서만 쓸 수 있고 <code>onLoad</code>·<code>onError</code>는 지원하지 않는다.</li>
              <li><code>afterInteractive</code>(기본값): 하이드레이션 일부가 끝난 뒤 클라이언트에서 주입한다. 결제 SDK처럼 빨리 필요한 스크립트에 쓴다.</li>
              <li><code>lazyOnload</code>: window load 이후 브라우저 유휴 시간에 주입한다. 위 표의 요청 시작 시각이 load 이벤트보다 뒤인 이유다.</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 콜백 시점과 실행 순서</h5>
            <p>
              <code>onLoad</code>는 스크립트가 처음 로드·실행된 직후 1회, <code>onReady</code>는 그 직후와 컴포넌트가 다시 마운트될 때마다,
              <code>onError</code>는 로드 실패 때만 호출된다. 동적으로 주입된 스크립트는 <code>async</code>처럼 도착하는 대로 실행되므로, 두 스크립트를
              같은 렌더에 두면 의존 관계가 있어도 순서가 보장되지 않는다. SDK에 의존하는 스크립트는 SDK의 <code>onLoad</code> 안에서 상태를 바꿔 뒤에 마운트한다.
            </p>
            <pre className="mt-1.5 overflow-x-auto rounded bg-zinc-950 p-2.5 font-mono text-[10px] leading-relaxed text-zinc-300">{`const [ready, setReady] = useState(false)
<Script src="/pg/sdk.js" onLoad={() => setReady(true)} />
{ready && <Script src="/pg/card-widget.js" />}   // window.PgSdk가 있을 때만 실행
<button disabled={!ready}>결제하기</button>`}</pre>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. components/script/pg-sdk-onload 데모와의 차이</h5>
            <p>
              그 데모는 콜백이 호출되는 횟수와 재마운트 동작(<code>onReady</code> 반복)을 다룬다. 이 데모는 strategy별 요청 시각, 의존 스크립트의
              실행 순서 역전, SDK 준비 전 호출 방지를 실측한다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
