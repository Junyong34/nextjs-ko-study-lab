'use client'
import React, { useState, useTransition } from 'react'
import { MOCK_ORDERS } from '@study/demo-kit'

export function AfterLoggingDemo() {
  const [logs, setLogs] = useState<Array<{ time: string; msg: string; type: 'client' | 'after' }>>([])
  const [isPending, startTransition] = useTransition()

  const handleCompleteOrder = () => {
    const now = new Date().toLocaleTimeString('ko-KR')
    setLogs(prev => [
      { time: now, msg: '[주문 응답 반환] 브라우저에 주문 완료 페이지 즉시 렌더링 (응답 지연 0ms)', type: 'client' }
    ])

    startTransition(async () => {
      // simulate after() background work
      await new Promise(r => setTimeout(r, 800))
      const afterTime = new Date().toLocaleTimeString('ko-KR')
      setLogs(prev => [
        ...prev,
        { time: afterTime, msg: '[after() 작업 1] 물류 센터 WMS 시스템에 출고 지시 데이터 전송 완료', type: 'after' },
        { time: afterTime, msg: '[after() 작업 2] 카카오 알림톡 주문 접수 안내 메시지 비동기 발송 완료', type: 'after' },
        { time: afterTime, msg: '[after() 작업 3] 데이터웨어하우스(DW)에 구매 전환 이벤트 로그 적재 완료', type: 'after' }
      ])
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">after() 백그라운드 주문 후속 처리 (Response 지연 0ms)</h4>
          <p className="text-zinc-500 text-[11px]">응답을 브라우저에 즉시 보낸 후, 재고 차감/알림톡/DW 로그 작업을 백그라운드에서 실행합니다.</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded bg-zinc-50 p-3.5 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100">주문 결제 금액: 259,200원 (2건)</div>
          <div className="text-zinc-500 text-[11px]">주문번호: {MOCK_ORDERS[0].orderNumber}</div>
        </div>
        <button
          type="button"
          onClick={handleCompleteOrder}
          disabled={isPending}
          className="rounded bg-emerald-600 px-4 py-2 font-bold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? '백그라운드 처리 중...' : '최종 결제 승인 요청'}
        </button>
      </div>

      <div className="space-y-2">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">서버 실행 로그 타임라인:</span>
        <div className="space-y-1.5 font-mono">
          {logs.length === 0 ? (
            <div className="text-zinc-400 p-2">결제 승인 버튼을 누르면 after() 동작 로그가 기록됩니다.</div>
          ) : (
            logs.map((l, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  l.type === 'client'
                    ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 font-bold'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                <span className="text-zinc-400 mr-2">[{l.time}]</span>
                {l.msg}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
