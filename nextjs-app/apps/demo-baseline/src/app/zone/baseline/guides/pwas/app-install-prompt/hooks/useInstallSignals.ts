'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { BeforeInstallPromptEvent, EnvSignals, LogEntry } from '../types'

const now = () => new Date().toLocaleTimeString('ko-KR', { hour12: false })

// 설치 관련 브라우저 신호를 실제 이벤트·미디어 쿼리로 수신한다. 값은 전부 측정값이다.
export function useInstallSignals() {
  const [env, setEnv] = useState<EnvSignals | null>(null)
  const [standalone, setStandalone] = useState(false)
  const [promptReady, setPromptReady] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [prompting, setPrompting] = useState(false)
  const [outcome, setOutcome] = useState<'accepted' | 'dismissed' | null>(null)
  const [log, setLog] = useState<LogEntry[]>([])
  const deferred = useRef<BeforeInstallPromptEvent | null>(null)

  const pushLog = useCallback((name: string, detail?: string) => {
    setLog((prev) => [...prev, { at: now(), name, detail }])
  }, [])

  useEffect(() => {
    const mql = window.matchMedia('(display-mode: standalone)')
    setEnv({
      isSecureContext: window.isSecureContext,
      hasServiceWorkerApi: 'serviceWorker' in navigator,
      hasInstallPromptHook: 'onbeforeinstallprompt' in window,
      inFrame: window.self !== window.top,
      isIos: /iPad|iPhone|iPod/.test(navigator.userAgent),
    })
    setStandalone(mql.matches)

    const onPrompt = (event: Event) => {
      // preventDefault()로 브라우저 기본 설치 UI(미니 인포바) 대신 우리 버튼에서 prompt()를 부른다.
      event.preventDefault()
      deferred.current = event as BeforeInstallPromptEvent
      setPromptReady(true)
      pushLog('beforeinstallprompt', 'preventDefault() 후 이벤트 보관 → [앱 설치] 활성화')
    }
    const onInstalled = () => {
      deferred.current = null
      setPromptReady(false)
      setInstalled(true)
      pushLog('appinstalled', '설치 완료 이벤트')
    }
    const onDisplayMode = () => {
      setStandalone(mql.matches)
      pushLog('display-mode 변경', mql.matches ? 'standalone' : 'browser 탭')
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    mql.addEventListener('change', onDisplayMode)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      mql.removeEventListener('change', onDisplayMode)
    }
  }, [pushLog])

  const install = useCallback(async () => {
    const event = deferred.current
    if (!event) return
    // prompt()는 이벤트당 한 번만 쓸 수 있다. 사용한 이벤트는 바로 버리고 브라우저가 새로 보내길 기다린다.
    deferred.current = null
    setPromptReady(false)
    setPrompting(true)
    pushLog('prompt() 호출', '브라우저 네이티브 설치 대화상자 표시 — 사용자의 선택을 기다림')
    try {
      await event.prompt()
      const choice = await event.userChoice
      setOutcome(choice.outcome)
      pushLog('userChoice', choice.outcome === 'accepted' ? 'accepted (설치 수락)' : 'dismissed (거절)')
    } catch (error) {
      pushLog('prompt() 실패', error instanceof Error ? `${error.name}: ${error.message}` : String(error))
    } finally {
      setPrompting(false)
    }
  }, [pushLog])

  return { env, standalone, promptReady, prompting, installed, outcome, log, install }
}
