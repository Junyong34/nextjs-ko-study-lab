'use client'
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { resetManifestThemeAction, setManifestThemeAction } from '../actions'
import { MANIFEST_ENDPOINT, THEME_PRESETS } from '../theme-presets'
import type { ManifestFetchResult } from '../types'
import { VerificationFooter } from './VerificationFooter'

export interface MetadataManifestDemoProps {
  /** 페이지(Server Component)가 cookies()로 이미 읽어온 실제 초기값 */
  initialPresetId: string
}

export function MetadataManifestDemo({ initialPresetId }: MetadataManifestDemoProps) {
  const [selectedPresetId, setSelectedPresetId] = useState(initialPresetId)
  const [isApplying, startApplyTransition] = useTransition()
  const [isFetching, setIsFetching] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)
  const [fetchResult, setFetchResult] = useState<ManifestFetchResult | null>(null)

  const requestManifest = useCallback(async (presetId: string) => {
    setIsFetching(true)
    try {
      const res = await fetch(MANIFEST_ENDPOINT, { cache: 'no-store' })
      const rawText = await res.text()
      let parsed: ManifestFetchResult['manifest'] = null
      try {
        parsed = JSON.parse(rawText)
      } catch {
        parsed = null
      }
      setFetchResult({
        presetId,
        requestedUrl: MANIFEST_ENDPOINT,
        status: res.status,
        contentType: res.headers.get('content-type'),
        cacheControl: res.headers.get('cache-control'),
        manifest: parsed,
        rawText,
        fetchedAt: new Date().toLocaleTimeString('ko-KR'),
      })
    } catch (err: unknown) {
      setFetchResult({
        presetId,
        requestedUrl: MANIFEST_ENDPOINT,
        status: null,
        contentType: null,
        cacheControl: null,
        manifest: null,
        rawText: String(err),
        fetchedAt: new Date().toLocaleTimeString('ko-KR'),
      })
    } finally {
      setIsFetching(false)
      setHasFetched(true)
    }
  }, [])

  // 최초 진입 시에도 서버가 실제로 어떤 매니페스트를 응답하는지 한 번 실측해 보여준다.
  useEffect(() => {
    requestManifest(initialPresetId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const applyPreset = (presetId: string) => {
    if (isApplying) return
    startApplyTransition(async () => {
      await setManifestThemeAction(presetId)
      setSelectedPresetId(presetId)
    })
  }

  const reset = async () => {
    await resetManifestThemeAction()
    setSelectedPresetId(THEME_PRESETS[0].id)
    await requestManifest(THEME_PRESETS[0].id)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex flex-wrap gap-2">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                disabled={isApplying}
                aria-pressed={selectedPresetId === preset.id}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-semibold shadow-2xs transition disabled:opacity-50 ${
                  selectedPresetId === preset.id
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                    : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border border-black/10"
                  style={{ backgroundColor: preset.themeColor }}
                />
                {preset.label}
              </button>
            ))}
          </div>
          <DemoResetButton onReset={reset} label="쿠키/프리셋 초기화" />
        </div>

        <div className="overflow-hidden rounded-md border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">GET</span>
              <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                {MANIFEST_ENDPOINT}
              </span>
            </div>
            <button
              type="button"
              onClick={() => requestManifest(selectedPresetId)}
              disabled={isFetching}
              className="cursor-pointer rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-50"
            >
              {isFetching ? '요청 전송 중...' : 'manifest.webmanifest 다시 요청'}
            </button>
          </div>

          <pre className="max-h-72 overflow-y-auto bg-zinc-50/30 p-3.5 font-mono text-xs leading-relaxed text-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-200">
            {fetchResult
              ? fetchResult.manifest
                ? JSON.stringify(fetchResult.manifest, null, 2)
                : fetchResult.rawText
              : '대기 중: 위 버튼을 눌러 실제 manifest.webmanifest 응답을 요청하세요.'}
          </pre>
        </div>
      </div>

      <VerificationFooter
        selectedPresetId={selectedPresetId}
        fetchResult={fetchResult}
        hasFetched={hasFetched}
        isFetching={isFetching}
      />
    </div>
  )
}
