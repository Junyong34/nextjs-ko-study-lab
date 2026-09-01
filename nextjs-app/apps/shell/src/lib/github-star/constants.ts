import type { GithubStarConfig } from './types.ts'

export const GITHUB_STAR_STORAGE_KEY = 'study_github_star'
export const GITHUB_STAR_SESSION_KEY = 'study_github_star_session_counted'
export const GITHUB_STAR_STORAGE_VERSION = 1 as const

export const GITHUB_STAR_CONFIG: GithubStarConfig = {
  repoUrl: 'https://github.com/Junyong34/nextjs-ko-study-lab',
  minActiveMs: 60 * 60 * 1000, // 1시간 (실제 탭 활성 체류 시간)
  minVisitCount: 3, // 3회 이상 방문
  cooldownDays: 14, // 닫은 뒤 14일 쿨다운
  position: 'bottom-right',
}

export const ENGAGEMENT_TICK_INTERVAL_MS = 5000 // 5초 단위 메모리 틱
export const ENGAGEMENT_SAVE_INTERVAL_MS = 15000 // 15초 주기 스토리지 배치 저장
