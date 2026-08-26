import { LEARNING_PROGRESS_STORAGE_KEY, LEARNING_PROGRESS_VERSION } from './constants.ts'
import { createEmptyProgress } from './state.ts'
import type {
  CompletedRecord,
  LearningProgress,
  LearningStorageStatus,
} from './types.ts'

export interface LearningProgressStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface StoredProgressResult {
  progress: LearningProgress
  status: LearningStorageStatus
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const parsed = new Date(value)
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString() === value
}

function isCompletedRecords(value: unknown): value is Record<string, CompletedRecord> {
  if (!isRecord(value)) return false
  return Object.values(value).every(
    (record) => isRecord(record) && isIsoDate(record.completedAt),
  )
}

function isLearningProgress(value: unknown): value is LearningProgress {
  return (
    isRecord(value) &&
    value.version === LEARNING_PROGRESS_VERSION &&
    isCompletedRecords(value.documents) &&
    isCompletedRecords(value.demos) &&
    isIsoDate(value.updatedAt)
  )
}

export function parseStoredProgress(
  raw: string | null,
  now: string,
): StoredProgressResult {
  if (raw === null) return { progress: createEmptyProgress(now), status: 'empty' }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (isLearningProgress(parsed)) return { progress: parsed, status: 'ok' }
  } catch {
    // 아래에서 빈 상태로 복구합니다.
  }

  return { progress: createEmptyProgress(now), status: 'recovered' }
}

export function readStoredProgress(
  storage: LearningProgressStorage,
  now: string,
): StoredProgressResult {
  try {
    return parseStoredProgress(storage.getItem(LEARNING_PROGRESS_STORAGE_KEY), now)
  } catch {
    return { progress: createEmptyProgress(now), status: 'unavailable' }
  }
}

export function writeStoredProgress(
  storage: LearningProgressStorage,
  progress: LearningProgress,
): boolean {
  try {
    storage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify(progress))
    return true
  } catch {
    return false
  }
}
