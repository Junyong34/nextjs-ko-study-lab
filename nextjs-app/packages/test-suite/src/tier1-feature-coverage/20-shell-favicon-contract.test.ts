import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { NEXTJS_APP_ROOT } from '../utils/test-helpers.ts'

const iconPath = path.join(NEXTJS_APP_ROOT, 'apps/shell/src/app/icon.svg')
const icon = fs.readFileSync(iconPath, 'utf-8')
const svgRoot = icon.match(/<svg\b[^>]*>/)?.[0] ?? ''

describe('Tier 1: Shell favicon contract', () => {
  it('uses a compact square canvas with a rounded background', () => {
    assert.match(icon, /viewBox="0 0 64 64"/)
    assert.doesNotMatch(svgRoot, /\s(?:width|height)="[^"]+"/)
    assert.match(icon, /<rect[^>]+rx="(?:12|14)"/)
  })

  it('keeps the learning and code symbols legible without tiny text', () => {
    assert.match(icon, /id="book"/)
    assert.match(icon, /id="code"/)
    assert.doesNotMatch(icon, /<text|NEXT(?:\.JS)?/i)
  })
})
