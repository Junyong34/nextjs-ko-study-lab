import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { NEXTJS_APP_ROOT } from '../utils/test-helpers.ts'

describe('Tier 1: Feature 1 - Dead Code & Mount Verification', () => {
  it('1.1 should mount WindowStorageAccess client demo component in page.tsx', () => {
    const filePath = path.join(
      NEXTJS_APP_ROOT,
      'apps/demo-baseline/src/app/zone/baseline/directives/use-client/window-storage-access/page.tsx',
    )
    assert.ok(fs.existsSync(filePath), `File should exist: ${filePath}`)
    const content = fs.readFileSync(filePath, 'utf-8')
    assert.match(content, /StorageClientDemo|Storage|localStorage|sessionStorage/, 'Component must be mounted in page')
    assert.match(content, /export\s+default/, 'Page must have default export')
  })

  it('1.2 should mount DirectiveUseServerDemo file-level action in page.tsx', () => {
    const filePath = path.join(
      NEXTJS_APP_ROOT,
      'apps/demo-baseline/src/app/zone/baseline/directives/use-server/file-level-action/page.tsx',
    )
    assert.ok(fs.existsSync(filePath), `File should exist: ${filePath}`)
    const content = fs.readFileSync(filePath, 'utf-8')
    assert.match(content, /DirectiveUseServerDemo|ServerAction|action/i, 'File-level action demo must be mounted')
    assert.match(content, /export\s+default/, 'Page must have default export')
  })

  it('1.3 should mount InlineActionClosureDemo in page.tsx', () => {
    const filePath = path.join(
      NEXTJS_APP_ROOT,
      'apps/demo-baseline/src/app/zone/baseline/directives/use-server/inline-action-closure/page.tsx',
    )
    assert.ok(fs.existsSync(filePath), `File should exist: ${filePath}`)
    const content = fs.readFileSync(filePath, 'utf-8')
    assert.match(content, /InlineActionClosureDemo|Closure|inline/i, 'Inline closure demo must be mounted')
    assert.match(content, /export\s+default/, 'Page must have default export')
  })

  it('1.4 should mount AfterLoggingDemo in functions/after/background-logging/page.tsx', () => {
    const filePath = path.join(
      NEXTJS_APP_ROOT,
      'apps/demo-baseline/src/app/zone/baseline/functions/after/background-logging/page.tsx',
    )
    assert.ok(fs.existsSync(filePath), `File should exist: ${filePath}`)
    const content = fs.readFileSync(filePath, 'utf-8')
    assert.match(content, /AfterLoggingDemo|after\s*\(|logging|background/i, 'After logging demo must be present and mounted')
    assert.match(content, /export\s+default/, 'Page must have default export')
  })

  it('1.5 should mount CookiesSessionDemo in functions/cookies/get-set-session/page.tsx', () => {
    const filePath = path.join(
      NEXTJS_APP_ROOT,
      'apps/demo-baseline/src/app/zone/baseline/functions/cookies/get-set-session/page.tsx',
    )
    assert.ok(fs.existsSync(filePath), `File should exist: ${filePath}`)
    const content = fs.readFileSync(filePath, 'utf-8')
    assert.match(content, /CookiesSessionDemo|cookies\s*\(|session|cart/i, 'Cookies session cart demo must be present and mounted')
    assert.match(content, /export\s+default/, 'Page must have default export')
  })
})
