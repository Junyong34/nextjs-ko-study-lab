'use client'
import React, { useEffect, useState } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { PreventFlashDemo } from './PreventFlashDemo'
import { VerificationFooter } from './VerificationFooter'

export function PreventFlashSection() {
  const [domTheme, setDomTheme] = useState<string | null>(null)
  const [storedTheme, setStoredTheme] = useState<string | null>(null)

  useEffect(() => {
    setDomTheme(document.documentElement.dataset.demoTheme || null)
    setStoredTheme(localStorage.getItem('demo_darkmode-script_theme'))
  }, [])

  return (
    <>
      <DemoPlaygroundCard title="다크모드 SSR 인라인 스크립트 FOUC 방지 실습">
        <PreventFlashDemo />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={domTheme !== null ? domTheme === (storedTheme || 'dark') : undefined}
        actual={domTheme !== null ? `- localStorage 값: ${storedTheme}\n- document.documentElement.dataset.demoTheme (하이드레이션 전 적용): ${domTheme}` : undefined}
        expected="인라인 스크립트가 React 하이드레이션 전에 localStorage 값을 읽어 documentElement에 이미 반영해 두어야 한다."
      />
    </>
  )
}
