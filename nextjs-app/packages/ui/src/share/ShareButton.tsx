'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Share2, Check } from 'lucide-react'
import { Button } from '../primitives/Button'
import { executeShare } from './share'
import type { ShareButtonProps, ShareStatus } from './types'

export const SHARE_ERROR_MESSAGE = '공유하지 못했어요. 다시 시도해 주세요.'

export function ShareButton({ title, url, text }: ShareButtonProps) {
  const [status, setStatus] = useState<ShareStatus>('idle')
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  const handleShare = async () => {
    if (status === 'sharing') return

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current)
      resetTimerRef.current = null
    }

    setStatus('sharing')

    try {
      const result = await executeShare({ title, url, text })

      if (result.success) {
        if (result.method === 'clipboard') {
          setStatus('copied')
          resetTimerRef.current = setTimeout(() => {
            setStatus('idle')
          }, 2000)
        } else {
          // Web Share API 네이티브 다이얼로그 성공
          setStatus('idle')
        }
      } else {
        if (result.method === 'canceled') {
          // 사용자 취소 (AbortError)
          setStatus('idle')
        } else {
          // 공유 및 클립보드 모두 실패
          setStatus('error')
          resetTimerRef.current = setTimeout(() => {
            setStatus('idle')
          }, 3000)
        }
      }
    } catch {
      setStatus('error')
      resetTimerRef.current = setTimeout(() => {
        setStatus('idle')
      }, 3000)
    }
  }

  const getAriaLabel = () => {
    switch (status) {
      case 'sharing':
        return '공유 중'
      case 'copied':
        return '링크 복사됨'
      case 'error':
        return SHARE_ERROR_MESSAGE
      case 'idle':
      default:
        return '공유하기'
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      shape="compact"
      aria-label={getAriaLabel()}
      aria-live="polite"
      disabled={status === 'sharing'}
      onClick={handleShare}
      className="cursor-pointer transition hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {status === 'copied' ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>복사됨</span>
        </>
      ) : status === 'error' ? (
        <span className="text-rose-600 dark:text-rose-400">
          {SHARE_ERROR_MESSAGE}
        </span>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
          <span>공유</span>
        </>
      )}
    </Button>
  )
}
