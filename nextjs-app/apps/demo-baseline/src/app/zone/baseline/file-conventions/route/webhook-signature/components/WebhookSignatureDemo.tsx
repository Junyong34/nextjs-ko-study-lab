'use client'
import React, { useState } from 'react'

interface WebhookSignatureDemoProps {
  onStatusChange?: (status: { httpStatus: number; verified: boolean; eventName?: string }) => void
}

const WEBHOOK_SECRET = 'study_webhook_secret_key_2026'

async function computeHmacSha256(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function WebhookSignatureDemo({ onStatusChange }: WebhookSignatureDemoProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [lastStatus, setLastStatus] = useState<number | null>(null)
  const [responseJson, setResponseJson] = useState<Record<string, unknown> | null>(null)
  const [actionLog, setActionLog] = useState<string[]>([
    '웹훅 수신 대기: HMAC-SHA256 암호화 서명 검증 준비'
  ])

  const API_ENDPOINT = '/zone/baseline/file-conventions/route/webhook-signature/api'

  const addLog = (msg: string) => {
    setActionLog(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 4)
    ])
  }

  const sendWebhook = async (tamper: boolean) => {
    setIsLoading(true)
    try {
      const payloadObj = {
        event: 'payment.captured',
        paymentId: 'PAY-2026-98124',
        orderId: 'ORD-2026-001',
        amount: 129000,
        currency: 'KRW',
        timestamp: new Date().toISOString(),
      }
      const rawBody = JSON.stringify(payloadObj)

      let signature = await computeHmacSha256(rawBody, WEBHOOK_SECRET)
      if (tamper) {
        // 위변조된 서명 생성
        signature = 'deadbeef' + signature.slice(8)
      }

      addLog(`웹훅 요청 전송: 서명=${signature.slice(0, 10)}... (위변조=${tamper})`)

      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-signature-sha256': signature,
        },
        body: rawBody,
      })

      const data = await res.json()
      setLastStatus(res.status)
      setResponseJson(data)

      if (res.ok && data.verified) {
        addLog(`HTTP 200 검증 통과: ${data.event} (${data.paymentId})`)
        onStatusChange?.({ httpStatus: 200, verified: true, eventName: data.event })
      } else {
        addLog(`HTTP ${res.status} 거절: ${data.error || '검증 실패'}`)
        onStatusChange?.({ httpStatus: res.status, verified: false, eventName: payloadObj.event })
      }
    } catch {
      addLog('웹훅 전송 네트워크 에러')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">PG 결제 웹훅 HMAC 서명 검증</h4>
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              crypto.timingSafeEqual
            </span>
          </div>
          <p className="text-xs text-zinc-500">결제사 웹훅의 무결성을 검증하기 위해 헤더 서명과 비밀키를 대조합니다.</p>
        </div>
        {lastStatus && (
          <span className={`rounded px-2.5 py-1 text-xs font-mono font-bold ${
            lastStatus === 200
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
          }`}>
            HTTP {lastStatus} {lastStatus === 200 ? 'VERIFIED' : 'REJECTED'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
          <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            결제 웹훅 시뮬레이션 전송
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            클라이언트에서 Web Crypto API로 페이로드를 서명한 뒤 <code>x-signature-sha256</code> 헤더를 첨부하여 전송합니다.
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => sendWebhook(false)}
              disabled={isLoading}
              className="w-full rounded bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer text-left flex justify-between items-center"
            >
              <span>1. 정상 서명 웹훅 전송 (200 OK 기대)</span>
              <span className="text-[10px] font-mono bg-emerald-700 px-1.5 py-0.5 rounded">VALID</span>
            </button>

            <button
              onClick={() => sendWebhook(true)}
              disabled={isLoading}
              className="w-full rounded bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer text-left flex justify-between items-center"
            >
              <span>2. 변조된 서명 웹훅 전송 (401 거절 기대)</span>
              <span className="text-[10px] font-mono bg-rose-700 px-1.5 py-0.5 rounded">TAMPERED</span>
            </button>
          </div>
        </div>

        <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
          <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1 flex justify-between">
            <span>서버 route.ts 응답:</span>
            <span className="text-[10px] text-zinc-500">{API_ENDPOINT}</span>
          </div>
          <pre className="text-[11px] text-zinc-300 overflow-x-auto max-h-24 bg-zinc-900 p-2 rounded">
            {responseJson ? JSON.stringify(responseJson, null, 2) : '// 웹훅 요청 버튼을 클릭하세요.'}
          </pre>
          <div className="border-t border-zinc-800 pt-1 space-y-1 text-[10px]">
            {actionLog.slice(0, 2).map((log, i) => (
              <div key={i} className={i === 0 ? 'text-amber-400' : 'text-zinc-500'}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
