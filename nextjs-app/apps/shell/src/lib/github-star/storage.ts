import { GITHUB_STAR_STORAGE_KEY, GITHUB_STAR_STORAGE_VERSION } from './constants.ts'
import { createEmptyEngagementRecord } from './engagement.ts'
import type { StarEngagementRecord, StarStorageStatus } from './types.ts'

export interface StorageAdapter {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface StoredStarRecordResult {
  record: StarEngagementRecord
  status: StarStorageStatus
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const parsed = new Date(value)
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString() === value
}

function isStarEngagementRecord(value: unknown): value is StarEngagementRecord {
  if (!isRecord(value)) return false
  return (
    value.version === GITHUB_STAR_STORAGE_VERSION &&
    typeof value.visitCount === 'number' &&
    typeof value.activeMs === 'number' &&
    isIsoDate(value.firstSeenAt) &&
    isIsoDate(value.lastActiveTickAt) &&
    (value.promptShownAt === null || isIsoDate(value.promptShownAt)) &&
    (value.dismissedAt === null || isIsoDate(value.dismissedAt)) &&
    typeof value.dismissedForever === 'boolean' &&
    (value.clickedThroughAt === null || isIsoDate(value.clickedThroughAt))
  )
}

export function parseStoredStarRecord(
  raw: string | null,
  now: string,
): StoredStarRecordResult {
  if (raw === null) {
    return { record: createEmptyEngagementRecord(now), status: 'empty' }
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (isStarEngagementRecord(parsed)) {
      return { record: parsed, status: 'ok' }
    }
  } catch {
    // 파싱 오류 시 아래에서 빈 상태로 안전하게 복구합니다.
  }

  return { record: createEmptyEngagementRecord(now), status: 'recovered' }
}

export function readStoredStarRecord(
  storage: StorageAdapter,
  now: string,
): StoredStarRecordResult {
  try {
    return parseStoredStarRecord(storage.getItem(GITHUB_STAR_STORAGE_KEY), now)
  } catch {
    return { record: createEmptyEngagementRecord(now), status: 'unavailable' }
  }
}

export function writeStoredStarRecord(
  storage: StorageAdapter,
  record: StarEngagementRecord,
): boolean {
  try {
    storage.setItem(GITHUB_STAR_STORAGE_KEY, JSON.stringify(record))
    return true
  } catch {
    return false
  }
}
