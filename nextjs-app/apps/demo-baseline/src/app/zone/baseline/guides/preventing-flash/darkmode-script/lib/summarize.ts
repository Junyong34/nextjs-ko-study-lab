import { DEFAULT_THEME } from './theme'
import type { FrameSegment, ProbeResult, Theme } from '../types'

export interface ProbeSummary {
  /** 저장값을 스크립트·React와 같은 규칙으로 판정한 목표 테마 */
  target: Theme
  firstFrame: FrameSegment | null
  finalFrame: FrameSegment | null
  /** 목표 테마가 처음 그려지기 전까지 다른 테마로 그려진 rAF 프레임 수 */
  wrongFrames: number
  /** 잘못된 테마가 화면에 머문 시간(ms) — 첫 프레임부터 목표 테마 첫 프레임까지 */
  wrongMs: number
  fcp: number | null
  scriptAt: ProbeResult['scriptAt']
  hydratedAt: number | null
  themeAtHydration: string | null
  errors: string[]
  done: boolean
}

export function summarize(probe: ProbeResult): ProbeSummary {
  const target: Theme = probe.stored === 'light' || probe.stored === 'dark' ? probe.stored : DEFAULT_THEME
  const firstFrame = probe.frames[0] ?? null
  const finalFrame = probe.frames[probe.frames.length - 1] ?? null
  const hitIndex = probe.frames.findIndex((f) => f.theme === target)
  const before = hitIndex === -1 ? probe.frames : probe.frames.slice(0, hitIndex)
  const wrongFrames = before.reduce((sum, f) => sum + f.count, 0)
  const wrongMs = firstFrame && hitIndex > 0 ? probe.frames[hitIndex].t - firstFrame.t : 0
  const fcp = probe.paints.find((p) => p.name === 'first-contentful-paint')?.t ?? null
  return {
    target,
    firstFrame,
    finalFrame,
    wrongFrames,
    wrongMs,
    fcp,
    scriptAt: probe.scriptAt,
    hydratedAt: probe.hydratedAt,
    themeAtHydration: probe.themeAtHydration,
    errors: probe.errors,
    done: probe.done,
  }
}

export const ms = (v: number | null | undefined) => (v === null || v === undefined ? '-' : `${v.toFixed(1)}ms`)

export const frameText = (f: FrameSegment | null) => (f ? `${f.theme} / ${f.bg} @ ${ms(f.t)}` : '-')
