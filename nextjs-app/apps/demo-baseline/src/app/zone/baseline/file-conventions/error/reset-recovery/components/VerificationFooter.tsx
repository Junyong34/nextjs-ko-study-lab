'use client'

import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="error.tsx retry()/reset() 복구 검증"
        expected={
          '• 일시적 오류(TX-7781): 재요청을 반복하면 실제 서버 상태가 회복되어 성공\n• 근본 오류(TX-9042): 재요청해도 서버 상태가 바뀌지 않아 계속 실패'
        }
        actual="• 위 [실습 화면]에서 케이스를 선택하고 실제 order 라우트 세그먼트에 진입해 확인하세요."
        description="각 케이스는 서로 다른 실제 라우트 세그먼트(order/transient-outage, order/persistent-fault)와 실제 error.tsx로 구현되어 있습니다. 진입 후 세부 검증 결과가 해당 화면에 표시됩니다."
      />
      <DemoDeepDiveCard title="error.tsx의 error / reset / retry, 그리고 재시도 복구">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">
              1. 핵심 스펙 (Next.js 16.3.2 기준)
            </h5>
            <p>
              <code>error.tsx</code>는 <code>{'{ error, reset, retry }'}</code> 세 개의 props를 받습니다.{' '}
              <strong>retry()</strong>가 표준 재시도 함수로, 내부적으로 <code>router.refresh()</code>를
              호출해 라우트 세그먼트를 실제로 다시 요청·렌더링합니다. <strong>reset()</strong>은 재요청
              없이 에러 바운더리 상태만 초기화합니다 — 이전 버전(16.2 이하)의 <code>reset()</code>과 달리
              지금은 재요청을 보장하지 않습니다. (Next.js v16.3.0에서 <code>retry</code> prop이
              안정화됐습니다.)
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 데모 예제 기반 동작 원리</h5>
            <p>
              두 주문 세그먼트(<code>order/transient-outage</code>, <code>order/persistent-fault</code>)는
              각각 실제 서버 attempt 카운터를 증가시키며 성공 여부를 판정합니다. <code>retry()</code>를
              누르면 <code>page.tsx</code>가 실제로 다시 실행되어 카운터가 증가하고, 일시적 오류 케이스는
              3번째 요청부터 성공하며 근본 오류 케이스는 몇 번을 눌러도 계속 실패합니다.{' '}
              <code>reset()</code>을 눌러도 카운터는 그대로입니다 — 재요청이 일어나지 않았다는 뜻입니다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 실무적 장점</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>클라이언트 무중단 복구</strong>: 전체 새로고침 없이 실패한 세그먼트만 재요청합니다.
              </li>
              <li>
                <strong>정확한 함수 선택</strong>: 서버 데이터가 걸린 에러는 <code>retry()</code>, 순수
                클라이언트 렌더 오류만 지우면 되는 경우는 <code>reset()</code>을 씁니다.
              </li>
              <li>
                <strong>세그먼트 격리</strong>: 상위 <code>layout.tsx</code>는 유지되고 실패한 세그먼트만
                교체됩니다.
              </li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 주요 활용 상황</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>일시적 네트워크 지연으로 실패한 주문/결제 상태 조회 재시도</li>
              <li>배포 설정 오류처럼 재시도로 해결되지 않는 근본 원인 구분</li>
              <li>재시도 횟수 제한 및 고객센터 안내로 전환하는 UX 설계</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">5. 주의사항</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>reset()은 만능 재시도가 아님</strong>: 서버 컴포넌트에서 던진 에러는{' '}
                <code>reset()</code>만으로 새 데이터를 가져오지 않습니다. 재요청이 필요하면{' '}
                <code>retry()</code>를 사용하세요.
              </li>
              <li>
                <strong>무한 재시도 루프 방지</strong>: 근본 원인이 해결되지 않는 에러(권한 없음, 설정
                오류 등)는 재시도 횟수를 제한하고 대체 UX를 제공해야 합니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
