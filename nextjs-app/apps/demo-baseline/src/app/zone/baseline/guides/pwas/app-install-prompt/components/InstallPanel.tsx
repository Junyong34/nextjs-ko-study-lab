'use client'
import React from 'react'
import { SEGMENT_PATH } from '../constants'
import { diagnoseInstall } from '../lib/diagnose'
import type { ManifestReport } from '../types'
import type { useInstallSignals } from '../hooks/useInstallSignals'
import { ActionButton, Section, StatusRow } from './ui'

interface Props {
  install: ReturnType<typeof useInstallSignals>
  manifest: ManifestReport | null
  swActive: boolean
}

export function InstallPanel({ install, manifest, swActive }: Props) {
  const { env, standalone, promptReady, prompting, installed, outcome, log } = install
  const diagnoses = diagnoseInstall({ env, standalone, manifest, swActive, promptReady, installed })

  return (
    <Section title="① 설치 프롬프트 — beforeinstallprompt / appinstalled / display-mode">
      <div className="flex flex-wrap items-center gap-2">
        <ActionButton tone="primary" disabled={!promptReady} onClick={install.install}>
          앱 설치
        </ActionButton>
        {env?.inFrame && (
          <a
            href={SEGMENT_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-indigo-300 dark:hover:bg-zinc-800"
          >
            새 탭에서 열기 (최상위 문서)
          </a>
        )}
        <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
          {installed
            ? 'appinstalled 수신 — 설치됨'
            : prompting
              ? '설치 대화상자에서 선택을 기다리는 중'
              : promptReady
              ? 'beforeinstallprompt 수신 — 버튼으로 prompt() 호출 가능'
              : env
                ? 'beforeinstallprompt 아직 수신하지 못함(비활성)'
                : '측정 중…'}
          {outcome && ` · 마지막 선택: ${outcome}`}
        </span>
      </div>

      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          설치 불가 원인 점검표 (실측)
        </div>
        <ul className="space-y-1">
          {env ? (
            diagnoses.map((item) => <StatusRow key={item.label} {...item} />)
          ) : (
            <li className="text-[11px] text-zinc-500">브라우저에서 측정 중…</li>
          )}
        </ul>
      </div>

      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">이벤트 로그</div>
        <ol className="max-h-32 space-y-0.5 overflow-auto rounded border border-zinc-200 bg-white p-2 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-950">
          {log.length === 0 ? (
            <li className="text-zinc-400">수신한 이벤트가 아직 없습니다.</li>
          ) : (
            log.map((entry, index) => (
              <li key={index} className="text-zinc-700 dark:text-zinc-300">
                {entry.at} <span className="font-bold">{entry.name}</span>
                {entry.detail && <span className="text-zinc-500"> — {entry.detail}</span>}
              </li>
            ))
          )}
        </ol>
      </div>
    </Section>
  )
}
