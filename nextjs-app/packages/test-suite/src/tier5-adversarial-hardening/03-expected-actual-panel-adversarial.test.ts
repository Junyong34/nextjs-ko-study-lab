import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { NEXTJS_APP_ROOT } from '../utils/test-helpers.ts'

const APPS_ROOT = path.join(NEXTJS_APP_ROOT, 'apps')

describe('Tier 5 Adversarial Hardening — 03: Dynamic ExpectedActualPanel & 3-State Lifecycle', () => {
  // 1. Static Literal AST Audit Across All 239 VerificationFooters
  it('AST Scanner: should assert 0 static isMatched={true} or isMatched: true occurrences across ALL footers', () => {
    function findFooterFiles(dir: string): string[] {
      const results: string[] = []
      if (!fs.existsSync(dir)) return results
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
          results.push(...findFooterFiles(fullPath))
        } else if (entry.isFile() && entry.name === 'VerificationFooter.tsx') {
          results.push(fullPath)
        }
      }
      return results
    }

    const baselineFooters = findFooterFiles(path.join(APPS_ROOT, 'demo-baseline/src'))
    const cacheFooters = findFooterFiles(path.join(APPS_ROOT, 'demo-cache-components/src'))
    const allFooters = [...baselineFooters, ...cacheFooters]

    assert.equal(allFooters.length, 239, `Expected exactly 239 VerificationFooter.tsx files, found ${allFooters.length}`)

    const flagged: { file: string; line: number; match: string }[] = []

    const strictStaticRegexes = [
      /isMatched=\{true\}/,
      /isMatched:\s*true\b/,
      /isMatched=\{\s*true\s*\}/,
    ]

    for (const file of allFooters) {
      const lines = fs.readFileSync(file, 'utf-8').split('\n')
      lines.forEach((line, index) => {
        for (const regex of strictStaticRegexes) {
          if (regex.test(line)) {
            flagged.push({
              file: path.relative(APPS_ROOT, file),
              line: index + 1,
              match: line.trim(),
            })
          }
        }
      })
    }

    assert.equal(
      flagged.length,
      0,
      `Detected ${flagged.length} static isMatched={true} literals:\n${flagged.map((f) => `${f.file}:${f.line} -> ${f.match}`).join('\n')}`
    )
  })

  // 2. VerificationFooter Dynamic State Evaluation Engine Oracle
  describe('VerificationFooter Dynamic Evaluation Logic Engine Oracle', () => {
    function evaluateVerificationFooterState(props: {
      isMatched?: boolean
      status?: string | number | null
      isLoaded?: boolean
      logs?: string[]
      count?: number
    }): { isMatched: boolean | undefined; badge: string; isSuccess: boolean; isIdle: boolean; isMismatch: boolean } {
      const { isMatched: propIsMatched, status, isLoaded, logs, count } = props

      const resolvedMatched =
        propIsMatched !== undefined
          ? propIsMatched
          : status !== undefined && status !== null
          ? typeof status === 'number'
            ? status >= 200 && status < 400
            : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
          : isLoaded !== undefined
          ? Boolean(isLoaded)
          : logs && Array.isArray(logs) && logs.length > 0
          ? true
          : count !== undefined && count > 0
          ? true
          : undefined

      const badge =
        resolvedMatched === true
          ? '검증 완료'
          : resolvedMatched === false
          ? '불일치'
          : '대기 중'

      return {
        isMatched: resolvedMatched,
        badge,
        isSuccess: resolvedMatched === true,
        isIdle: resolvedMatched === undefined,
        isMismatch: resolvedMatched === false,
      }
    }

    it('should evaluate to Idle State (isMatched = undefined, badge = "대기 중") when props are empty', () => {
      const state = evaluateVerificationFooterState({})
      assert.strictEqual(state.isMatched, undefined)
      assert.strictEqual(state.badge, '대기 중')
      assert.strictEqual(state.isIdle, true)
    })

    it('should evaluate HTTP Status numbers correctly (200..399 -> true, >=400 -> false)', () => {
      // 2xx / 3xx
      for (const code of [200, 201, 204, 301, 302, 307, 308]) {
        const state = evaluateVerificationFooterState({ status: code })
        assert.strictEqual(state.isMatched, true, `Status ${code} should be matched`)
        assert.strictEqual(state.badge, '검증 완료')
      }

      // 4xx / 5xx
      for (const code of [400, 401, 403, 404, 429, 500, 502, 503]) {
        const state = evaluateVerificationFooterState({ status: code })
        assert.strictEqual(state.isMatched, false, `Status ${code} should be mismatch`)
        assert.strictEqual(state.badge, '불일치')
      }
    })

    it('should evaluate status strings (success keywords -> true, error keywords -> false)', () => {
      for (const validStr of ['success', 'valid', 'completed', 'ok']) {
        const state = evaluateVerificationFooterState({ status: validStr })
        assert.strictEqual(state.isMatched, true)
        assert.strictEqual(state.badge, '검증 완료')
      }

      for (const failStr of ['error', 'failed', 'invalid', 'rejected']) {
        const state = evaluateVerificationFooterState({ status: failStr })
        assert.strictEqual(state.isMatched, false)
        assert.strictEqual(state.badge, '불일치')
      }
    })

    it('should evaluate isLoaded boolean (true -> true, false -> false)', () => {
      assert.strictEqual(evaluateVerificationFooterState({ isLoaded: true }).isMatched, true)
      assert.strictEqual(evaluateVerificationFooterState({ isLoaded: false }).isMatched, false)
    })

    it('should evaluate logs array (non-empty -> true, empty -> undefined)', () => {
      assert.strictEqual(evaluateVerificationFooterState({ logs: ['dispatched'] }).isMatched, true)
      assert.strictEqual(evaluateVerificationFooterState({ logs: [] }).isMatched, undefined)
    })

    it('should evaluate count number (positive -> true, zero -> undefined)', () => {
      assert.strictEqual(evaluateVerificationFooterState({ count: 5 }).isMatched, true)
      assert.strictEqual(evaluateVerificationFooterState({ count: 0 }).isMatched, undefined)
    })
  })

  // 3. Custom Verification Footers Dynamic Contract Check
  describe('Custom VerificationFooters Contract Verification', () => {
    it('Dynamic Segments catch-all-slug VerificationFooter contract', () => {
      const footerPath = path.join(
        APPS_ROOT,
        'demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/catch-all-slug/components/VerificationFooter.tsx'
      )
      const content = fs.readFileSync(footerPath, 'utf-8')
      assert.ok(content.includes('currentSlug ? isMatched : undefined'), 'Must yield undefined when currentSlug is empty')
      assert.ok(content.includes('Boolean(currentSlug && currentSlug.length > 0)'), 'Must check slug length')
    })

    it('Dynamic Segments single-param VerificationFooter contract', () => {
      const footerPath = path.join(
        APPS_ROOT,
        'demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/single-param/components/VerificationFooter.tsx'
      )
      const content = fs.readFileSync(footerPath, 'utf-8')
      assert.ok(content.includes('currentId ? isMatched : undefined'), 'Must yield undefined when currentId is empty')
      assert.ok(content.includes("startsWith('PROD-')"), 'Must validate PROD- prefix')
    })

    it('Intercepting Routes VerificationFooter contract', () => {
      const footerPath = path.join(
        APPS_ROOT,
        'demo-baseline/src/app/zone/baseline/file-conventions/intercepting-routes/components/VerificationFooter.tsx'
      )
      const content = fs.readFileSync(footerPath, 'utf-8')
      assert.ok(content.includes('isDirectPage || Boolean(currentPhotoId) ? true : undefined'), 'Must yield undefined when idle')
    })
  })
})
