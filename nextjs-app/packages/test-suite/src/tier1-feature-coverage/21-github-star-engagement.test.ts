import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  addActiveDuration,
  createEmptyEngagementRecord,
  incrementVisitCount,
  isEligibleForStarPrompt,
  recordDismiss,
  recordDismissForever,
  recordPromptShown,
  recordStarClickThrough,
} from '../../../../apps/shell/src/lib/github-star/engagement.ts'
import {
  parseStoredStarRecord,
  readStoredStarRecord,
  writeStoredStarRecord,
} from '../../../../apps/shell/src/lib/github-star/storage.ts'
import type { GithubStarConfig } from '../../../../apps/shell/src/lib/github-star/types.ts'

const TEST_CONFIG: GithubStarConfig = {
  repoUrl: 'https://github.com/Junyong34/nextjs-ko-study-lab',
  minActiveMs: 60 * 60 * 1000, // 1시간
  minVisitCount: 3, // 3회
  cooldownDays: 14,
  position: 'bottom-right',
}

const NOW = '2026-09-01T00:00:00.000Z'

describe('GitHub Star 참여도 계산 및 노출 조건 (Engagement)', () => {
  it('초기 생성 레코드는 참여도 임계값 미달로 노출되지 않는다', () => {
    const record = createEmptyEngagementRecord(NOW)
    assert.equal(isEligibleForStarPrompt(record, TEST_CONFIG, NOW), false)
  })

  it('누적 활성 시간이 1시간(minActiveMs) 이상이면 노출 대상이 된다', () => {
    let record = createEmptyEngagementRecord(NOW)
    record = addActiveDuration(record, 60 * 60 * 1000, NOW)
    assert.equal(record.activeMs, 3600000)
    assert.equal(isEligibleForStarPrompt(record, TEST_CONFIG, NOW), true)
  })

  it('방문 횟수가 3회(minVisitCount) 이상이면 활성 시간이 적어도 노출 대상이 된다', () => {
    let record = createEmptyEngagementRecord(NOW)
    record = incrementVisitCount(record, NOW) // 2회
    record = incrementVisitCount(record, NOW) // 3회
    assert.equal(record.visitCount, 3)
    assert.equal(isEligibleForStarPrompt(record, TEST_CONFIG, NOW), true)
  })

  it('Star 링크를 클릭하여 clickedThroughAt이 기록되면 영구 미노출된다', () => {
    let record = createEmptyEngagementRecord(NOW)
    record = addActiveDuration(record, 60 * 60 * 1000, NOW)
    assert.equal(isEligibleForStarPrompt(record, TEST_CONFIG, NOW), true)

    record = recordStarClickThrough(record, NOW)
    assert.equal(record.clickedThroughAt, NOW)
    assert.equal(isEligibleForStarPrompt(record, TEST_CONFIG, NOW), false)
  })

  it('"다시 보지 않기"를 선택하면 영구 미노출된다', () => {
    let record = createEmptyEngagementRecord(NOW)
    record = addActiveDuration(record, 60 * 60 * 1000, NOW)
    assert.equal(isEligibleForStarPrompt(record, TEST_CONFIG, NOW), true)

    record = recordDismissForever(record, NOW)
    assert.equal(record.dismissedForever, true)
    assert.equal(isEligibleForStarPrompt(record, TEST_CONFIG, NOW), false)
  })

  it('X(닫기)를 누른 경우 14일 쿨다운 동안은 미노출되고, 14일 이후 다시 노출된다', () => {
    let record = createEmptyEngagementRecord(NOW)
    record = addActiveDuration(record, 60 * 60 * 1000, NOW)
    record = recordDismiss(record, NOW)
    assert.equal(record.dismissedAt, NOW)

    // 7일 경과 시점 -> 쿨다운 중이므로 미노출
    const after7Days = '2026-09-08T00:00:00.000Z'
    assert.equal(isEligibleForStarPrompt(record, TEST_CONFIG, after7Days), false)

    // 14일 1초 경과 시점 -> 쿨다운 만료되어 다시 노출
    const after14Days = '2026-09-15T00:00:01.000Z'
    assert.equal(isEligibleForStarPrompt(record, TEST_CONFIG, after14Days), true)
  })

  it('첫 노출 시각(promptShownAt)을 정확히 기록한다', () => {
    const record = createEmptyEngagementRecord(NOW)
    assert.equal(record.promptShownAt, null)

    const updated = recordPromptShown(record, NOW)
    assert.equal(updated.promptShownAt, NOW)

    // 이미 기록된 경우 덮어쓰지 않음
    const updatedAgain = recordPromptShown(updated, '2026-09-02T00:00:00.000Z')
    assert.equal(updatedAgain.promptShownAt, NOW)
  })
})

describe('GitHub Star 스토리지 입출력 및 파싱/복구', () => {
  it('스토리지에 값이 없을 때(null) 빈 레코드를 반환한다', () => {
    const result = parseStoredStarRecord(null, NOW)
    assert.equal(result.status, 'empty')
    assert.equal(result.record.visitCount, 1)
    assert.equal(result.record.activeMs, 0)
  })

  it('잘못된 JSON 문자열 또는 잘못된 버전일 경우 빈 상태로 안전하게 복구한다', () => {
    assert.equal(parseStoredStarRecord('{invalid json', NOW).status, 'recovered')
    assert.equal(
      parseStoredStarRecord(JSON.stringify({ version: 999 }), NOW).status,
      'recovered',
    )
  })

  it('유효한 스토리지 데이터를 정상 파싱한다', () => {
    const valid = {
      version: 1,
      visitCount: 5,
      activeMs: 4000000,
      firstSeenAt: NOW,
      lastActiveTickAt: NOW,
      promptShownAt: NOW,
      dismissedAt: null,
      dismissedForever: false,
      clickedThroughAt: null,
    }
    const result = parseStoredStarRecord(JSON.stringify(valid), NOW)
    assert.equal(result.status, 'ok')
    assert.deepEqual(result.record, valid)
  })

  it('스토리지 접근 및 쓰기 실패 시 예외를 전파하지 않고 안전하게 처리한다', () => {
    const blockedStorage = {
      getItem(): string | null {
        throw new Error('localStorage is blocked')
      },
      setItem(): void {
        throw new Error('localStorage is blocked')
      },
    }

    const readResult = readStoredStarRecord(blockedStorage, NOW)
    assert.equal(readResult.status, 'unavailable')
    assert.equal(readResult.record.visitCount, 1)

    const writeResult = writeStoredStarRecord(
      blockedStorage,
      createEmptyEngagementRecord(NOW),
    )
    assert.equal(writeResult, false)
  })
})
