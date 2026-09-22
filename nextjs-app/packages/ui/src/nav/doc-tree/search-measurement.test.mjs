import test from 'node:test'
import assert from 'node:assert/strict'
import { SearchMeasurement, resultPaths, searchTopics, normalizeSearch } from './search-measurement.ts'

test('counts distinct navigable leaves, not headers, and strips URL queries', () => {
  const tree = [{ title: 'group', url: '/group', children: [
    { title: 'A', url: '/a?q=1' }, { title: 'A again', url: '/a#x' },
    { title: 'B', url: '/b' },
  ] }]
  assert.deepEqual(resultPaths(tree, false), ['/a', '/b'])
  assert.deepEqual(resultPaths(tree, true), ['/demo/a', '/demo/b'])
})

test('does not claim hidden, composing, or empty results; deduplicates and permits A B A', () => {
  const ledger = new SearchMeasurement()
  ledger.update('A', ['/a'], 'doc_sidebar')
  assert.equal(ledger.claim(false, false), false)
  assert.equal(ledger.claim(true, true), false)
  assert.equal(ledger.claim(true, false), true)
  ledger.update(' a ', ['/a'], 'doc_sidebar')
  assert.equal(ledger.claim(true, false), false)
  ledger.update('B', [], 'doc_sidebar')
  assert.equal(ledger.claim(true, false), true)
  ledger.update('A', ['/a'], 'doc_sidebar')
  assert.equal(ledger.claim(true, false), true)
  ledger.update('', ['/a'], 'doc_sidebar')
  assert.equal(ledger.claim(true, false), false)
  ledger.update('A', ['/a'], 'doc_sidebar')
  assert.equal(ledger.claim(true, false), true)
})

test('only exact normalized manifest titles and known keywords are topics', () => {
  const topics = searchTopics([{ title: 'Server Components', url: '/server' }])
  assert.equal(topics.has(normalizeSearch('  SERVER   Components ')), true)
  assert.equal(topics.has('react'), true)
  assert.equal(topics.has('person@example.com'), false)
  assert.equal(topics.has('server'), false)
})
