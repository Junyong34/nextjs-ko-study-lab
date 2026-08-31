'use client'
import React from 'react'

interface CspNonceDemoProps {
  nonce: string | null
  scriptExecuted: boolean | null
  noNonceScriptExecuted: boolean | null
}

export function CspNonceDemo({ nonce, scriptExecuted, noNonceScriptExecuted }: CspNonceDemoProps) {
  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">CSP Nonce 실증 콘솔</h4>
        <p className="text-xs text-zinc-500">proxy.ts가 매 요청마다 발급한 nonce와 일치하는 스크립트만 실행되는지 실제로 관찰합니다.</p>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1.5">
        <div>
          발급된 nonce: <span className="text-emerald-400">{nonce ? `${nonce.slice(0, 16)}...` : '(없음)'}</span>
        </div>
        <div>
          nonce 일치 스크립트 실행 여부:{' '}
          <span className={scriptExecuted ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
            {scriptExecuted === null ? '확인 중...' : String(scriptExecuted)}
          </span>
        </div>
        <div>
          nonce 없는 스크립트 실행 여부(차단되어야 정상):{' '}
          <span className={noNonceScriptExecuted ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
            {noNonceScriptExecuted === null ? '확인 중...' : String(noNonceScriptExecuted)}
          </span>
        </div>
      </div>
    </div>
  )
}
