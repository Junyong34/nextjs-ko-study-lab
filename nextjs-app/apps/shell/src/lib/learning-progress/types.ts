import type { LEARNING_PROGRESS_VERSION } from './constants.ts'

export type LearningItemKind = 'document' | 'demo'

export interface CompletedRecord {
  completedAt: string
}

export interface LearningProgress {
  version: typeof LEARNING_PROGRESS_VERSION
  documents: Record<string, CompletedRecord>
  demos: Record<string, CompletedRecord>
  updatedAt: string
}

export interface LearningDocumentItem {
  kind: 'document'
  key: string
  title: string
  url: string
  category: string
}

export interface LearningDemoItem {
  kind: 'demo'
  key: string
  title: string
  url: string
  category: string
  docPath: string
}

export interface LearningInventory {
  documents: LearningDocumentItem[]
  demos: LearningDemoItem[]
}

export type LearningStorageStatus = 'empty' | 'ok' | 'recovered' | 'unavailable'
