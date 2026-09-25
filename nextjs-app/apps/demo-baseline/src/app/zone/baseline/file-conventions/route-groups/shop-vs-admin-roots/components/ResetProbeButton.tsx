'use client'

import { DemoResetButton } from '@study/demo-kit'
import { clearBootProbeRecord } from '../lib/boot-id'

/** 서버 컴포넌트 page.tsx에서도 안전하게 쓸 수 있도록 리셋 핸들러를 클라이언트 경계 안에 가둔 래퍼. */
export function ResetProbeButton() {
  return (
    <DemoResetButton
      onReset={() => {
        clearBootProbeRecord()
        window.location.reload()
      }}
    />
  )
}
