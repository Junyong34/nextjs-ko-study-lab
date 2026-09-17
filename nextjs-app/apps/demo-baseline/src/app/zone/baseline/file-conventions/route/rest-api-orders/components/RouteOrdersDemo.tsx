'use client'
import React, { useEffect, useState } from 'react'
import { OrderConsolePanel } from './OrderConsolePanel'
import type { DemoStatus, Order } from '../types'

interface RouteOrdersDemoProps {
  onStatusChange?: (status: DemoStatus) => void
}

const INVALID_PRODUCT_ID = 'PROD-999'
const API_ENDPOINT = '/zone/baseline/file-conventions/route/rest-api-orders/api'

export function RouteOrdersDemo({ onStatusChange }: RouteOrdersDemoProps) {
  const [selectedProduct, setSelectedProduct] = useState('PROD-001')
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastResponseStatus, setLastResponseStatus] = useState<number | null>(null)
  const [actionLog, setActionLog] = useState<string[]>([
    '쇼핑몰 세션 초기화: route.ts 엔드포인트 연결 준비',
  ])
  // POST로 방금 만든 주문 id. GET을 다시 호출해 실제로 목록에 나타나는지 대조하는 데 쓴다.
  const [pendingCreatedOrderId, setPendingCreatedOrderId] = useState<string | null>(null)

  const addLog = (msg: string) => {
    setActionLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)])
  }

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(API_ENDPOINT)
      const data = await res.json()
      setLastResponseStatus(res.status)
      if (res.ok && data.orders) {
        setOrders(data.orders)
        const pendingId = pendingCreatedOrderId
        const createdOrderVisible = pendingId ? data.orders.some((o: Order) => o.id === pendingId) : false
        addLog(`GET 200 OK: 총 ${data.total}건 주문 조회 완료`)
        onStatusChange?.({
          lastAction: 'get',
          httpStatus: res.status,
          expectedStatus: 200,
          orderCount: data.total,
          createdOrderId: pendingId,
          createdOrderVisible,
        })
      } else {
        addLog(`GET ${res.status} 에러: ${data.error || '조회 실패'}`)
      }
    } catch {
      addLog('GET 요청 네트워크 에러')
    } finally {
      setIsLoading(false)
    }
  }

  const createOrder = async (productId: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: orderQuantity }),
      })
      const data = await res.json()
      setLastResponseStatus(res.status)
      if (res.ok && data.order) {
        // 로컬 목록은 아직 갱신하지 않는다 — GET 새로고침을 눌러야 서버 상태가 실제로 반영된다.
        setPendingCreatedOrderId(data.order.id)
        addLog(`POST ${res.status} CREATED: ${data.order.id} (${data.order.productName} ${data.order.quantity}개)`)
        onStatusChange?.({
          lastAction: 'post-valid',
          httpStatus: res.status,
          expectedStatus: 201,
          orderCount: orders.length,
          createdOrderId: data.order.id,
          createdOrderVisible: false,
        })
      } else {
        addLog(`POST ${res.status} 에러: ${data.error || '주문 생성 실패'}`)
        onStatusChange?.({
          lastAction: 'post-invalid',
          httpStatus: res.status,
          expectedStatus: 400,
          orderCount: orders.length,
          createdOrderId: null,
          createdOrderVisible: false,
        })
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
            <span
              className={`rounded px-2 py-1 text-xs font-mono font-bold ${
                lastResponseStatus === 200 || lastResponseStatus === 201
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
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
            {[
              { id: 'PROD-001', label: '러닝화 (#001)' },
              { id: 'PROD-002', label: '윈드브레이커 (#002)' },
              { id: 'PROD-003', label: '백팩 (#003)' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProduct(p.id)}
                className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                  selectedProduct === p.id ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-zinc-500">수량:</span>
            <button
              onClick={() => setOrderQuantity((q) => Math.max(1, q - 1))}
              className="h-7 w-7 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer"
            >
              -
            </button>
            <span className="w-8 text-center font-bold font-mono">{orderQuantity}</span>
            <button
              onClick={() => setOrderQuantity((q) => q + 1)}
              className="h-7 w-7 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer"
            >
              +
            </button>
            <button
              onClick={() => createOrder(selectedProduct)}
              disabled={isLoading}
              className="ml-auto rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer disabled:opacity-50"
            >
              POST 주문 전송
            </button>
          </div>

          <button
            onClick={() => createOrder(INVALID_PRODUCT_ID)}
            disabled={isLoading}
            className="w-full rounded border border-rose-300 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300 cursor-pointer disabled:opacity-50"
          >
            잘못된 상품({INVALID_PRODUCT_ID})으로 주문 시도 → 400 확인
          </button>
        </div>

        <OrderConsolePanel orders={orders} actionLog={actionLog} pendingCreatedOrderId={pendingCreatedOrderId} />
      </div>
    </div>
  )
}
