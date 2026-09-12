'use client'

import { useEffect, useRef, useState } from 'react'
import { DEMO_PATH, PRODUCT_IDS, RECEIPT_PATH } from '../constants'
import type { OrderReceipt, RequestMethod, RequestResult, SubmittedOrder } from '../types'
import { parseOrderInput, verifyRedirect } from '../verification'

export function useRedirectRequest() {
  const [pending, setPending] = useState(false)
  const [submitted, setSubmitted] = useState<SubmittedOrder | null>(null)
  const [result, setResult] = useState<RequestResult | null>(null)
  const generation = useRef(0)
  const controller = useRef<AbortController | null>(null)

  useEffect(() => () => {
    generation.current += 1
    controller.current?.abort()
  }, [])

  function reset() {
    generation.current += 1
    controller.current?.abort()
    controller.current = null
    setPending(false)
    setSubmitted(null)
    setResult(null)
  }

  function clearResult() {
    if (!pending) {
      setSubmitted(null)
      setResult(null)
    }
  }

  async function execute(productId: string, quantity: number, method: RequestMethod) {
    const current = ++generation.current
    controller.current?.abort()
    const activeController = new AbortController()
    controller.current = activeController
    const snapshot = { productId, quantity, method, requestId: crypto.randomUUID() }
    setSubmitted(snapshot)
    setResult(null)
    setPending(true)
    try {
      const url = new URL(`${DEMO_PATH}/submit`, window.location.origin)
      const body = { productId, quantity, requestId: snapshot.requestId }
      if (method === 'GET') {
        url.search = new URLSearchParams({ ...body, quantity: String(quantity) }).toString()
      }
      const response = await fetch(url, {
        method,
        headers: method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
        body: method === 'POST' ? JSON.stringify(body) : undefined,
        redirect: 'follow',
        cache: 'no-store',
        signal: activeController.signal,
      })
      const data: unknown = await response.json()
      const order = parseOrderInput(data, PRODUCT_IDS)
      const fields = data && typeof data === 'object' ? data as Record<string, unknown> : null
      const receipt: OrderReceipt | null = order && fields
        && typeof fields.method === 'string' && (fields.source === 'body' || fields.source === 'query')
        ? { ...order, method: fields.method, source: fields.source } : null
      const observation = { status: response.status, redirected: response.redirected, url: response.url, receipt }
      const verification = verifyRedirect(snapshot, observation, new URL(RECEIPT_PATH, window.location.origin).href)
      if (generation.current !== current) return
      setResult({ submitted: snapshot, observation, ...verification })
    } catch (error) {
      if (generation.current !== current) return
      setResult({
        submitted: snapshot, observation: null, isMatched: false,
        reason: error instanceof Error ? `요청 결과를 읽지 못했습니다: ${error.message}` : '요청 결과를 읽지 못했습니다.',
      })
    } finally {
      if (generation.current === current) {
        setPending(false)
        controller.current = null
      }
    }
  }

  return { pending, submitted, result, execute, reset, clearResult }
}
