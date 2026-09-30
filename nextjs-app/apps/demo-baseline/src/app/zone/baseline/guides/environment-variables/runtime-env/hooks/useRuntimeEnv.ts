'use client'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ENV_NAMES, type EnvName, type EnvReadResult, type EnvSnapshot, type Prediction } from '../types'
import { readInBrowser } from '../lib/browserEnv'

export function useRuntimeEnv(serverSnapshot: EnvSnapshot) {
  const router = useRouter()
  const [name, setName] = useState<EnvName>(ENV_NAMES[0])
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [reads, setReads] = useState<EnvReadResult[]>([])
  // 서버 렌더(page.tsx)가 실행된 시각 이력. router.refresh() 후 새 시각이 props로 도착하면 추가된다.
  const [renderTimes, setRenderTimes] = useState<string[]>([serverSnapshot.evaluatedAt])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setRenderTimes((prev) => (prev[0] === serverSnapshot.evaluatedAt ? prev : [serverSnapshot.evaluatedAt, ...prev].slice(0, 5)))
  }, [serverSnapshot.evaluatedAt])

  const readEnv = () => {
    startTransition(async () => {
      const res = await fetch(`${window.location.pathname}/api/status`, { cache: 'no-store' })
      const server: EnvSnapshot = await res.json()
      const { literal, dynamic } = readInBrowser(name)
      setReads((prev) => [{ name, server, browserLiteral: literal, browserDynamic: dynamic }, ...prev].slice(0, 5))
    })
  }

  // router.refresh()는 서버 컴포넌트(page.tsx)를 서버에서 다시 실행해 새 serverSnapshot을 props로 내려준다.
  const rerenderOnServer = () => startTransition(() => router.refresh())

  const reset = () => {
    setReads([])
    setPrediction(null)
    setRenderTimes([serverSnapshot.evaluatedAt])
  }

  return { name, setName, prediction, setPrediction, reads, renderTimes, isPending, readEnv, rerenderOnServer, reset }
}
