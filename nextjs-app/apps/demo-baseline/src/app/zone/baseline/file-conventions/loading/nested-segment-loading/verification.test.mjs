import assert from 'node:assert/strict'
import test from 'node:test'
import {
  applyCatalogFallback,
  applyCatalogReady,
  applyProductFallback,
  applyParentAction,
  applyProductReady,
  verifyNestedLoading,
} from './verification.ts'

const RUN_A = 'run-a'
const RUN_B = 'run-b'
const PRODUCT_1 = 'prod-001'
const PRODUCT_2 = 'prod-002'

function buildSuccessfulTimeline(runId = RUN_A, productId = PRODUCT_1) {
  let t = applyCatalogFallback(null, runId, 100)
  t = applyCatalogReady(t, runId, 200)
  t = applyProductFallback(t, runId, productId, 300)
  t = applyParentAction(t, runId, 350)
  t = applyProductReady(t, runId, productId, 400)
  return t
}

test('applyCatalogFallback is idempotent: first observation timestamp wins', () => {
  let t = applyCatalogFallback(null, RUN_A, 100)
  t = applyCatalogFallback(t, RUN_A, 999)
  assert.equal(t.catalogFallbackSeenAt, 100)
})

test('apply* helpers discard a stale timeline from a different run', () => {
  const staleFromA = buildSuccessfulTimeline(RUN_A)
  const startedForB = applyCatalogFallback(staleFromA, RUN_B, 500)
  assert.equal(startedForB.runId, RUN_B)
  assert.equal(startedForB.catalogFallbackSeenAt, 500)
  assert.equal(startedForB.catalogReadyAt, null)
  assert.equal(startedForB.productId, null)
})

test('applyProductFallback resets parent action / product ready when the product changes', () => {
  let t = applyCatalogFallback(null, RUN_A, 100)
  t = applyCatalogReady(t, RUN_A, 200)
  t = applyProductFallback(t, RUN_A, PRODUCT_1, 300)
  t = applyParentAction(t, RUN_A, 350)
  t = applyProductReady(t, RUN_A, PRODUCT_1, 400)

  const switched = applyProductFallback(t, RUN_A, PRODUCT_2, 500)
  assert.equal(switched.productId, PRODUCT_2)
  assert.equal(switched.productFallbackSeenAt, 500)
  assert.equal(switched.parentActionAt, null)
  assert.equal(switched.productReadyAt, null)
})

test('applyParentAction only keeps the first click', () => {
  let t = applyParentAction(null, RUN_A, 111)
  t = applyParentAction(t, RUN_A, 222)
  assert.equal(t.parentActionAt, 111)
})

test('verifyNestedLoading: no run started yet is pending', () => {
  const result = verifyNestedLoading(null, null)
  assert.equal(result.isMatched, undefined)
})

test('verifyNestedLoading: a fully successful OTHER run does not validate the current (new) run', () => {
  const oldTimeline = buildSuccessfulTimeline(RUN_A)
  const result = verifyNestedLoading(oldTimeline, RUN_B)
  assert.equal(result.isMatched, undefined)
  assert.match(result.reason, /이전 실행/)
})

test('verifyNestedLoading: missing catalog fallback observation is pending', () => {
  let t = applyCatalogReady(null, RUN_A, 200)
  const result = verifyNestedLoading(t, RUN_A)
  assert.equal(result.isMatched, undefined)
})

test('verifyNestedLoading: out-of-order catalog timestamps fail', () => {
  const badTimeline = { ...buildSuccessfulTimeline(RUN_A), catalogFallbackSeenAt: 500, catalogReadyAt: 200 }
  const result = verifyNestedLoading(badTimeline, RUN_A)
  assert.equal(result.isMatched, false)
})

test('verifyNestedLoading: no product visited yet is pending', () => {
  let t = applyCatalogFallback(null, RUN_A, 100)
  t = applyCatalogReady(t, RUN_A, 200)
  const result = verifyNestedLoading(t, RUN_A)
  assert.equal(result.isMatched, undefined)
})

test('verifyNestedLoading: product completed without ever seeing its fallback fails (cache skip)', () => {
  let t = applyCatalogFallback(null, RUN_A, 100)
  t = applyCatalogReady(t, RUN_A, 200)
  t = { ...t, productId: PRODUCT_1, productReadyAt: 400 }
  const result = verifyNestedLoading(t, RUN_A)
  assert.equal(result.isMatched, false)
  assert.match(result.reason, /fallback을 관측하지 못한/)
})

test('verifyNestedLoading: product completed without a parent action during fallback fails', () => {
  let t = applyCatalogFallback(null, RUN_A, 100)
  t = applyCatalogReady(t, RUN_A, 200)
  t = applyProductFallback(t, RUN_A, PRODUCT_1, 300)
  t = applyProductReady(t, RUN_A, PRODUCT_1, 400)
  const result = verifyNestedLoading(t, RUN_A)
  assert.equal(result.isMatched, false)
  assert.match(result.reason, /상위 조작/)
})

test('a parent action click before the product fallback even mounted is dropped, not credited to it', () => {
  // 상품 진입 전(카탈로그 화면)에서 미리 클릭해도, 그 뒤 상품 fallback에 진입하면
  // "이 상품에 대한 관측"으로 리셋되어야 한다 — 이전 클릭이 몰래 성공 조건을 채우면 안 된다.
  let t = applyCatalogFallback(null, RUN_A, 100)
  t = applyCatalogReady(t, RUN_A, 200)
  t = applyParentAction(t, RUN_A, 250) // 아직 productId 없음 — 카탈로그 화면에서 미리 클릭
  t = applyProductFallback(t, RUN_A, PRODUCT_1, 300)
  assert.equal(t.parentActionAt, null)
  t = applyProductReady(t, RUN_A, PRODUCT_1, 400)
  const result = verifyNestedLoading(t, RUN_A)
  assert.equal(result.isMatched, false)
  assert.match(result.reason, /상위 조작/)
})

test('verifyNestedLoading: a parent action timestamp earlier than the fallback timestamp fails (corrupted order)', () => {
  const badTimeline = { ...buildSuccessfulTimeline(RUN_A), parentActionAt: 250 }
  const result = verifyNestedLoading(badTimeline, RUN_A)
  assert.equal(result.isMatched, false)
  assert.match(result.reason, /시작 전/)
})

test('verifyNestedLoading: parent action clicked after completion (not during fallback) fails', () => {
  let t = applyCatalogFallback(null, RUN_A, 100)
  t = applyCatalogReady(t, RUN_A, 200)
  t = applyProductFallback(t, RUN_A, PRODUCT_1, 300)
  t = applyProductReady(t, RUN_A, PRODUCT_1, 400)
  t = { ...t, parentActionAt: 450 }
  const result = verifyNestedLoading(t, RUN_A)
  assert.equal(result.isMatched, false)
  assert.match(result.reason, /완료 이후/)
})

test('verifyNestedLoading: full real sequence in the current run succeeds', () => {
  const t = buildSuccessfulTimeline(RUN_A, PRODUCT_1)
  const result = verifyNestedLoading(t, RUN_A)
  assert.equal(result.isMatched, true)
  assert.match(result.reason, new RegExp(RUN_A))
})

test('verifyNestedLoading: still pending mid-fallback (parent action recorded, product not ready yet)', () => {
  let t = applyCatalogFallback(null, RUN_A, 100)
  t = applyCatalogReady(t, RUN_A, 200)
  t = applyProductFallback(t, RUN_A, PRODUCT_1, 300)
  t = applyParentAction(t, RUN_A, 350)
  const result = verifyNestedLoading(t, RUN_A)
  assert.equal(result.isMatched, undefined)
})
