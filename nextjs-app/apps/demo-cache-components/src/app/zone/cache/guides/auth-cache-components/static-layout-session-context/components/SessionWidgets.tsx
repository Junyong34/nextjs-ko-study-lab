'use client'

import { useFormStatus } from 'react-dom'
import { useUser } from './UserProvider'
import { loginAction, logoutAction } from '../actions'

const DEMO_ACCOUNTS = [
  { id: 'usr_guest123', label: '김쇼핑 (SILVER)' },
  { id: 'usr_vip999', label: '이우수 (PLATINUM)' },
]

/** 헤더 우측 사용자 배지 — 같은 userPromise를 읽는 첫 번째 소비자 */
export function UserBadge() {
  const { user, requestId, readAt } = useUser()
  return (
    <div
      data-demo-marker="session-ready"
      data-session-request-id={requestId}
      data-session-user={user ? user.name : 'guest'}
      className="text-right"
    >
      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
        {user ? `${user.name}님` : '로그인하지 않음'}
      </p>
      <p className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
        세션 요청 ID {requestId} · {readAt}
      </p>
    </div>
  )
}

function SubmitButton({ label, variant }: { label: string; variant: 'primary' | 'outline' }) {
  const { pending } = useFormStatus()
  const style =
    variant === 'primary'
      ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
      : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${style}`}
    >
      {pending ? '처리 중...' : label}
    </button>
  )
}

/** 사이드 계정 패널 — 같은 userPromise를 읽는 두 번째 소비자 (Promise는 한 번만 생성) */
export function AccountPanel() {
  const { user, requestId } = useUser()

  if (!user) {
    return (
      <div className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">데모 계정으로 로그인</p>
        <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          Server Action이 이 데모 경로 전용 httpOnly 쿠키에 사용자 ID만 저장합니다.
        </p>
        {DEMO_ACCOUNTS.map((account) => (
          <form key={account.id} action={loginAction}>
            <input type="hidden" name="userId" value={account.id} />
            <SubmitButton label={`${account.label} 로그인`} variant="outline" />
          </form>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{user.name}님의 혜택</p>
      <dl className="grid grid-cols-2 gap-1 text-[11px] text-zinc-600 dark:text-zinc-400">
        <dt>등급</dt>
        <dd className="text-right font-mono text-zinc-900 dark:text-zinc-100">{user.tier}</dd>
        <dt>포인트</dt>
        <dd className="text-right font-mono text-zinc-900 dark:text-zinc-100">
          {user.points.toLocaleString('ko-KR')}P
        </dd>
        <dt>세션 요청 ID</dt>
        <dd className="text-right font-mono text-zinc-900 dark:text-zinc-100">{requestId}</dd>
      </dl>
      <form action={logoutAction}>
        <SubmitButton label="로그아웃" variant="primary" />
      </form>
    </div>
  )
}
