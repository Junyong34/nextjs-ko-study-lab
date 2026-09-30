import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { BeaconAttempt, CheckPhase } from '../types'

interface Props {
  attempt: BeaconAttempt | null
  phase: CheckPhase
  serverGotIt: boolean | undefined
}

export function VerificationFooter({ attempt, phase, serverGotIt }: Props) {
  // 대기(undefined) → 서버 조회 완료 후에만 성공/실패를 판정한다.
  const isMatched = attempt && phase === 'done' ? serverGotIt : undefined

  // ExpectedActualPanel은 expected·actual이 둘 다 문자열이면 값을 비교해 판정하므로(대기 상태가 불일치로 보임) 노드로 감싼다.
  let actual: string = '• 대기 중: 위 실습에서 비콘을 전송해 주세요.'
  if (attempt && phase === 'checking') actual = '• 서버 수신 목록을 조회하는 중입니다.'
  if (attempt && phase === 'done') {
    actual = serverGotIt
      ? `• sendBeacon() 반환값 ${attempt.queued}, 서버 GET 목록에서 id ${attempt.id} 확인됨: 서버가 실제로 수신했습니다.`
      : `• sendBeacon() 반환값은 ${attempt.queued}였지만 서버 GET 목록에 id ${attempt.id}가 없습니다. 큐 등록 성공이 수신 성공은 아닙니다(엔드포인트가 404).`
  }

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="서버 수신 여부 검증 결과"
        expected={<span>• 클라이언트가 보낸 id가 Route Handler의 서버 저장소(GET 응답)에 존재한다.</span>}
        actual={<span>{actual}</span>}
        isMatched={isMatched}
        description="클라이언트 반환값이 아니라 서버가 저장한 목록을 다시 조회해서 판정합니다."
      />
      <DemoDeepDiveCard title="navigator.sendBeacon 커스텀 이벤트 전송">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 이번 실습에서 일어난 일</h5>
            <p>
              [구매하기 클릭]은 <code>navigator.sendBeacon(url, Blob)</code>을 호출했고, 브라우저가 <code>api/route.ts</code>의 <code>POST</code>로 요청을 보냈습니다.
              Route Handler는 본문을 파싱해 서버 메모리에 저장하고 <code>204</code>를 반환합니다. 화면의 수신 목록은 같은 파일의 <code>GET</code>으로 다시 읽은 서버 값입니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 반환값 true와 수신은 다릅니다</h5>
            <p>
              <code>sendBeacon()</code>은 큐에 등록되면 <code>true</code>를 돌려주고, 응답 상태나 본문은 읽을 수 없습니다. 실패 사례 버튼이 이를 보여 줍니다.
              수신 여부는 서버 로그나 저장소 같은 서버 쪽 증거로 확인합니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 언제 쓰나</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>페이지를 떠나는 시점(<code>visibilitychange</code>, <code>pagehide</code>)에 남기는 클릭·체류 로그. 일반 <code>fetch</code>는 취소될 수 있습니다.</li>
              <li><code>useReportWebVitals</code>의 metric을 외부 엔드포인트로 보낼 때 (Next.js 공식 Analytics 가이드의 예시).</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 주의사항</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>브라우저가 큐에 넣은 뒤의 전송은 최선 노력이며 유실이 없다는 보증은 없습니다. 전송 중 누적 페이로드는 대체로 64KB로 제한됩니다.</li>
              <li><code>sendBeacon</code>이 없으면 <code>fetch(url, {'{'} method: 'POST', keepalive: true {'}'})</code>로 대체합니다.</li>
              <li>이 실습의 수신 목록은 서버 프로세스 메모리입니다. 실제 서비스는 로그 수집 서비스나 DB로 보내야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
