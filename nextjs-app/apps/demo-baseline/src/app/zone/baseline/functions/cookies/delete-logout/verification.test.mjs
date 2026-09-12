import assert from 'node:assert/strict'
import test from 'node:test'
import { verifyCookieDeletion } from './verification.ts'

test('a missing server observation never proves deletion', () => {
  assert.equal(verifyCookieDeletion({ created: true, deleted: true }, null), undefined)
})

for (const [created, deleted, present, expected] of [
  [false, false, false, false],
  [true, false, false, false],
  [false, true, false, false],
  [true, true, false, true],
  [false, false, true, false],
  [true, false, true, false],
  [false, true, true, false],
  [true, true, true, false],
]) {
  test(`created=${created}, deleted=${deleted}, server cookie present=${present}`, () => {
    assert.equal(verifyCookieDeletion({ created, deleted }, { present }), expected)
  })
}
