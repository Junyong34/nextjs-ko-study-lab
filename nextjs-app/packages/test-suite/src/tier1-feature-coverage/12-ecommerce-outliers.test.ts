import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { loadDemosYaml, getDemoSourceDir, getAllFiles } from '../utils/test-helpers.ts'

describe('Tier 1: Feature 12 - 8 Outliers E-Commerce Scenarios', () => {
  const demos = loadDemosYaml()

  it('12.1 should verify tailwind-v4 demo uses e-commerce theme tokens', () => {
    const demo = demos.find((d) => d.url === 'css/tailwind-v4')
    assert.ok(demo, 'css/tailwind-v4 demo must exist')
    const dir = getDemoSourceDir(demo)
    const files = getAllFiles(dir, ['.tsx', '.ts'])
    const content = files.map((f) => fs.readFileSync(f, 'utf-8')).join('\n')
    assert.match(content, /상품|주문|장바구니|가격|결제|checkout|cart|product|price/i, 'tailwind-v4 must use e-commerce terms')
  })

  it('12.2 should verify css-modules demo uses e-commerce product card styling', () => {
    const demo = demos.find((d) => d.url === 'css/css-modules')
    assert.ok(demo, 'css/css-modules demo must exist')
    const dir = getDemoSourceDir(demo)
    const files = getAllFiles(dir, ['.tsx', '.ts'])
    const content = files.map((f) => fs.readFileSync(f, 'utf-8')).join('\n')
    assert.match(content, /상품|주문|장바구니|가격|결제|card|product|badge/i, 'css-modules must use e-commerce terms')
  })

  it('12.3 should verify fast-refresh-boundary demo preserves live shopping cart state', () => {
    const demo = demos.find((d) => d.url === 'architecture/fast-refresh-boundary')
    assert.ok(demo, 'architecture/fast-refresh-boundary demo must exist')
    const dir = getDemoSourceDir(demo)
    const files = getAllFiles(dir, ['.tsx', '.ts'])
    const content = files.map((f) => fs.readFileSync(f, 'utf-8')).join('\n')
    assert.match(content, /수량|장바구니|cart|count|state/i, 'fast-refresh-boundary must demonstrate state retention')
  })

  it('12.4 should verify cache-key-compare demo uses catalog SKU cache keys', () => {
    const demo = demos.find((d) => d.url === 'guides/migrating-cache-components/cache-key-compare')
    assert.ok(demo, 'cache-key-compare demo must exist')
    const dir = getDemoSourceDir(demo)
    const files = getAllFiles(dir, ['.tsx', '.ts'])
    const content = files.map((f) => fs.readFileSync(f, 'utf-8')).join('\n')
    assert.match(content, /SKU|상품|재고|cacheKey|product/i, 'cache-key-compare must use e-commerce SKU keys')
  })

  it('12.5 should verify tanstack-query/ssr-hydration demo manages cart query state', () => {
    const demo = demos.find((d) => d.url === 'guides/tanstack-query/ssr-hydration')
    assert.ok(demo, 'tanstack-query/ssr-hydration demo must exist')
    const dir = getDemoSourceDir(demo)
    const files = getAllFiles(dir, ['.tsx', '.ts'])
    const content = files.map((f) => fs.readFileSync(f, 'utf-8')).join('\n')
    assert.match(content, /장바구니|주문|cart|query|hydrate/i, 'tanstack-query SSR hydration must manage e-commerce data')
  })
})
