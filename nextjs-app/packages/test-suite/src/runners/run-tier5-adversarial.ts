import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { printSuiteHeader, formatTable } from '../utils/reporter.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PACKAGE_ROOT = path.resolve(__dirname, '../..')

export function runTier5AdversarialHardening() {
  printSuiteHeader('Milestone M5: Tier 5 Adversarial Coverage Hardening Suite')

  const start = Date.now()
  const res = spawnSync(
    'node',
    [
      '--test',
      '--experimental-strip-types',
      '--disable-warning=ExperimentalWarning',
      'src/tier5-adversarial-hardening/*.test.ts',
    ],
    {
      cwd: PACKAGE_ROOT,
      encoding: 'utf-8',
      shell: true,
    }
  )
  const durationMs = Date.now() - start
  const output = res.stdout + '\n' + res.stderr

  console.log(output)

  const passMatch = output.match(/# pass (\d+)/)
  const failMatch = output.match(/# fail (\d+)/)
  const totalMatch = output.match(/# tests (\d+)/)

  const pass = passMatch ? parseInt(passMatch[1], 10) : 0
  const fail = failMatch ? parseInt(failMatch[1], 10) : 0
  const total = totalMatch ? parseInt(totalMatch[1], 10) : pass + fail

  const headers = ['Suite', 'Scope', 'Total Cases', 'Passed', 'Failed', 'Duration', 'Status']
  const rows = [
    [
      'Tier 5 Adversarial Hardening',
      'Authentic File Conventions, Outliers, 3-State Footer AST & Oracle',
      `${total}`,
      `${pass}`,
      `${fail}`,
      `${durationMs}ms`,
      fail === 0 ? 'PASS' : 'FAIL',
    ],
  ]

  console.log('\n' + formatTable(headers, rows) + '\n')

  return { total, pass, fail, durationMs, success: fail === 0 && pass > 0 }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = runTier5AdversarialHardening()
  if (!result.success) {
    console.error('\n❌ Tier 5 Adversarial Hardening Failed.\n')
    process.exit(1)
  } else {
    console.log(`\n🎉 Tier 5 Adversarial Hardening Passed (${result.pass}/${result.total} cases in ${result.durationMs}ms)!\n`)
    process.exit(0)
  }
}
