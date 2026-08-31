import React from 'react'
import type { UserProfile } from '../types'
import { SessionSwitcher } from './SessionSwitcher'

interface RscUserProfileDemoProps {
  profile: UserProfile
}

// 이 컴포넌트는 서버 컴포넌트다('use client' 없음) — 프로필 카드는 실제로 클라이언트 JS 없이 렌더링된다.
export function RscUserProfileDemo({ profile }: RscUserProfileDemoProps) {
  return (
    <div className="space-y-4">
      <SessionSwitcher currentGrade={profile.grade} />

      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-3 flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">서버 사이드 렌더링 회원 정보 (이 카드는 서버 컴포넌트):</h4>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div className="space-y-1.5 rounded-md bg-zinc-50 p-3 font-mono dark:bg-zinc-900">
            <div className="text-zinc-500">기본 정보:</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">
              • 회원명: {profile.name} ({profile.grade === 'VIP' ? 'VIP 등급' : profile.grade === 'REGULAR' ? '일반 등급' : '비회원'})
            </div>
            <div className="text-zinc-600 dark:text-zinc-400">• 이메일: {profile.email}</div>
          </div>
          <div className="space-y-1.5 rounded-md bg-zinc-50 p-3 font-mono dark:bg-zinc-900">
            <div className="text-zinc-500">보유 혜택:</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">
              • 적립금: {profile.points.toLocaleString()} P | 쿠폰: {profile.couponCount}장
            </div>
            <div className="text-zinc-600 dark:text-zinc-400">• 렌더링 타임: {profile.renderedAt.split('T')[1]?.slice(0, 8)}</div>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-blue-100 bg-blue-50/50 p-3 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300">
        <strong className="font-semibold">보안 핵심: </strong>
        회원 DB 조회 쿼리와 세션 시크릿 키는 온전히 서버(RSC)에서만 실행되며, 이 프로필 카드 자체는 클라이언트 JS 없이 렌더링됩니다(세션 전환 버튼만 별도 클라이언트 컴포넌트입니다).
      </div>
    </div>
  )
}
