import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { inspectCardFormat } from '../../../../apps/demo-baseline/src/app/zone/baseline/architecture/accessibility/form-aria-support/card-format.ts'

describe('학습용 카드 입력 형식', () => {
  for (const [value, valid, digitCount] of [
    ['', false, 0], ['424242424242424', false, 15], ['4242424242424242', true, 16],
    ['42424242424242424', false, 17], ['4242424242424242a', false, 16],
    ['4242-4242 4242-4242', true, 16], ['4242.4242.4242.4242', false, 16],
  ] as const) {
    it(`입력 ${JSON.stringify(value)}: 유효=${valid}`, () => {
      assert.deepEqual(inspectCardFormat(value), { valid, digitCount })
    })
  }
})
