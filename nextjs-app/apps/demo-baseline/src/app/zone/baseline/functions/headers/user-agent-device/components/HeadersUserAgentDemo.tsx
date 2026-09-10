import React from 'react'
import type { DeviceType } from '../types'

const DEMO_PATH = '/zone/baseline/functions/headers/user-agent-device'

interface HeadersUserAgentDemoProps {
  userAgent: string
  deviceType: DeviceType
  forcedDevice: DeviceType | null
}

function ToggleLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={`rounded px-2.5 py-1 text-xs font-semibold ${
        active ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
      }`}
    >
      {children}
    </a>
  )
}

export function HeadersUserAgentDemo({ userAgent, deviceType, forcedDevice }: HeadersUserAgentDemoProps) {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">상품 상세 — 무선 노이즈 캔슬링 헤드폰</h4>
          <p className="text-xs text-zinc-500">서버 컴포넌트가 지금 이 요청의 User-Agent를 읽어 아래 뷰를 결정했습니다. (클라이언트 JS 없음)</p>
        </div>
        <div className="flex gap-2">
          <ToggleLink href={DEMO_PATH} active={forcedDevice === null}>
            실제 브라우저 값 사용
          </ToggleLink>
          <ToggleLink href={`${DEMO_PATH}?device=mobile`} active={forcedDevice === 'mobile'}>
            모바일로 보기
          </ToggleLink>
          <ToggleLink href={`${DEMO_PATH}?device=desktop`} active={forcedDevice === 'desktop'}>
            데스크톱으로 보기
          </ToggleLink>
        </div>
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] break-all dark:border-zinc-800 dark:bg-zinc-900/60">
        <span className="font-sans font-semibold text-zinc-500 dark:text-zinc-400">headers().get(&apos;user-agent&apos;) 원본 값: </span>
        {userAgent || '(없음)'}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-zinc-600 dark:text-zinc-400">판별된 기기 타입:</span>
        <span
          className={`rounded px-2 py-0.5 font-bold ${
            deviceType === 'mobile'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
          }`}
        >
          {deviceType}
        </span>
      </div>

      {deviceType === 'mobile' ? (
        <div className="rounded border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300">모바일 뷰</div>
          <button className="mt-2 w-full rounded bg-emerald-600 py-2 text-xs font-bold text-white">바로 구매</button>
          <details className="mt-2 text-xs text-emerald-900 dark:text-emerald-300">
            <summary className="cursor-pointer">상세 스펙 (탭하여 펼치기)</summary>
            <p className="mt-1">노이즈 캔슬링 / 30시간 재생 / USB-C</p>
          </details>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 rounded border border-sky-200 bg-sky-50/60 p-3.5 sm:grid-cols-2 dark:border-sky-900 dark:bg-sky-950/30">
          <div>
            <div className="text-xs font-bold text-sky-900 dark:text-sky-300">데스크톱 뷰 — 상세 스펙 표</div>
            <table className="mt-1.5 w-full text-xs text-sky-900 dark:text-sky-300">
              <tbody>
                <tr><td className="pr-3 text-sky-600 dark:text-sky-400">노이즈 캔슬링</td><td>지원</td></tr>
                <tr><td className="pr-3 text-sky-600 dark:text-sky-400">재생 시간</td><td>30시간</td></tr>
                <tr><td className="pr-3 text-sky-600 dark:text-sky-400">충전 단자</td><td>USB-C</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="text-xs font-bold text-sky-900 dark:text-sky-300">리뷰 사이드바</div>
            <p className="mt-1.5 text-xs text-sky-800 dark:text-sky-400">★★★★★ 4.8 (리뷰 128건)</p>
          </div>
        </div>
      )}
    </div>
  )
}
