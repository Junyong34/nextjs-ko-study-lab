'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { DemoPlaygroundCard, DemoResetButton, MOCK_USER_SESSIONS } from '@study/demo-kit'
import { issueSessionAction, resetSessionAction } from '../actions'
import { VerificationFooter } from './VerificationFooter'
import type { ClientCookieVisibility, SessionCookieState, SessionRole } from '../types'

const ROLE_ORDER: SessionRole[] = ['customer', 'vip', 'admin']

interface CookiesSessionDemoProps {
  initialState: SessionCookieState
}

// document.cookie는 브라우저 JS가 실제로 접근 가능한 쿠키만 보여준다.
// httpOnly 쿠키는 여기서 절대 보이지 않는다 — 시뮬레이션이 아니라 브라우저의 실제 보안 동작이다.
function readClientCookieVisibility(): ClientCookieVisibility {
  if (typeof document === 'undefined') {
    return { sessionTokenVisible: false, userRoleVisible: false }
  }
  return {
    sessionTokenVisible: document.cookie.includes('session-token='),
    userRoleVisible: document.cookie.includes('user-role='),
  }
}

export function CookiesSessionDemo({ initialState }: CookiesSessionDemoProps) {
  const [serverState, setServerState] = useState<SessionCookieState>(initialState)
  const [selectedRole, setSelectedRole] = useState<SessionRole | null>(
    (initialState.role?.toLowerCase() as SessionRole | undefined) ?? null,
  )
  const [clientCookies, setClientCookies] = useState<ClientCookieVisibility>({
    sessionTokenVisible: false,
    userRoleVisible: false,
  })
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setClientCookies(readClientCookieVisibility())
  }, [serverState])

  const handleSelectRole = (role: SessionRole) => {
    setSelectedRole(role)
    startTransition(async () => {
      const next = await issueSessionAction(role)
      setServerState(next)
    })
  }

  const handleReset = () => {
    startTransition(async () => {
      const next = await resetSessionAction()
      setServerState(next)
      setSelectedRole(null)
    })
  }

  const expectedRole = selectedRole ? MOCK_USER_SESSIONS[selectedRole].role : null
  const roleMatched = selectedRole !== null && serverState.role === expectedRole
  const httpOnlyProtected = selectedRole !== null && serverState.hasSessionToken && !clientCookies.sessionTokenVisible
  const roleCookieVisible = selectedRole !== null && clientCookies.userRoleVisible
  const isMatched = selectedRole === null ? undefined : roleMatched && httpOnlyProtected && roleCookieVisible

  const actual = selectedRole
    ? `• 서버가 cookies().get()으로 읽은 user-role: ${serverState.role ?? '(없음)'}\n` +
      `• 서버가 읽은 session-token: ${serverState.hasSessionToken ? serverState.sessionTokenPreview : '(없음)'}\n` +
      `• document.cookie의 session-token 노출 여부: ${clientCookies.sessionTokenVisible ? '노출됨 (오류)' : '차단됨 (정상, httpOnly)'}\n` +
      `• document.cookie의 user-role 노출 여부: ${clientCookies.userRoleVisible ? '노출됨 (정상)' : '없음'}`
    : undefined

  const expected = selectedRole
    ? `역할 선택 후 서버가 다시 읽은 user-role 값이 ${expectedRole}과 일치하고, session-token은 httpOnly라서 document.cookie에 나타나지 않으며, user-role은 httpOnly가 아니므로 document.cookie에 나타나야 한다.`
    : undefined

  return (
    <>
      <DemoPlaygroundCard title="cookies().get() 읽기 & cookies().set() 세션 쿠키 발급 실습">
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">역할 전환 → 실제 Server Action 세션 발급</h4>
              <p className="text-zinc-500 text-[11px]">
                버튼을 클릭하면 issueSessionAction이 (await cookies()).set()을 호출해 실제 Set-Cookie 응답 헤더를 보냅니다.
              </p>
            </div>
            <DemoResetButton onReset={handleReset} label="세션 초기화" loadingLabel="초기화 중..." />
          </div>

          <div className="flex gap-2">
            {ROLE_ORDER.map((role) => {
              const session = MOCK_USER_SESSIONS[role]
              const isActive = selectedRole === role
              return (
                <button
                  key={role}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSelectRole(role)}
                  className={`flex-1 rounded p-2 text-left cursor-pointer transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    isActive
                      ? 'border-blue-600 bg-blue-50/50 border font-bold dark:border-blue-500 dark:bg-blue-950/20'
                      : 'border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
                  }`}
                >
                  <div className="text-zinc-900 dark:text-zinc-100">
                    {session.name} ({session.role})
                  </div>
                  <div className="text-zinc-500 text-[11px] font-mono mt-0.5">
                    등급: {session.tier} | 적립금: {session.points.toLocaleString()}P
                  </div>
                </button>
              )
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 font-mono space-y-1.5">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">서버가 방금 읽은 쿠키 (cookies().get())</span>
              <div className="flex justify-between text-[11px]">
                <span className="text-blue-600 dark:text-blue-400">session-token</span>
                <span className="text-zinc-900 dark:text-zinc-200">
                  {serverState.hasSessionToken ? serverState.sessionTokenPreview : '(없음)'}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-blue-600 dark:text-blue-400">user-role</span>
                <span className="text-zinc-900 dark:text-zinc-200">{serverState.role ?? '(없음)'}</span>
              </div>
            </div>

            <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 font-mono space-y-1.5">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">
                브라우저 JS가 실제로 읽는 쿠키 (document.cookie)
              </span>
              <div className="flex justify-between text-[11px]">
                <span className="text-blue-600 dark:text-blue-400">session-token</span>
                <span className={clientCookies.sessionTokenVisible ? 'text-rose-600' : 'text-emerald-600'}>
                  {clientCookies.sessionTokenVisible ? '노출됨 (오류)' : '차단됨 (HttpOnly)'}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-blue-600 dark:text-blue-400">user-role</span>
                <span className={clientCookies.userRoleVisible ? 'text-emerald-600' : 'text-zinc-400'}>
                  {clientCookies.userRoleVisible ? '노출됨 (정상)' : '(없음)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter isMatched={isMatched} actual={actual} expected={expected} />
    </>
  )
}
