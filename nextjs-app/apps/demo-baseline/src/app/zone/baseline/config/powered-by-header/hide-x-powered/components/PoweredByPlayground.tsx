'use client'

import React, { useState } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigPoweredByDemo, type HeaderCheckResult } from './ConfigPoweredByDemo'
import { VerificationFooter } from './VerificationFooter'

export function PoweredByPlayground() {
  const [result, setResult] = useState<HeaderCheckResult | null>(null)

  return (
    <div className="space-y-6">
      <DemoPlaygroundCard title="poweredByHeader: false 서버 정보 은닉 보안 실습">
        <ConfigPoweredByDemo onResult={setResult} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={result ? result.poweredBy === null : undefined}
        actual={
          result
            ? `- 요청 경로: ${result.checkedUrl}\n- status: ${result.status}\n- x-powered-by: ${result.poweredBy ?? '(없음)'}`
            : undefined
        }
        expected="poweredByHeader: false 설정으로 인해 응답에 x-powered-by 헤더가 없어야 한다(null)."
      />
    </div>
  )
}
