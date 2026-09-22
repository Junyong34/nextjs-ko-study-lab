import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseEvent, cleanPath } from '../../../../apps/shell/src/lib/analytics/payload.ts'

test('payload drops unknown fields and query secrets', () => {
  assert.deepEqual(parseEvent({ name: 'share_click', params: { share_url: 'https://site.test/doc?email=a#secret', page_path: '/doc?q=private', email: 'private' } }), { name: 'share_click', params: { share_url: '/doc', page_path: '/doc' } })
  assert.equal(cleanPath('/a?secret=yes#hash'), '/a')
})
test('invalid or unknown boundary events are rejected', () => {
  for (const value of [null, {}, {name: 'constructor', params:{}}, {name:'code_copy',params:{}}, {name:'content_feedback',params:{rating:'sent'}}]) assert.equal(parseEvent(value), null)
  for (const result_count of [-1, NaN, Infinity, 1.5, '2']) assert.equal(parseEvent({name:'content_search_results',params:{search_surface:'doc_sidebar',search_topic:'other',result_count}}), null)
})
test('zero results and false completion are retained', () => {
  assert.ok(parseEvent({name:'content_search_results',params:{search_surface:'doc_sidebar',search_topic:'other',result_count:0}}))
  assert.deepEqual(parseEvent({name:'learning_progress_toggle',params:{kind:'document',item_key:'a.md',completed:false}})?.params, {kind:'document',item_key:'a.md',completed:false})
})
