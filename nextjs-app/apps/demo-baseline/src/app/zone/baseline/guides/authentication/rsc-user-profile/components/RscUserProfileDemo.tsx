'use client'

import React, { useTransition } from 'react'
import type { UserProfile, SessionRole } from '../types'
import { switchSessionRoleAction } from '../actions'

interface RscUserProfileDemoProps {
  initialProfile: UserProfile
}

export function RscUserProfileDemo({ initialProfile }: RscUserProfileDemoProps) {
  const [profile, setProfile] = React.useState<UserProfile>(initialProfile)
  const [isPending, startTransition] = useTransition()

  const handleSwitchRole = (role: SessionRole) => {
    startTransition(async () => {
      await switchSessionRoleAction(role)
      // 동적 시뮬레이션 즉각 반영
      if (role === 'vip') {
        setProfile({
          id: 'user-01',
          name: '홍길동',
          grade: 'VIP',
          points: 15200,
          couponCount: 3,
          email: 'gildong.hong@shop.com',
          renderedAt: new Date().toISOString(),
        })
      } else if (role === 'regular') {
        setProfile({
          id: 'user-02',
          name: '이몽룡',
          grade: 'REGULAR',
          points: 3500,
          couponCount: 1,
          email: 'mongryong@shop.com',
          renderedAt: new Date().toISOString(),
        })
      } else {
        setProfile({
          id: 'guest',
          name: '비회원 게스트',
          grade: 'GUEST',
          points: 0,
          couponCount: 0,
          email: 'guest@shop.com',
          renderedAt: new Date().toISOString(),
        })
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 세션 쿠키 제어 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-xs">
          <span className="font-semibold text-zinc-600 dark:text-zinc-400">서버 세션 제어:</span>
          <span className="ml-2 font-mono text-zinc-800 dark:text-zinc-200">
            현재 쿠키 등급 = <strong className="text-blue-600 dark:text-blue-400">{profile.grade}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleSwitchRole('vip')}
            disabled={isPending || profile.grade === 'VIP'}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
          >
            VIP 세션
          </button>
          <button
            type="button"
            onClick={() => handleSwitchRole('regular')}
            disabled={isPending || profile.grade === 'REGULAR'}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer"
          >
            일반 회원
          </button>
          <button
            type="button"
            onClick={() => handleSwitchRole('guest')}
            disabled={isPending || profile.grade === 'GUEST'}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 2. 서버 사이드 렌더링 프로필 카드 */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-3 flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              서버 사이드 렌더링 회원 정보:
            </h4>
          </div>
          <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            0 KB Client Bundle (Zero JS)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div className="space-y-1.5 rounded-md bg-zinc-50 p-3 font-mono dark:bg-zinc-900">
            <div className="text-zinc-500">기본 정보:</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">
              • 회원명: {profile.name} ({profile.grade === 'VIP' ? 'VIP 등급' : profile.grade === 'REGULAR' ? '일반 등급' : '비회원'})
            </div>
            <div className="text-zinc-600 dark:text-zinc-400">
              • 이메일: {profile.email}
            </div>
          </div>

          <div className="space-y-1.5 rounded-md bg-zinc-50 p-3 font-mono dark:bg-zinc-900">
            <div className="text-zinc-500">보유 혜택:</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">
              • 적립금: {profile.points.toLocaleString()} P | 쿠폰: {profile.couponCount}장
            </div>
            <div className="text-zinc-600 dark:text-zinc-400">
              • 렌더링 타임: {profile.renderedAt.split('T')[1]?.slice(0, 8)}
            </div>
          </div>
        </div>
      </div>

      {/* 3. RSC 보안 이점 설명 박스 */}
      <div className="rounded-md border border-blue-100 bg-blue-50/50 p-3 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300">
        <strong className="font-semibold">보안 핵심: </strong>
        회원 DB 조회 쿼리와 세션 시크릿 키는 온전히 서버(RSC)에서만 실행되며, 클라이언트 브라우저에는 완성된 HTML과 직렬화된 최소 값만 안전하게 전달됩니다.
      </div>
    </div>
  )
}
