'use client'
import React, { useTransition } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { clearRole, setRole } from '../actions'
import { ROLE_COOKIE } from '../roleCookie'
import { MEASURE_EVENT } from '../measure'

const btn = 'rounded border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800'

export function RoleControls() {
  const [pending, start] = useTransition()
  const measure = () => window.dispatchEvent(new Event(MEASURE_EVENT))
  const choose = (role: 'admin' | 'user') => start(async () => { await setRole(role); measure() })
  // 서버 왕복 없이 브라우저 쿠키만 바꿔, 화면과 쿠키가 어긋나는 상태를 일부러 만든다.
  const forgeCookie = () => { document.cookie = `${ROLE_COOKIE}=admin; path=/`; measure() }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className={btn} disabled={pending} onClick={() => choose('admin')}>관리자로 보기</button>
      <button className={btn} disabled={pending} onClick={() => choose('user')}>일반 회원으로 보기</button>
      <button className={btn} disabled={pending} onClick={forgeCookie}>쿠키만 admin으로 바꾸기</button>
      <button className={btn} onClick={measure}>다시 측정</button>
      <DemoResetButton onReset={async () => { await clearRole(); window.location.reload() }} />
    </div>
  )
}
