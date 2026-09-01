import type { GITHUB_STAR_STORAGE_VERSION } from './constants.ts'

export interface StarEngagementRecord {
  version: typeof GITHUB_STAR_STORAGE_VERSION
  visitCount: number
  activeMs: number
  firstSeenAt: string
  lastActiveTickAt: string
  promptShownAt: string | null
  dismissedAt: string | null
  dismissedForever: boolean
  clickedThroughAt: string | null
}

export type PromptPosition =
  | 'bottom-right'
  | 'bottom-center'
  | 'top-right'
  | 'center-right'

export interface GithubStarConfig {
  repoUrl: string
  minActiveMs: number
  minVisitCount: number
  cooldownDays: number
  position: PromptPosition
}

export type StarStorageStatus = 'empty' | 'ok' | 'recovered' | 'unavailable'
