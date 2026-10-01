'use client'
import React from 'react'
import { MANIFEST_URL } from '../constants'
import type { useManifestCheck } from '../hooks/useManifestCheck'
import { ActionButton, Section, StatusRow } from './ui'

export function ManifestPanel({ manifest }: { manifest: ReturnType<typeof useManifestCheck> }) {
  const { report, running, run } = manifest
  return (
    <Section title="② manifest 검사 — 실제 응답을 fetch로 읽어 필드 검증">
      <div className="flex flex-wrap items-center gap-2">
        <ActionButton onClick={run} disabled={running}>
          {running ? '검사 중…' : 'manifest 다시 검사'}
        </ActionButton>
        <a
          href={MANIFEST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] text-indigo-700 underline dark:text-indigo-300"
        >
          {MANIFEST_URL}
        </a>
      </div>
      {report ? (
        <ul className="space-y-1">
          {report.checks.map((item) => (
            <StatusRow key={item.id} ok={item.ok} label={item.label} detail={item.detail} />
          ))}
        </ul>
      ) : (
        <p className="text-[11px] text-zinc-500">manifest를 불러오는 중…</p>
      )}
    </Section>
  )
}
