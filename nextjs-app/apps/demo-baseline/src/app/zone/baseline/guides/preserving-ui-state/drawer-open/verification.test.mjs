import assert from 'node:assert/strict'
import test from 'node:test'
import { verifyPlacement, canRecordBefore, collectDrawers } from './verification.ts'

const A = '/zone/baseline/guides/preserving-ui-state/drawer-open'
const B = `${A}/fashion`

const drawer = (slot, over = {}) => ({ slot, mountId: `${slot}-1`, pathname: A, open: true, memo: '메모', scrollTop: 40, ...over })
const before = {
  pathname: A,
  timeOrigin: 1,
  drawers: { layout: drawer('layout'), keyed: drawer('keyed'), page: drawer('page') },
}
const fresh = (slot) => drawer(slot, { mountId: `${slot}-2`, pathname: B, open: false, memo: '', scrollTop: 0 })
const after = (over = {}) => ({
  pathname: B,
  timeOrigin: 1,
  drawers: { layout: drawer('layout', { pathname: B }), keyed: fresh('keyed'), page: fresh('page'), ...over },
})

test('no record is pending', () => assert.equal(verifyPlacement(null, null).isMatched, undefined))
test('recorded but not moved is pending', () => assert.equal(verifyPlacement(before, null).isMatched, undefined))
test('layout preserved, keyed and page reset succeeds', () => assert.equal(verifyPlacement(before, after()).isMatched, true))
test('document reload fails', () => assert.equal(verifyPlacement(before, { ...after(), timeOrigin: 2 }).isMatched, false))
test('layout remounted fails', () => {
  const result = verifyPlacement(before, after({ layout: fresh('layout') }))
  assert.equal(result.isMatched, false)
  assert.equal(result.slots.find((s) => s.slot === 'layout').ok, false)
})
test('page drawer kept its state fails (e.g. Activity preserved it)', () => {
  assert.equal(verifyPlacement(before, after({ page: drawer('page', { pathname: B }) })).isMatched, false)
})
test('layout scroll lost fails', () => {
  assert.equal(verifyPlacement(before, after({ layout: drawer('layout', { pathname: B, scrollTop: 0 }) })).isMatched, false)
})
test('collectDrawers waits for all slots on current path', () => {
  assert.equal(collectDrawers({ layout: drawer('layout', { pathname: B }), keyed: fresh('keyed'), page: drawer('page') }, B), null)
  assert.ok(collectDrawers({ layout: drawer('layout'), keyed: drawer('keyed'), page: drawer('page') }, A))
})
test('recording requires all open with memo', () => {
  assert.equal(canRecordBefore({ ...before.drawers, page: drawer('page', { memo: ' ' }) }), false)
  assert.equal(canRecordBefore(before.drawers), true)
})
