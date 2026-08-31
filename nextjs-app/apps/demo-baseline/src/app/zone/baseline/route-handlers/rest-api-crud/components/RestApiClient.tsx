'use client'

import React, { useState } from 'react'
import { VerificationFooter } from './VerificationFooter'

const API_ENDPOINT = '/zone/baseline/route-handlers/rest-api-crud/api'

export function RestApiClient() {
  const [responsePayload, setResponsePayload] = useState<string>(
    '대기 중: 상단 버튼을 눌러 REST API를 호출하세요.',
  )
  const [statusText, setStatusText] = useState<string>('200 OK')
  const [methodBadge, setMethodBadge] = useState<string>('GET')
  const [lastUrl, setLastUrl] = useState<string>(API_ENDPOINT)
  const [responseSummary, setResponseSummary] = useState<string>('초기 대기 상태')
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const callApi = async (method: string, url: string, body?: object) => {
    setIsLoading(true)
    setMethodBadge(method)
    setLastUrl(url)
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })

      const statusFormatted = `${res.status} ${res.statusText || (res.status === 200 ? 'OK' : res.status === 201 ? 'Created' : '')}`.trim()
      setStatusText(statusFormatted)
      const data = await res.json()
      setResponsePayload(JSON.stringify(data, null, 2))

      let summary = ''
      if (data.total !== undefined) {
        summary = `전체 ${data.total}건 상품 목록 조회 완료`
      } else if (data.created) {
        summary = `신규 상품 ID #${data.created.id} ("${data.created.name}") 등록 완료`
      } else if (data.updated) {
        summary = `상품 ID #${data.updated.id} 상태 ("${data.updated.status}") 수정 완료`
      } else if (data.deletedId) {
        summary = `상품 ID #${data.deletedId} 삭제 완료`
      } else if (data.message) {
        summary = data.message
      } else {
        summary = `JSON 응답 수신 (${res.status})`
      }
      setResponseSummary(summary)
      setHasInteracted(true)
    } catch (err: unknown) {
      setStatusText('Fetch Error')
      setResponsePayload(String(err))
      setResponseSummary('네트워크 요청 에러 발생')
      setHasInteracted(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* 1. HTTP 메서드 실행 툴바 */}
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          {/* GET 전체 조회 */}
          <button
            type="button"
            onClick={() => callApi('GET', API_ENDPOINT)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            <span className="font-mono text-[10px] font-bold">GET</span>
            <span>전체 목록 조회</span>
          </button>

          {/* POST 신규 등록 */}
          <button
            type="button"
            onClick={() =>
              callApi('POST', API_ENDPOINT, {
                name: '울트라 와이드 커브드 모니터',
                price: 890000,
              })
            }
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
          >
            <span className="font-mono text-[10px] font-bold">POST</span>
            <span>상품 등록 (+1)</span>
          </button>

          {/* PATCH 상태 변경 */}
          <button
            type="button"
            onClick={() =>
              callApi('PATCH', API_ENDPOINT, {
                id: '1',
                status: 'sold_out',
              })
            }
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-amber-700 disabled:opacity-50 cursor-pointer"
          >
            <span className="font-mono text-[10px] font-bold">PATCH</span>
            <span>1번 상품 품절 처리</span>
          </button>

          {/* DELETE 삭제 */}
          <button
            type="button"
            onClick={() => callApi('DELETE', `${API_ENDPOINT}?id=2`)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
          >
            <span className="font-mono text-[10px] font-bold">DELETE</span>
            <span>2번 상품 삭제</span>
          </button>

          {/* 목록 초기화 */}
          <button
            type="button"
            onClick={() => callApi('GET', `${API_ENDPOINT}?reset=true`)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
          >
            <span className="font-mono text-[10px] font-bold">RESET</span>
            <span>목록 초기화</span>
          </button>
        </div>

        {/* 2. 응답 상태 및 JSON 본문 뷰어 */}
        <div className="overflow-hidden rounded-md border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                API 응답 결과:
              </span>
              <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                {methodBadge} {lastUrl}
              </span>
            </div>

            <span
              className={`font-mono text-xs font-bold ${
                statusText.startsWith('2')
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isLoading ? '요청 전송 중...' : statusText}
            </span>
          </div>

          <pre className="max-h-60 overflow-y-auto p-3.5 font-mono text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed bg-zinc-50/30 dark:bg-zinc-900/20">
            {responsePayload}
          </pre>
        </div>
      </div>

      {/* 3단 & 4단 검증 패널 및 개념 정리 */}
      <VerificationFooter
        lastMethod={methodBadge}
        lastStatus={statusText}
        lastUrl={lastUrl}
        responseSummary={responseSummary}
        hasInteracted={hasInteracted}
      />
    </div>
  )
}
