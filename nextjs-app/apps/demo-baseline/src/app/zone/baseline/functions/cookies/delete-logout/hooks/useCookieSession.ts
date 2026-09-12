'use client'

import { useEffect, useRef, useState } from 'react'
import { createSessionCookie, deleteSessionCookie, readSessionCookie } from '../actions'
import type { CookieHistory, CookieObservation, CookieOperation } from '../types'
import { verifyCookieDeletion } from '../verification'

const emptyHistory: CookieHistory = { created: false, deleted: false }

async function resetCookie(): Promise<CookieObservation> {
  await deleteSessionCookie()
  const observation = await readSessionCookie()
  if (observation.present) throw new Error('초기화 후에도 실습 쿠키가 남아 있습니다.')
  return observation
}

export function useCookieSession() {
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [observation, setObservation] = useState<CookieObservation | null>(null)
  const [history, setHistory] = useState<CookieHistory>(emptyHistory)
  const [result, setResult] = useState<boolean | undefined>(undefined)
  const [notice, setNotice] = useState('실습 쿠키를 지우고 새 서버 요청으로 확인하는 중입니다.')
  const locked = useRef(true)
  const mounted = useRef(false)
  const preparation = useRef<Promise<CookieObservation> | null>(null)

  useEffect(() => {
    mounted.current = true
    let active = true
    // StrictMode의 effect 재실행에서도 같은 준비 요청을 기다린다.
    preparation.current ??= resetCookie()
    preparation.current.then((value) => {
      if (!active) return
      setObservation(value)
      setReady(true)
      setNotice('준비 완료. 회원 쿠키를 생성해 실습을 시작하세요.')
    }).catch(() => {
      if (active) setError('실습 준비를 확인하지 못했습니다. 준비 다시 시도를 눌러 주세요.')
    }).finally(() => {
      if (!active) return
      locked.current = false
      setBusy(false)
    })
    return () => { active = false; mounted.current = false }
  }, [])

  async function run(operation: CookieOperation) {
    if (locked.current || (!ready && operation !== 'reset')) return
    locked.current = true
    setBusy(true)
    setError(null)
    setResult(undefined)
    setObservation(null)
    setNotice('서버 요청 처리 중입니다. 응답 후 쿠키를 다시 읽습니다.')
    if (operation === 'reset') setReady(false)
    let nextHistory = history

    try {
      let value: CookieObservation
      if (operation === 'reset') {
        value = await resetCookie()
        nextHistory = emptyHistory
      } else {
        if (operation === 'create') {
          await createSessionCookie()
          nextHistory = emptyHistory
        }
        if (operation === 'delete') {
          const deletion = await deleteSessionCookie()
          nextHistory = { ...history, deleted: history.created && deletion.hadCookie }
        }
        // 액션 응답의 Set-Cookie를 브라우저가 적용한 다음 별도 요청을 보낸다.
        value = await readSessionCookie()
        if (operation === 'create') {
          if (!value.isDemoMember) throw new Error('회원 쿠키 생성 결과를 확인하지 못했습니다.')
          nextHistory = { created: true, deleted: false }
        }
      }
      if (!mounted.current) return
      setObservation(value)
      setHistory(nextHistory)
      setReady(true)
      if (operation === 'verify') setResult(verifyCookieDeletion(nextHistory, value))
      const messages = {
        create: '새 서버 요청에서 회원 쿠키를 확인했습니다. 삭제 전에 검증하면 불일치입니다.',
        delete: '삭제 응답 이후 새 서버 요청을 마쳤습니다. 아래 쿠키 상태를 보고 검증하세요.',
        verify: '새 서버 요청의 쿠키 상태와 이번 실행의 생성·삭제 이력을 대조했습니다.',
        reset: '쿠키 부재를 확인하고 이력을 초기화했습니다. 다시 생성할 수 있습니다.',
      }
      setNotice(messages[operation])
    } catch {
      if (!mounted.current) return
      setHistory(emptyHistory)
      setError('요청 결과를 확인하지 못했습니다. 연결을 확인한 뒤 초기화하고 다시 실행하세요.')
      setNotice('쿠키 상태를 알 수 없습니다. 이전 검증 결과를 해제했습니다.')
    } finally {
      locked.current = false
      if (mounted.current) setBusy(false)
    }
  }

  return { ready, busy, error, observation, history, result, notice, run }
}
