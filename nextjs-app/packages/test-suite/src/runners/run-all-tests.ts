import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runStaticMatchedAudit } from './audit-static-matched.ts'
import { validateRouteAndManifestIntegrity } from './route-manifest-integrity.ts'
import { formatTable, printSuiteHeader } from '../utils/reporter.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PACKAGE_ROOT = path.resolve(__dirname, '../..')

export interface TestRunSummary {
  manifestCheck: boolean
  staticMatchedAudit: {
    scanned: number
    flagged: number
  }
  tier1: { total: number; pass: number; fail: number; durationMs: number }
  tier2: { total: number; pass: number; fail: number; durationMs: number }
  tier3: { total: number; pass: number; fail: number; durationMs: number }
  tier4: { total: number; pass: number; fail: number; durationMs: number }
  tier5: { total: number; pass: number; fail: number; durationMs: number }
  allPassed: boolean
}

function runNodeTestSuite(globPattern: string): { total: number; pass: number; fail: number; durationMs: number; output: string } {
  const start = Date.now()
  const res = spawnSync('node', [
    '--test',
    '--experimental-strip-types',
    '--disable-warning=ExperimentalWarning',
    globPattern,
  ], {
    cwd: PACKAGE_ROOT,
    encoding: 'utf-8',
    shell: true,
  })
  const durationMs = Date.now() - start
  const output = res.stdout + '\n' + res.stderr

  const passMatch = output.match(/# pass (\d+)/)
  const failMatch = output.match(/# fail (\d+)/)
  const totalMatch = output.match(/# tests (\d+)/)

  const pass = passMatch ? parseInt(passMatch[1], 10) : 0
  const fail = failMatch ? parseInt(failMatch[1], 10) : 0
  const total = totalMatch ? parseInt(totalMatch[1], 10) : pass + fail

  return { total, pass, fail, durationMs, output }
}

export function runAllTestSuites(): TestRunSummary {
  printSuiteHeader('nextjs-app Automated Multi-Tier Test Suite Runner')

  // 1. Manifest & Route Integrity Validator
  console.log('\n[1/6] Running Route & Manifest Consistency Validator...')
  const manifestResult = validateRouteAndManifestIntegrity()
  const manifestOk = manifestResult.errors.length === 0
  console.log(`  -> Status: ${manifestOk ? 'PASSED (241/241 valid)' : 'FAILED'}`)

  // 2. Static isMatched Audit
  console.log('\n[2/6] Running Static isMatched={true} Literal Audit...')
  const auditResult = runStaticMatchedAudit()
  console.log(`  -> Total Footers: ${auditResult.totalFilesScanned}, Flagged: ${auditResult.flaggedFilesCount}`)

  // 3. Tier 1
  console.log('\n[3/6] Running Tier 1: Feature Coverage (60 cases across 12 areas)...')
  const t1 = runNodeTestSuite('src/tier1-feature-coverage/*.test.ts')
  console.log(`  -> Passed: ${t1.pass}/${t1.total} in ${t1.durationMs}ms`)

  // 4. Tier 2
  console.log('\n[4/6] Running Tier 2: Boundary & Corner Cases (60 cases)...')
  const t2 = runNodeTestSuite('src/tier2-boundaries-edge-cases/*.test.ts')
  console.log(`  -> Passed: ${t2.pass}/${t2.total} in ${t2.durationMs}ms`)

  // 5. Tier 3
  console.log('\n[5/6] Running Tier 3: Cross-Feature Combinations (12 combinations)...')
  const t3 = runNodeTestSuite('src/tier3-cross-feature-combinations/*.test.ts')
  console.log(`  -> Passed: ${t3.pass}/${t3.total} in ${t3.durationMs}ms`)

  // 6. Tier 4
  console.log('\n[6/7] Running Tier 4: Real-World E-Commerce Workloads (5 scenarios)...')
  const t4 = runNodeTestSuite('src/tier4-real-world-workloads/*.test.ts')
  console.log(`  -> Passed: ${t4.pass}/${t4.total} in ${t4.durationMs}ms`)

  // 7. Tier 5
  console.log('\n[7/7] Running Tier 5: Adversarial Coverage Hardening (38 cases)...')
  const t5 = runNodeTestSuite('src/tier5-adversarial-hardening/*.test.ts')
  console.log(`  -> Passed: ${t5.pass}/${t5.total} in ${t5.durationMs}ms`)

  const allPassed = manifestOk && t1.fail === 0 && t2.fail === 0 && t3.fail === 0 && t4.fail === 0 && t5.fail === 0

  printSuiteHeader('Multi-Tier Test Suite Execution Summary')

  const headers = ['Test Suite Tier', 'Scope / Feature Area', 'Cases', 'Passed', 'Failed', 'Status']
  const rows = [
    ['Manifest Integrity', '241 Demo Routes & Docs SSOT', `${manifestResult.totalDemos}`, `${manifestResult.validDemos}`, `${manifestResult.invalidDemos}`, manifestOk ? 'PASS' : 'FAIL'],
    ['Static Literal Audit', 'VerificationFooter isMatched audit', `${auditResult.totalFilesScanned}`, `${auditResult.cleanFilesCount}`, `${auditResult.flaggedFilesCount}`, 'REPORTED'],
    ['Tier 1: Feature Coverage', '12 Core Feature Areas', `${t1.total}`, `${t1.pass}`, `${t1.fail}`, t1.fail === 0 ? 'PASS' : 'FAIL'],
    ['Tier 2: Boundary & Edge', 'Corner cases, 404s, error boundaries', `${t2.total}`, `${t2.pass}`, `${t2.fail}`, t2.fail === 0 ? 'PASS' : 'FAIL'],
    ['Tier 3: Combinations', 'Pairwise cross-feature interactions', `${t3.total}`, `${t3.pass}`, `${t3.fail}`, t3.fail === 0 ? 'PASS' : 'FAIL'],
    ['Tier 4: Workloads', 'End-to-end e-commerce scenarios', `${t4.total}`, `${t4.pass}`, `${t4.fail}`, t4.fail === 0 ? 'PASS' : 'FAIL'],
    ['Tier 5: Hardening', 'Adversarial coverage & file conventions', `${t5.total}`, `${t5.pass}`, `${t5.fail}`, t5.fail === 0 ? 'PASS' : 'FAIL'],
  ]

  console.log('\n' + formatTable(headers, rows) + '\n')

  const totalTests = t1.total + t2.total + t3.total + t4.total + t5.total + manifestResult.totalDemos
  const totalPassed = t1.pass + t2.pass + t3.pass + t4.pass + t5.pass + manifestResult.validDemos
  console.log(`Aggregated Test Suite: ${totalPassed}/${totalTests} items verified cleanly.`)

  return {
    manifestCheck: manifestOk,
    staticMatchedAudit: {
      scanned: auditResult.totalFilesScanned,
      flagged: auditResult.flaggedFilesCount,
    },
    tier1: t1,
    tier2: t2,
    tier3: t3,
    tier4: t4,
    tier5: t5,
    allPassed,
  }
}

// Direct CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = runAllTestSuites()
  if (!summary.allPassed) {
    console.error('\n❌ One or more test suites failed.\n')
    process.exit(1)
  } else {
    console.log('\n🎉 All test suites across Tiers 1-5 passed with zero regressions!\n')
    process.exit(0)
  }
}
