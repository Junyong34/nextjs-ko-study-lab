import assert from 'node:assert/strict'
import test from 'node:test'
import { verifyStatePreservation, resetState, DEFAULT_QUERY } from './verification.ts'

const baseline = {
  query: '무선 키보드',
  pathname: '/zone/baseline/file-conventions/layout/state-preservation',
  category: 'books',
  mountId: 'mount-1',
}

const movedPathname = '/zone/baseline/file-conventions/layout/state-preservation/electronics'

function snapshot(overrides = {}) {
  return {
    mountId: 'mount-1',
    pathname: movedPathname,
    query: '무선 키보드',
    reportedPathname: movedPathname,
    reportedCategory: 'electronics',
    ...overrides,
  }
}

test('no baseline recorded yet is pending, not a pass', () => {
  const result = verifyStatePreservation(snapshot(), null)
  assert.equal(result.isMatched, undefined)
})

test('staying on the baseline pathname (no navigation) is pending', () => {
  const result = verifyStatePreservation(
    snapshot({ pathname: baseline.pathname, reportedPathname: baseline.pathname, reportedCategory: baseline.category }),
    baseline,
  )
  assert.equal(result.isMatched, undefined)
})

test('a different mount ID after "navigating" fails even though the category changed', () => {
  const result = verifyStatePreservation(snapshot({ mountId: 'mount-2' }), baseline)
  assert.equal(result.isMatched, false)
  assert.match(result.reason, /mount/i)
})

test('reported content has not caught up with the new pathname yet is pending', () => {
  const result = verifyStatePreservation(
    snapshot({ reportedPathname: baseline.pathname, reportedCategory: baseline.category }),
    baseline,
  )
  assert.equal(result.isMatched, undefined)
})

test('actual page content still reports the baseline category is a mismatch', () => {
  const result = verifyStatePreservation(snapshot({ reportedCategory: 'books' }), baseline)
  assert.equal(result.isMatched, false)
})

test('changing the query after navigating is a mismatch', () => {
  const result = verifyStatePreservation(snapshot({ query: '다른 검색어' }), baseline)
  assert.equal(result.isMatched, false)
  assert.match(result.reason, /검색어/)
})

test('same mount, real category move, preserved query succeeds', () => {
  const result = verifyStatePreservation(snapshot(), baseline)
  assert.equal(result.isMatched, true)
})

test('restoring the original query after a mismatch succeeds again', () => {
  const mismatched = verifyStatePreservation(snapshot({ query: '다른 검색어' }), baseline)
  assert.equal(mismatched.isMatched, false)

  const restored = verifyStatePreservation(snapshot({ query: baseline.query }), baseline)
  assert.equal(restored.isMatched, true)
})

test('resetState clears the baseline and returns the default query', () => {
  assert.deepEqual(resetState(), { query: DEFAULT_QUERY, baseline: null })
})
