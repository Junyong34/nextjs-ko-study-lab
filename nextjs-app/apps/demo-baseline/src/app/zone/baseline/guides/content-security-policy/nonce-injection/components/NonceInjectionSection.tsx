'use client'
import React, { useEffect, useState } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { CspNonceDemo } from './CspNonceDemo'
import { VerificationFooter } from './VerificationFooter'

declare global {
  interface Window {
    __cspNonceDemoExecuted?: boolean
    __cspNoNonceDemoExecuted?: boolean
  }
}

export function NonceInjectionSection({ nonce }: { nonce: string | null }) {
  const [scriptExecuted, setScriptExecuted] = useState<boolean | null>(null)
  const [noNonceScriptExecuted, setNoNonceScriptExecuted] = useState<boolean | null>(null)

  useEffect(() => {
    // 브라우저가 실제로 CSP를 평가한 뒤이므로, 마운트 시점에 두 플래그를 읽으면
    // nonce 일치 스크립트만 실행되고 nonce 없는 스크립트는 차단됐는지 실측할 수 있다.
    setScriptExecuted(Boolean(window.__cspNonceDemoExecuted))
    setNoNonceScriptExecuted(Boolean(window.__cspNoNonceDemoExecuted))
  }, [])

  return (
    <>
      <DemoPlaygroundCard title="Middleware Nonce 기반 CSP 헤더 주입 실습">
        {nonce && (
          <script
            nonce={nonce}
            dangerouslySetInnerHTML={{ __html: 'window.__cspNonceDemoExecuted = true;' }}
          />
        )}
        {/* nonce 속성 없음 — CSP가 정상 동작하면 이 스크립트는 브라우저에서 차단되어 실행되지 않는다 */}
        <script dangerouslySetInnerHTML={{ __html: 'window.__cspNoNonceDemoExecuted = true;' }} />
        <CspNonceDemo nonce={nonce} scriptExecuted={scriptExecuted} noNonceScriptExecuted={noNonceScriptExecuted} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={nonce ? scriptExecuted === true && noNonceScriptExecuted === false : undefined}
        actual={
          nonce
            ? `- 발급된 nonce: ${nonce.slice(0, 16)}...\n- nonce 일치 스크립트 실행: ${scriptExecuted}\n- nonce 없는 스크립트 실행(차단 기대): ${noNonceScriptExecuted}`
            : '- proxy.ts로부터 x-nonce 헤더를 받지 못함 (dynamic rendering 여부 확인 필요)'
        }
        expected="nonce가 일치하는 스크립트는 실행되고(true), nonce가 없는 스크립트는 CSP에 의해 차단되어 실행되지 않아야(false) 한다."
      />
    </>
  )
}
