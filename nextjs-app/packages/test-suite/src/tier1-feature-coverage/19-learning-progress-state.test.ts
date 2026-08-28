import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  createEmptyProgress,
  getLearningProgressSummary,
  isLearningItemCompleted,
  resetProgress,
  toggleProgress,
} from '../../../../apps/shell/src/lib/learning-progress/state.ts'
import type {
  LearningDocumentItem,
} from '../../../../apps/shell/src/lib/learning-progress/types.ts'
import { parseStoredProgress, readStoredProgress, writeStoredProgress } from '../../../../apps/shell/src/lib/learning-progress/storage.ts'

const NOW = '2026-08-26T01:02:03.000Z'

describe('학습 기록 상태', () => {
  it('문서와 데모를 독립적으로 토글하고 해제 시 레코드를 삭제한다', () => {
    let progress = createEmptyProgress(NOW)
    progress = toggleProgress(progress, 'document', 'docs/a.md', NOW)
    assert.deepEqual(progress.documents['docs/a.md'], { completedAt: NOW })
    assert.deepEqual(progress.demos, {})

    progress = toggleProgress(progress, 'demo', 'demo/a', NOW)
    progress = toggleProgress(progress, 'document', 'docs/a.md', NOW)
    assert.equal(progress.documents['docs/a.md'], undefined)
    assert.deepEqual(progress.demos['demo/a'], { completedAt: NOW })
  })

  it('전체 초기화는 문서와 데모 기록을 모두 비운다', () => {
    const populated = {
      ...createEmptyProgress(NOW),
      documents: { a: { completedAt: NOW } },
      demos: { b: { completedAt: NOW } },
    }

    assert.deepEqual(resetProgress(populated, NOW), createEmptyProgress(NOW))
  })

  it('현재 탭의 학습 대상만 기준으로 완료 수와 전체 수를 계산한다', () => {
    const documentItems: LearningDocumentItem[] = [
      {
        kind: 'document',
        key: 'docs/a.md',
        title: '문서 A',
        url: '/docs/a',
        category: '시작하기',
      },
      {
        kind: 'document',
        key: 'docs/b.md',
        title: '문서 B',
        url: '/docs/b',
        category: '시작하기',
      },
    ]
    const progress = {
      ...createEmptyProgress(NOW),
      documents: { 'docs/a.md': { completedAt: NOW } },
      demos: { 'demo/unrelated': { completedAt: NOW } },
    }

    assert.deepEqual(
      getLearningProgressSummary(documentItems, (item) =>
        isLearningItemCompleted(progress, item.kind, item.key),
      ),
      { completedCount: 1, totalCount: 2 },
    )
  })
})

describe('학습 기록 저장소', () => {
  it('빈 값, 잘못된 JSON, 잘못된 버전을 빈 상태로 복구한다', () => {
    assert.equal(parseStoredProgress(null, NOW).status, 'empty')
    assert.equal(parseStoredProgress('{', NOW).status, 'recovered')
    assert.equal(parseStoredProgress(JSON.stringify({ version: 2 }), NOW).status, 'recovered')
  })

  it('ISO 날짜와 레코드 모양이 유효한 version 1 데이터만 허용한다', () => {
    const valid = {
      version: 1,
      documents: { 'docs/a.md': { completedAt: NOW } },
      demos: {},
      updatedAt: NOW,
    }
    assert.deepEqual(parseStoredProgress(JSON.stringify(valid), NOW), {
      progress: valid,
      status: 'ok',
    })
    assert.equal(
      parseStoredProgress(JSON.stringify({ ...valid, updatedAt: 'yesterday' }), NOW).status,
      'recovered',
    )
  })

  it('접근과 쓰기가 실패해도 예외를 전파하지 않는다', () => {
    const blocked = {
      getItem(): string | null {
        throw new Error('blocked')
      },
      setItem(): void {
        throw new Error('blocked')
      },
    }

    assert.equal(readStoredProgress(blocked, NOW).status, 'unavailable')
    assert.equal(writeStoredProgress(blocked, createEmptyProgress(NOW)), false)
  })
})
