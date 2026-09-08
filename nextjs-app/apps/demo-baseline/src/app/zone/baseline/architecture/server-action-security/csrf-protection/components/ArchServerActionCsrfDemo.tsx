'use client'

import {
  DemoDeepDiveCard,
  DemoPlaygroundCard,
  DemoResetButton,
  ExpectedActualPanel,
} from '@study/demo-kit'
import { useActionState } from 'react'
import { inspectSameOriginAction } from '../actions'
import { INITIAL_CSRF_PROBE_STATE } from '../types'

export function ArchServerActionCsrfDemo() {
  const [state, formAction, isPending] = useActionState(
    inspectSameOriginAction,
    INITIAL_CSRF_PROBE_STATE,
  )

  const actual = state.status === 'idle'
    ? state.message
    : `액션 도달: ${state.reachedAction}\nOrigin: ${state.origin ?? '(헤더 없음)'}\nHost: ${state.host ?? '(헤더 없음)'}\nX-Forwarded-Host: ${state.forwardedHost ?? '(헤더 없음)'}\n결과: ${state.message}`

  return (
    <>
      <DemoPlaygroundCard title="실제 동일 출처 Server Action POST">
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="probe" value="same-origin-server-action" />
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            이 액션은 데이터를 변경하지 않고 서버가 받은 요청 헤더만 반환합니다.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={isPending} className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">
              {isPending ? '요청 중…' : '같은 출처 Server Action 실행'}
            </button>
            <DemoResetButton />
          </div>
        </form>
      </DemoPlaygroundCard>

      <ExpectedActualPanel
        title="Server Action 실행 전 출처 검사"
        expected={<span>같은 출처 요청은 프레임워크 검사를 통과해 액션 본문에 도달</span>}
        actual={actual}
        isMatched={state.status === 'idle' ? undefined : state.status === 'success' && state.reachedAction}
        description="헤더 값은 고정 예시가 아니라 실제 액션 요청에서 next/headers로 읽습니다."
      />

      <DemoDeepDiveCard title="Origin 검사는 보안의 한 계층입니다">
        <p>Next.js 16은 Server Action 요청의 <code>Origin</code>과 <code>Host</code> 또는 <code>X-Forwarded-Host</code>를 비교합니다. 불일치 요청은 액션 함수가 실행되기 전에 중단되므로 액션 내부 UI로 그 요청을 재현해 성공처럼 표시할 수 없습니다.</p>
        <p><code>serverActions.allowedOrigins</code>는 프록시나 별도 공개 도메인처럼 추가로 신뢰할 origin만 등록합니다. 와일드카드는 필요한 범위로 제한해야 합니다.</p>
        <p>이 검사는 인증·인가·입력 검증을 대신하지 않습니다. 실제 데이터 변경 액션은 함수 본문에서도 사용자 권한과 입력을 다시 검증해야 합니다.</p>
      </DemoDeepDiveCard>
    </>
  )
}
