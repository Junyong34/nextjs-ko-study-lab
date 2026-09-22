import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createFeedbackStore, FEEDBACK_STORAGE_KEY } from '../../../../apps/shell/src/lib/analytics/feedback.ts'

test('feedback stores the first response per document across store recreation', () => {
  const values = new Map<string, string>()
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
  const first = createFeedbackStore(() => storage)
  assert.equal(first.submit('doc/a', 'helpful'), true)
  assert.equal(first.submit('doc/a', 'unhelpful'), false)
  const reloaded = createFeedbackStore(() => storage)
  assert.equal(reloaded.get('doc/a'), 'helpful')
  assert.equal(reloaded.submit('doc/a', 'unhelpful'), false)
  assert.equal(reloaded.submit('doc/b', 'unhelpful'), true)
})

test('blocked storage still prevents duplicate responses using memory', () => {
  const store = createFeedbackStore(() => { throw new Error('blocked') })
  assert.equal(store.get('doc/a'), null)
  assert.equal(store.submit('doc/a', 'helpful'), true)
  assert.equal(store.submit('doc/a', 'unhelpful'), false)
  assert.equal(store.get('doc/a'), 'helpful')
})

test('malformed storage and write failure preserve functional feedback', () => {
  const store = createFeedbackStore(() => ({ getItem: () => '{bad json', setItem: () => { throw new Error('quota') } }))
  assert.equal(store.submit('doc/a', 'unhelpful'), true)
  assert.equal(store.get('doc/a'), 'unhelpful')
  assert.equal(store.submit('doc/a', 'helpful'), false)
})

test('unrecognized saved values are ignored and first accepted answer remains authoritative', () => {
  let raw = JSON.stringify({ 'doc/a': 'unknown', 'doc/b': 'helpful' })
  const store = createFeedbackStore(() => ({ getItem: (key) => key === FEEDBACK_STORAGE_KEY ? raw : null, setItem: (_key, value) => { raw = value } }))
  assert.equal(store.get('doc/a'), null)
  assert.equal(store.get('doc/b'), 'helpful')
  assert.equal(store.submit('doc/a', 'unhelpful'), true)
  raw = JSON.stringify({ 'doc/a': 'helpful' })
  assert.equal(store.get('doc/a'), 'unhelpful')
})
