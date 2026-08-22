'use client'
import React, { useEffect, useState } from 'react'

interface Order {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
  status: string
  createdAt: string
}

interface RouteOrdersDemoProps {
  onStatusChange?: (status: { httpStatus: number; orderCount: number; lastMethod: string }) => void
}

export function RouteOrdersDemo({ onStatusChange }: RouteOrdersDemoProps) {
  const [selectedProduct, setSelectedProduct] = useState('PROD-001')
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastResponseStatus, setLastResponseStatus] = useState<number | null>(null)
  const [actionLog, setActionLog] = useState<string[]>([
    '쇼핑몰 세션 초기화: route.ts 엔드포인트 연결 준비'
  ])

  const API_ENDPOINT = '/zone/baseline/file-conventions/route/rest-api-orders/api'

  const addLog = (msg: string) => {
    setActionLog(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 4)
    ])
  }

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(API_ENDPOINT)
      const data = await res.json()
      setLastResponseStatus(res.status)
      if (res.ok && data.orders) {
        setOrders(data.orders)
        addLog(`GET 200 OK: 총 ${data.total}건 주문 조회 완료`)
        onStatusChange?.({ httpStatus: res.status, orderCount: data.total, lastMethod: 'GET' })
      } else {
        addLog(`GET ${res.status} 에러: ${data.error || '조회 실패'}`)
      }
    } catch {
      addLog('GET 요청 네트워크 에러')
    } finally {
      setIsLoading(false)
    }
  }

  const createOrder = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: selectedProduct, quantity: orderQuantity }),
      })
      const data = await res.json()
      setLastResponseStatus(res.status)
      if (res.ok && data.order) {
        setOrders(prev => [data.order, ...prev])
        addLog(`POST ${res.status} CREATED: ${data.order.id} (${data.order.productName} ${data.order.quantity}개)`)
        onStatusChange?.({ httpStatus: res.status, orderCount: data.totalOrders, lastMethod: 'POST' })
      } else {
        addLog(`POST ${res.status} 에러: ${data.error || '주문 생성 실패'}`)
      }
    } catch {
      addLog('POST 요청 네트워크 에러')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">REST GET/POST 주문 API (route.ts)</h4>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              실제 route.ts 연동
            </span>
          </div>
          <p className="text-xs text-zinc-500">실제 Next.js Route Handler 엔드포인트({API_ENDPOINT})와 비동기 HTTP 통신합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          {lastResponseStatus && (
            <span className={`rounded px-2 py-1 text-xs font-mono font-bold ${
              lastResponseStatus === 200 || lastResponseStatus === 201
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              HTTP {lastResponseStatus}
            </span>
          )}
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="rounded bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
          >
            {isLoading ? '조회 중...' : 'GET 목록 새로고침'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">주문 상품 선택</span>
            <span className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] font-mono dark:bg-zinc-800">{selectedProduct}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedProduct('PROD-001')}
              className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                selectedProduct === 'PROD-001' ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              러닝화 (#001)
            </button>
            <button
              onClick={() => setSelectedProduct('PROD-002')}
              className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                selectedProduct === 'PROD-002' ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              윈드브레이커 (#002)
            </button>
            <button
              onClick={() => setSelectedProduct('PROD-003')}
              className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                selectedProduct === 'PROD-003' ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              백팩 (#003)
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-zinc-500">수량:</span>
            <button
              onClick={() => setOrderQuantity(q => Math.max(1, q - 1))}
              className="h-7 w-7 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer"
            >
              -
            </button>
            <span className="w-8 text-center font-bold font-mono">{orderQuantity}</span>
            <button
              onClick={() => setOrderQuantity(q => q + 1)}
              className="h-7 w-7 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer"
            >
              +
            </button>
            <button
              onClick={createOrder}
              disabled={isLoading}
              className="ml-auto rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer disabled:opacity-50"
            >
              POST 주문 전송
            </button>
          </div>
        </div>

        <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
            <span className="font-bold text-zinc-400">서버 응답 / 주문 내역:</span>
            <span className="text-[10px] text-zinc-500">총 {orders.length}건</span>
          </div>
          <div className="space-y-1 max-h-28 overflow-y-auto pt-1 text-[11px]">
            {orders.slice(0, 3).map((ord) => (
              <div key={ord.id} className="flex justify-between border-b border-zinc-900 py-0.5 text-zinc-400">
                <span className="text-emerald-400">{ord.id}</span>
                <span>{ord.productName} x {ord.quantity}</span>
                <span className="text-zinc-500">{ord.total.toLocaleString()}원</span>
              </div>
            ))}
          </div>
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
