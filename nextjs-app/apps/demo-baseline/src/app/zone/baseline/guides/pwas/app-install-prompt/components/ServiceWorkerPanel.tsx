'use client'
import React from 'react'
import { SEGMENT_PATH, SW_URL } from '../constants'
import { WIDE_SCOPE, type useServiceWorkerLab } from '../hooks/useServiceWorkerLab'
import { ActionButton, Section, StatusRow } from './ui'

export function ServiceWorkerPanel({ sw, supported }: { sw: ReturnType<typeof useServiceWorkerLab>; supported: boolean }) {
  const { snapshot, register, wide, pong } = sw
  return (
    <Section title="③ 서비스 워커 — Route Handler로 서빙한 sw.js 등록과 scope 제약">
      <div className="flex flex-wrap items-center gap-2">
        <ActionButton tone="primary" disabled={!supported} onClick={sw.registerWorker}>
          서비스 워커 등록
        </ActionButton>
        <ActionButton disabled={!supported} onClick={sw.tryWideScope}>
          부모 scope로 등록 시도
        </ActionButton>
        <ActionButton disabled={!supported || !snapshot.controlled} onClick={sw.ping}>
          워커에 ping
        </ActionButton>
        <ActionButton disabled={!supported} onClick={sw.unregister}>
          등록 해제
        </ActionButton>
      </div>
      <p className="font-mono text-[11px] text-zinc-500">
        스크립트 {SW_URL} · 허용 scope {SEGMENT_PATH} · 시도할 부모 scope {WIDE_SCOPE}
      </p>
      {!supported && (
        <p className="text-[11px] text-rose-600 dark:text-rose-400">
          navigator.serviceWorker가 없습니다(비보안 컨텍스트이거나 미지원 브라우저).
        </p>
      )}
      <ul className="space-y-1">
        <StatusRow
          ok={register ? register.ok : null}
          label="등록(register)"
          detail={register?.detail ?? '아직 시도하지 않음'}
        />
        <StatusRow
          ok={snapshot.state === 'activated' ? true : null}
          label="활성 상태"
          detail={snapshot.scope ? `scope ${snapshot.scope} · active.state = ${snapshot.state ?? '-'}` : '이 경로를 제어하는 등록 없음'}
        />
        <StatusRow
          ok={snapshot.controlled ? true : null}
          label="이 페이지를 제어(controller)"
          detail={snapshot.controlled ? 'navigator.serviceWorker.controller 있음' : 'controller 없음 — 등록 직후이거나 해제 후 새로고침 전'}
        />
        <StatusRow
          ok={wide ? wide.ok : null}
          label="부모 scope 등록 거부"
          detail={wide?.detail ?? '아직 시도하지 않음'}
        />
        <StatusRow ok={pong ? pong.startsWith('pong') : null} label="워커 응답" detail={pong ?? '아직 시도하지 않음'} />
      </ul>
    </Section>
  )
}
