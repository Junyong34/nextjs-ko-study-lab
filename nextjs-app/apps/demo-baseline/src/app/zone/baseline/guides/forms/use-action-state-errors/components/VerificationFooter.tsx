'use client'

import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { ExpectedScenario, FormState } from '../types'
import { matchesScenario, scenarioLabels } from '../verification'

export function VerificationFooter({ state, scenario, isPending }: {
  state: FormState
  scenario: ExpectedScenario
  isPending: boolean
}) {
  const isMatched = matchesScenario(state, scenario, isPending)
  return (
    <>
      <ExpectedActualPanel
        title="기대 시나리오와 서버 반환값"
        expected={<span>{scenarioLabels[scenario]}{scenario === 'success'
          ? '\nstatus=success, errors={}, data가 유효한 제출값과 일치'
          : '\nstatus=error, 선택한 필드에만 오류, data=null, 제출값도 해당 오류 조건에 일치'}</span>}
        actual={<span>{isPending ? '응답 대기 중입니다. 이전 결과로 판정하지 않습니다.' :
          state.status === 'idle' ? '제출 전입니다. 주문서를 제출해 주세요.' : JSON.stringify(state, null, 2)}</span>}
        isMatched={isMatched}
        description="검증 완료는 선택한 학습 기대와 응답이 일치한다는 뜻입니다. 오류 응답을 예상했다면 검증은 완료되어도 주문 입력은 거절된 상태입니다."
      />
      <DemoDeepDiveCard title="서버 반환값이 폼 상태가 되는 과정" className="min-w-0">
        <div className="space-y-3 text-xs leading-relaxed">
          <p><code>useActionState(action, initialState)</code>는 마지막 액션 반환값을 state로 제공합니다.
            액션은 <code>(previousState, formData)</code> 순서로 받습니다. 이 예제는 매 제출값을 새로 검사하므로 이전 오류나 성공 결과를 재사용하지 않습니다.</p>
          <pre className="overflow-x-auto rounded bg-zinc-100 p-3 dark:bg-zinc-900">{'page.tsx → FormValidationDemo\n  OrderForm: useActionState\n    form action → actions.ts (use server)\n      이메일·수량 검사 → { status, fields, errors, data }\n    반환 state → 필드 안내 + VerificationFooter'}</pre>
          <p>액션은 이메일 기본 형식과 수량 정수 1~10을 서버에서 검사하며 두 필드 오류를 함께 반환합니다.
            fields는 원래 제출값, data는 통과한 이메일(앞뒤 공백 제거)과 숫자 수량입니다. Network에서 실제 POST 요청을 확인할 수 있습니다.</p>
          <p>noValidate는 서버 오류 관찰을 위한 설정입니다. 브라우저 검사와 별개로 서버 검사는 항상 필요합니다.
            이 예제는 필드 오류를 반환하는 흐름이며, 이메일 존재 여부나 재고·결제 처리는 검사하지 않습니다.</p>
          <p>검증 패널은 현재 편집 중인 입력이 아닌 마지막 서버 응답을 비교합니다. 예제 초기화는 폼을 다시 마운트하여
            useActionState, 입력값, 기대 시나리오를 초기 상태로 돌립니다. 진행 중에는 제출과 초기화가 비활성화됩니다.</p>
        </div>
      </DemoDeepDiveCard>
    </>
  )
}
