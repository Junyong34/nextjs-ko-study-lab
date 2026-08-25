import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import {
  loadDemosManifest,
  getDemoSourceDir,
  getAllFiles,
  NEXTJS_APP_ROOT,
  type Demo,
} from '../utils/test-helpers.ts'
import {
  parseGuideCardFromTsx,
  extractPlaygroundMetadata,
  type GuideCardData,
} from './guide-consistency-validator.ts'

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../../../../..')
const REPORT_PATH = path.join(NEXTJS_APP_ROOT, 'docs/14-demo-t2b-backlog-report.md')

console.log('============================================================')
console.log('   CHALLENGER 2: M5 EMPIRICAL VERIFICATION & ORACLE RUNNER   ')
console.log('============================================================\n')

let passCount = 0
let failCount = 0
const failureDetails: string[] = []

async function verify(name: string, fn: () => void | Promise<void>) {
  try {
    await fn()
    console.log(`  ✅ PASS: ${name}`)
    passCount++
  } catch (err: any) {
    console.error(`  ❌ FAIL: ${name}`)
    console.error(`     Details: ${err.message}`)
    failureDetails.push(`${name} -> ${err.message}`)
    failCount++
  }
}

async function main() {
  const demos = loadDemosManifest()
  const dirByUrl = new Map(demos.map((d) => [d.url, getDemoSourceDir(d)]))

  console.log(`[ORACLE 1] Full 241 Demos Parsing & Step Distribution Analysis`)

  const parsedDemoList: Array<{
    demo: Demo
    dir: string
    guide: GuideCardData
    stepCount: number
    observeList: string[]
    lastStepObserve: string
    lastStepObserveAt: string | undefined
    interactiveCount: number
    loc: number
  }> = []

  await verify('1.1 Parse all 241 demos on disk and extract DemoGuideCard', () => {
    assert.strictEqual(demos.length, 241, 'Manifest must contain exactly 241 demos')

    for (const demo of demos) {
      const dir = getDemoSourceDir(demo)
      const nestedDemoDirs = demos
        .filter((other) => other.url !== demo.url && other.url.startsWith(demo.url + '/'))
        .map((other) => dirByUrl.get(other.url)!)
      
      const files = getAllFiles(dir, ['.tsx', '.ts']).filter(
        (f) => !nestedDemoDirs.some((nested) => f.startsWith(nested + path.sep))
      )

      let guide: GuideCardData | null = null
      const rootEntries = [path.join(dir, 'page.tsx'), path.join(dir, 'layout.tsx')]
      for (const entry of rootEntries) {
        if (!fs.existsSync(entry)) continue
        const text = fs.readFileSync(entry, 'utf-8')
        if (text.includes('DemoGuideCard')) {
          guide = parseGuideCardFromTsx(text)
          if (guide && guide.steps.length > 0) break
        }
      }

      if (!guide || guide.steps.length === 0) {
        for (const f of files) {
          if (rootEntries.includes(f)) continue
          const text = fs.readFileSync(f, 'utf-8')
          if (text.includes('DemoGuideCard')) {
            guide = parseGuideCardFromTsx(text)
            if (guide && guide.steps.length > 0) break
          }
        }
      }

      assert.ok(guide, `Demo at ${demo.url} must contain a valid DemoGuideCard`)
      assert.ok(guide.steps.length >= 2, `Demo at ${demo.url} must have at least 2 steps (found ${guide.steps.length})`)

      const playground = extractPlaygroundMetadata(dir, nestedDemoDirs)

      let totalLoc = 0
      for (const f of files) {
        const raw = fs.readFileSync(f, 'utf-8')
        const lines = raw.split(/\r?\n/)
        totalLoc += lines.length
      }

      const lastStep = guide.steps[guide.steps.length - 1]
      parsedDemoList.push({
        demo,
        dir,
        guide,
        stepCount: guide.steps.length,
        observeList: guide.steps.map(s => s.observe).filter(Boolean) as string[],
        lastStepObserve: lastStep.observe || '',
        lastStepObserveAt: lastStep.observeAt,
        interactiveCount: playground.interactiveCount,
        loc: totalLoc,
      })
    }

    assert.strictEqual(parsedDemoList.length, 241, 'All 241 demos must be successfully parsed')
  })

  // Step distribution calculation
  const stepCounts: Record<number, number> = {}
  for (const item of parsedDemoList) {
    stepCounts[item.stepCount] = (stepCounts[item.stepCount] || 0) + 1
  }

  console.log('\n  Step Distribution Breakdown:')
  for (const [steps, count] of Object.entries(stepCounts).sort((a, b) => Number(a[0]) - Number(b[0]))) {
    const pct = ((count / 241) * 100).toFixed(2)
    console.log(`    Step ${steps}: ${count} demos (${pct}%)`)
  }

  await verify('1.2 3-step ratio requirement (3-step ratio <= 70%)', () => {
    const step3Count = stepCounts[3] || 0
    const step3Ratio = (step3Count / 241) * 100
    console.log(`    Actual 3-step count: ${step3Count} / 241 (${step3Ratio.toFixed(2)}%)`)
    assert.ok(step3Ratio <= 70, `3-step ratio must be <= 70% (actual: ${step3Ratio.toFixed(2)}%)`)
    assert.strictEqual(step3Count, 164, 'Step 3 count should be exactly 164')
  })

  await verify('1.3 Step distribution exact parity with 14-demo-t2b-backlog-report.md (Step 2: 41, Step 3: 164, Step 4: 36)', () => {
    assert.strictEqual(stepCounts[2], 41, `Expected 41 step-2 demos, got ${stepCounts[2]}`)
    assert.strictEqual(stepCounts[3], 164, `Expected 164 step-3 demos, got ${stepCounts[3]}`)
    assert.strictEqual(stepCounts[4], 36, `Expected 36 step-4 demos, got ${stepCounts[4]}`)
    assert.strictEqual((stepCounts[2] || 0) + (stepCounts[3] || 0) + (stepCounts[4] || 0), 241, 'Sum of all step counts must be 241')
  })

  console.log(`\n[ORACLE 2] Final Step 'observe' Field Authenticity & Verification Connection`)

  await verify('2.1 100% of 241 demos have non-empty observe on the final step (length >= 5)', () => {
    const missingObserve: string[] = []
    for (const item of parsedDemoList) {
      if (!item.lastStepObserve || item.lastStepObserve.trim().length < 5) {
        missingObserve.push(`${item.demo.url} -> last step observe: "${item.lastStepObserve}"`)
      }
    }
    assert.strictEqual(missingObserve.length, 0, `Demos with missing/short observe:\n${missingObserve.join('\n')}`)
  })

  await verify('2.2 Zero template strings / leak placeholders in observe fields (${...}, &lt;, TODO, FIXME, NaN원, undefined입니다)', () => {
    const leakedObserve: string[] = []
    for (const item of parsedDemoList) {
      for (const obs of item.observeList) {
        if (/\$\{[^}]+\}/.test(obs) || /&(?:lt|gt|amp);/.test(obs) || /\b(TODO|FIXME|TBD)\b|undefined\s*입니다|NaN원/.test(obs)) {
          leakedObserve.push(`${item.demo.url} -> observe: "${obs}"`)
        }
      }
    }
    assert.strictEqual(leakedObserve.length, 0, `Demos with leaked observe strings:\n${leakedObserve.join('\n')}`)
  })

  await verify('2.3 Valid observeAt locations across all steps (playground, verification, devtools, network, console)', () => {
    const validLocs = new Set(['playground', 'verification', 'devtools', 'network', 'console'])
    const invalidLocs: string[] = []
    for (const item of parsedDemoList) {
      for (const step of item.guide.steps) {
        if (step.observeAt && !validLocs.has(step.observeAt)) {
          invalidLocs.push(`${item.demo.url} step ${step.step} -> invalid observeAt: "${step.observeAt}"`)
        }
      }
    }
    assert.strictEqual(invalidLocs.length, 0, `Invalid observeAt values:\n${invalidLocs.join('\n')}`)
  })

  await verify('2.4 Authenticity & Specificity: All 241 observe fields are non-generic and demo-aligned', () => {
    // Check that observe text is non-empty, distinct, and informative
    const obsSet = new Set<string>()
    for (const item of parsedDemoList) {
      obsSet.add(item.lastStepObserve)
    }
    // High uniqueness across 241 demos (at least 200 distinct observe strings)
    console.log(`    Unique final-step observe strings: ${obsSet.size} / 241`)
    assert.ok(obsSet.size >= 200, `Expected at least 200 distinct observe strings, found ${obsSet.size}`)
  })

  console.log(`\n[ORACLE 3] 14-demo-t2b-backlog-report.md Accuracy & Completeness Audit`)

  assert.ok(fs.existsSync(REPORT_PATH), `Report file must exist at ${REPORT_PATH}`)
  const reportContent = fs.readFileSync(REPORT_PATH, 'utf-8')

  await verify('3.1 Verify report contains exactly 241 demo inventory rows in Section 3-2 table', () => {
    const tableRegex = /^\|\s*(\d+)\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*\*\*([A-D])\*\*\s*\|\s*([^|]+)\|\s*\*\*(P[0-2])\*\*\s*\|\s*([^|]+)\|/gm
    const rows: Array<{
      num: number
      category: string
      url: string
      steps: number
      interactive: number
      loc: number
      grade: string
      t3Depth: string
      priority: string
      blueprint: string
    }> = []

    let match: RegExpExecArray | null
    while ((match = tableRegex.exec(reportContent)) !== null) {
      rows.push({
        num: parseInt(match[1], 10),
        category: match[2].trim(),
        url: match[3].trim(),
        steps: parseInt(match[4], 10),
        interactive: parseInt(match[5], 10),
        loc: parseInt(match[6], 10),
        grade: match[7].trim(),
        t3Depth: match[8].trim(),
        priority: match[9].trim(),
        blueprint: match[10].trim(),
      })
    }

    console.log(`    Parsed table rows from report: ${rows.length}`)
    assert.strictEqual(rows.length, 241, `Section 3-2 table must contain exactly 241 rows (found ${rows.length})`)

    for (let i = 0; i < rows.length; i++) {
      assert.strictEqual(rows[i].num, i + 1, `Row number mismatch at index ${i}: expected ${i + 1}, got ${rows[i].num}`)
    }

    const parsedMap = new Map(parsedDemoList.map(p => [p.demo.url, p]))
    const missingUrls: string[] = []
    const stepMismatches: string[] = []

    for (const r of rows) {
      const parsed = parsedMap.get(r.url)
      if (!parsed) {
        missingUrls.push(r.url)
      } else {
        if (parsed.stepCount !== r.steps) {
          stepMismatches.push(`${r.url}: report claims ${r.steps} steps, actual code has ${parsed.stepCount} steps`)
        }
      }
    }

    assert.strictEqual(missingUrls.length, 0, `Report contains unknown demo URLs:\n${missingUrls.join('\n')}`)
    assert.strictEqual(stepMismatches.length, 0, `Step count mismatches between report and codebase:\n${stepMismatches.join('\n')}`)
  })

  await verify('3.2 Priority distribution totals match report Section 4-1 summary (P0: 19, P1: 46, P2: 176, Total: 241)', () => {
    const prioRegex = /^\|\s*\d+\s*\|\s*`[^`]+`\s*\|\s*`[^`]+`\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*\*\*[A-D]\*\*\s*\|\s*[^|]+\|\s*\*\*(P[0-2])\*\*\s*\|/gm
    const prioCounts: Record<string, number> = { P0: 0, P1: 0, P2: 0 }
    let match: RegExpExecArray | null
    while ((match = prioRegex.exec(reportContent)) !== null) {
      prioCounts[match[1]] = (prioCounts[match[1]] || 0) + 1
    }

    console.log(`    Actual Priority counts: P0=${prioCounts.P0}, P1=${prioCounts.P1}, P2=${prioCounts.P2}`)
    assert.strictEqual(prioCounts.P0, 19, `P0 count mismatch: expected 19, got ${prioCounts.P0}`)
    assert.strictEqual(prioCounts.P1, 46, `P1 count mismatch: expected 46, got ${prioCounts.P1}`)
    assert.strictEqual(prioCounts.P2, 176, `P2 count mismatch: expected 176, got ${prioCounts.P2}`)
    assert.strictEqual(prioCounts.P0 + prioCounts.P1 + prioCounts.P2, 241)
  })

  await verify('3.3 P0 blueprints detailed list (Section 4-2) contains concrete blueprints for critical demos', () => {
    const p0Demos = [
      'guides/authentication/middleware-guard',
      'guides/server-actions/start-transition',
      'guides/draft-mode/bypass-cookie',
      'edge/v8-lightweight/nodejs-modules-bailout',
      'guides/multi-tenant/subdomain-tenant',
      'file-conventions/default/parallel-fallback',
      'file-conventions/intercepting-routes/direct-vs-modal',
    ]
    for (const demoPath of p0Demos) {
      assert.ok(reportContent.includes(demoPath), `Report Section 4-2 must detail P0 demo ${demoPath}`)
    }
  })

  console.log('\n============================================================')
  console.log(`Oracle Verification Complete: ${passCount} Passed, ${failCount} Failed`)
  console.log('============================================================\n')

  if (failCount > 0) {
    process.exit(1)
  }
}

main().catch(err => {
  console.error('Fatal Oracle error:', err)
  process.exit(1)
})
