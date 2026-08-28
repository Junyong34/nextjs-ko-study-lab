import { LEARNING_PROGRESS_VERSION } from './constants.ts'
import type {
  LearningDemoItem,
  LearningDocumentItem,
  LearningItemKind,
  LearningProgress,
} from './types.ts'

type LearningProgressItem = LearningDocumentItem | LearningDemoItem

export function createEmptyProgress(now: string): LearningProgress {
  return {
    version: LEARNING_PROGRESS_VERSION,
    documents: {},
    demos: {},
    updatedAt: now,
  }
}

export function isLearningItemCompleted(
  progress: LearningProgress,
  kind: LearningItemKind,
  key: string,
): boolean {
  const records = kind === 'document' ? progress.documents : progress.demos
  return key in records
}

export function getLearningProgressSummary(
  items: readonly LearningProgressItem[],
  isCompleted: (item: LearningProgressItem) => boolean,
): { completedCount: number; totalCount: number } {
  return {
    completedCount: items.filter(isCompleted).length,
    totalCount: items.length,
  }
}

export function toggleProgress(
  progress: LearningProgress,
  kind: LearningItemKind,
  key: string,
  now: string,
): LearningProgress {
  const recordName = kind === 'document' ? 'documents' : 'demos'
  const records = { ...progress[recordName] }

  if (key in records) delete records[key]
  else records[key] = { completedAt: now }

  return { ...progress, [recordName]: records, updatedAt: now }
}

export function resetProgress(
  _progress: LearningProgress,
  now: string,
): LearningProgress {
  return createEmptyProgress(now)
}
