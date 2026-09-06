import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { NEXTJS_APP_ROOT } from '../utils/test-helpers.ts'

const iconPath = path.join(NEXTJS_APP_ROOT, 'apps/shell/src/app/icon.svg')
const icon = fs.readFileSync(iconPath, 'utf-8')
const svgRoot = icon.match(/<svg\b[^>]*>/)?.[0] ?? ''
const appleIconPath = path.join(NEXTJS_APP_ROOT, 'apps/shell/src/app/apple-icon.tsx')
const appleIcon = fs.readFileSync(appleIconPath, 'utf-8')

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

  it('renders the same book and code glyphs in the apple touch icon', () => {
    assert.match(appleIcon, /viewBox="0 0 64 64"/)
    assert.match(appleIcon, /id="book"/)
    assert.match(appleIcon, /id="code"/)
    assert.match(appleIcon, /background: '#09090B'/)
    assert.doesNotMatch(appleIcon, />\s*N\s*</)
    assert.doesNotMatch(appleIcon, /fontSize/)
  })

  it('shares every glyph path between the favicon and the apple touch icon', () => {
    const paths = [...icon.matchAll(/ d="([^"]+)"/g)].map((m) => m[1])
    assert.ok(paths.length >= 4)
    for (const d of paths) assert.ok(appleIcon.includes(`d="${d}"`), `missing path: ${d}`)
  })
})
