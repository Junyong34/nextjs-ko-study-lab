'use client'

import { useFormStatus } from 'react-dom'
import { DemoResetButton } from '@study/demo-kit'
import { resetReceipt } from '../actions'

function ResetButton() {
  const { pending } = useFormStatus()
  return (
    <DemoResetButton
      type="submit"
      label={pending ? '확인서 삭제 중...' : '확인서 삭제하고 처음으로'}
      disabled={pending}
      // 공통 버튼의 기본 reload를 덮어쓰고 실제 form 제출만 한 번 수행합니다.
      // JS가 꺼져 있어도 type="submit"이 같은 Server Action을 호출합니다.
      onClick={() => {}}
    />
  )
}

export function ResetReceipt() {
  return <form action={resetReceipt}><ResetButton /></form>
}
