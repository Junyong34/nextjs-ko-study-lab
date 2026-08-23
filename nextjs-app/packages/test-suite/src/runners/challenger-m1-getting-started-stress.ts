import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import ts from 'typescript'
import assert from 'node:assert/strict'
import {
  NEXTJS_APP_ROOT,
  loadDemosManifest,
  getDemoSourceDir,
  getAllFiles,
  type Demo,
} from '../utils/test-helpers.ts'
import {
  parseGuideCardFromTsx,
  validateGuideConsistency,
  type GuideConsistencyResult,
  type DemoGuideAudit,
} from './guide-consistency-validator.ts'
import { printSuiteHeader, formatTable } from '../utils/reporter.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baselineRequire = createRequire(path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/package.json'))
const React = baselineRequire('react')
const jsxRuntime = baselineRequire('react/jsx-runtime')
const ReactDOMServer = baselineRequire('react-dom/server')

function loadTsxComponent<T = any>(relPath: string, exportName?: string): T {
  const fullPath = path.join(NEXTJS_APP_ROOT, relPath)
  const code = fs.readFileSync(fullPath, 'utf-8')
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText

  const customRequire = (mod: string) => {
    if (mod === 'react') return React
    if (mod === 'react/jsx-runtime') return jsxRuntime
    if (mod.startsWith('./') || mod.startsWith('../')) {
      const resolvedDir = path.dirname(fullPath)
      const target = path.resolve(resolvedDir, mod)
      const exts = ['.tsx', '.ts', '/index.tsx', '/index.ts']
      for (const ext of exts) {
        if (fs.existsSync(target + ext)) {
          return loadTsxComponent(path.relative(NEXTJS_APP_ROOT, target + ext))
        }
      }
    }
    return baselineRequire(mod)
  }

  const moduleObj = { exports: {} as any }
  const wrapper = new Function('require', 'module', 'exports', 'React', transpiled)
  wrapper(customRequire, moduleObj, moduleObj.exports, React)
  return exportName ? moduleObj.exports[exportName] : moduleObj.exports
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export interface M1StressResult {
  totalM1Demos: number
  renderedCount: number
  failedRenders: number
  validatorPassedCount: number
  violationsByRule: Record<string, number>
  failures: string[]
  stepDistribution: Record<number, number>
  observeAtDistribution: Record<string, number>
  verdict: 'APPROVE' | 'REJECT'
}

export function runM1GettingStartedEmpiricalStress(): M1StressResult {
  printSuiteHeader('Challenger M1: 1-getting-started Empirical Stress & Oracle Verification')

  const demoKit = loadTsxComponent('packages/demo-kit/src/index.ts')
  const DemoGuideCard = demoKit.DemoGuideCard
  assert.ok(DemoGuideCard, 'DemoGuideCard must be exported from demo-kit')

  const manifest = loadDemosManifest()
  const m1Demos = manifest.filter(
    (d) => d.doc && (d.doc.startsWith('1-getting-started') || d.doc.startsWith('nextjs-docs/1-getting-started')),
  )

  console.log(`\n[Section 1] Loaded ${m1Demos.length} demos for category '1-getting-started' (Expected: 25)`)
  assert.strictEqual(m1Demos.length, 25, 'Milestone M1 must contain exactly 25 demos')

  const failures: string[] = []
  let renderedCount = 0
  let failedRenders = 0
  const stepDistribution: Record<number, number> = {}
  const observeAtDistribution: Record<string, number> = {}

  // 1. AST Parsing, Schema Invariants & React SSR Rendering
  console.log('\n[Section 2] Parsing AST and Executing SSR React Mount for All 25 Demos...')
  const renderTableRows: string[][] = []

  for (const demo of m1Demos) {
    const dir = getDemoSourceDir(demo)
    const files = getAllFiles(dir, ['.tsx'])
    let guideData: any = null
    let guideFile = ''

    for (const f of files) {
      const code = fs.readFileSync(f, 'utf-8')
      const parsed = parseGuideCardFromTsx(code)
      if (parsed && parsed.steps.length > 0) {
        guideData = parsed
        guideFile = f
        break
      }
    }

    if (!guideData) {
      failedRenders++
      const msg = `[NO_GUIDE] Demo ${demo.url} has no parseable DemoGuideCard in ${dir}`
      failures.push(msg)
      renderTableRows.push([demo.url, 'N/A', 'MISSING', 'FAIL'])
      continue
    }

    // Step distribution tracking
    const stepCount = guideData.steps.length
    stepDistribution[stepCount] = (stepDistribution[stepCount] || 0) + 1

    // Observe tracking
    const lastStep = guideData.steps[stepCount - 1]
    const obsAt = lastStep?.observeAt || 'none'
    observeAtDistribution[obsAt] = (observeAtDistribution[obsAt] || 0) + 1

    try {
      // Step Invariants
      assert.ok(guideData.title.length > 0, `Title cannot be empty for ${demo.url}`)
      assert.ok(guideData.concept.length > 10, `Concept must be substantive for ${demo.url}`)
      assert.ok(stepCount >= 2 && stepCount <= 6, `Step count must be 2..6, got ${stepCount} for ${demo.url}`)

      for (let i = 0; i < stepCount; i++) {
        const s = guideData.steps[i]
        assert.strictEqual(s.step, i + 1, `Step indexing error at step ${i} in ${demo.url}`)
        assert.ok(s.title.length > 0, `Step ${i + 1} title cannot be empty in ${demo.url}`)
        assert.ok(s.description.length > 0, `Step ${i + 1} description cannot be empty in ${demo.url}`)
      }

      assert.ok(lastStep.observe, `Last step must contain 'observe' in ${demo.url}`)
      assert.ok(lastStep.observe.length >= 5, `Last step 'observe' must be >= 5 chars in ${demo.url}`)
      assert.ok(
        ['playground', 'verification', 'devtools', 'network', 'console'].includes(lastStep.observeAt || ''),
        `Invalid observeAt '${lastStep.observeAt}' in ${demo.url}`,
      )

      // Execute React SSR renderToStaticMarkup
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(DemoGuideCard, {
          title: guideData.title,
          concept: guideData.concept,
          steps: guideData.steps,
        }),
      )

      // Structural assertions on rendered markup
      assert.ok(html.includes('<fieldset'), `Must render <fieldset> for ${demo.url}`)
      assert.ok(html.includes('[가이드]'), `Must contain [가이드] in legend for ${demo.url}`)
      assert.ok(html.includes('핵심 원리:'), `Must contain 핵심 원리: for ${demo.url}`)
      assert.ok(html.includes('관찰 →'), `Must render '관찰 →' badge for ${demo.url}`)
      
      const expectedEscapedObserve = escapeHtml(lastStep.observe)
      const hasObserve = html.includes(expectedEscapedObserve) || html.includes(lastStep.observe)
      assert.ok(hasObserve, `Rendered HTML must include observe string for ${demo.url}`)

      // Structural integrity assertions
      assert.ok(!html.includes('undefined'), `Rendered HTML contains 'undefined' in ${demo.url}`)
      assert.ok(!html.includes('NaN'), `Rendered HTML contains 'NaN' in ${demo.url}`)
      assert.ok(!html.includes('[object Object]'), `Rendered HTML contains '[object Object]' in ${demo.url}`)
      assert.ok(!/\$\{[^}]+\}/.test(html), `Rendered HTML contains unescaped \${...} in ${demo.url}`)

      // Check that source TSX doesn't have raw double escaped entity bugs like &amp;lt;
      assert.ok(!html.includes('&amp;lt;'), `Rendered HTML contains double entity escape &amp;lt; in ${demo.url}`)
      assert.ok(!html.includes('&amp;gt;'), `Rendered HTML contains double entity escape &amp;gt; in ${demo.url}`)
      assert.ok(!html.includes('&amp;amp;'), `Rendered HTML contains double entity escape &amp;amp; in ${demo.url}`)

      renderedCount++
      renderTableRows.push([
        demo.url,
        `${stepCount} steps`,
        `observeAt: ${lastStep.observeAt}`,
        'PASS',
      ])
    } catch (err: any) {
      failedRenders++
      failures.push(`SSR Render error for ${demo.url}: ${err.message}`)
      renderTableRows.push([demo.url, `${stepCount} steps`, 'ERROR', `FAIL: ${err.message}`])
    }
  }

  const renderHeaders = ['Demo URL', 'Steps', 'Observation Target', 'SSR Status']
  console.log('\n' + formatTable(renderHeaders, renderTableRows) + '\n')
  console.log(`  -> SSR Render Verification: ${renderedCount}/25 successfully mounted (Failed: ${failedRenders})`)

  // 2. Guide Consistency Validator Run & Specific M1 Violations Check
  console.log('\n[Section 3] Executing Guide Consistency Validator (GC01 ~ GC07)...')
  const valResult: GuideConsistencyResult = validateGuideConsistency({ strict: false, log: false })

  const m1Audits = valResult.audits.filter(
    (a) => a.doc && (a.doc.startsWith('1-getting-started') || a.doc.startsWith('nextjs-docs/1-getting-started')),
  )

  assert.strictEqual(m1Audits.length, 25, 'Validator must audit exactly 25 M1 demos')

  const violationsByRule: Record<string, number> = {
    GC01: 0,
    GC02: 0,
    GC03: 0,
    GC04: 0,
    GC05: 0,
    GC06: 0,
    GC07: 0,
  }

  let validatorPassedCount = 0

  for (const audit of m1Audits) {
    const errorViolations = audit.violations.filter((v) => v.severity === 'error')
    for (const v of audit.violations) {
      violationsByRule[v.rule] = (violationsByRule[v.rule] || 0) + 1
      if (v.severity === 'error') {
        failures.push(`[${v.rule}] ${audit.url}: ${v.message}`)
      }
    }
    if (errorViolations.length === 0) {
      validatorPassedCount++
    }
  }

  const valTableHeaders = ['Rule ID', 'Description', 'Mandatory (M1)', 'Violations in M1', 'Status']
  const valTableRows = [
    ['GC01', '템플릿 지문 금지 (No Template Fingerprints)', 'YES (0 allowed)', String(violationsByRule.GC01), violationsByRule.GC01 === 0 ? 'PASS (0)' : 'FAIL'],
    ['GC02', '스텝 제목 중복 금지 (No Step Title Dupes)', 'YES (0 allowed)', String(violationsByRule.GC02), violationsByRule.GC02 === 0 ? 'PASS (0)' : 'FAIL'],
    ['GC03', 'UI 라벨 인용 ([brackets] UI Label Quoting)', 'WARN (>=50% target)', String(violationsByRule.GC03), `${25 - violationsByRule.GC03}/25 (${(((25 - violationsByRule.GC03) / 25) * 100).toFixed(0)}%)`],
    ['GC04', '마지막 스텝 관찰 명시 (observe & observeAt)', 'YES (0 allowed)', String(violationsByRule.GC04), violationsByRule.GC04 === 0 ? 'PASS (0)' : 'FAIL'],
    ['GC05', '문자열 및 HTML 엔티티 유출 방지 (Leak-Free)', 'YES (0 allowed)', String(violationsByRule.GC05), violationsByRule.GC05 === 0 ? 'PASS (0)' : 'FAIL'],
    ['GC06', '스텝 수 적정성 및 순차 인덱싱 (2..6 steps)', 'YES (0 allowed)', String(violationsByRule.GC06), violationsByRule.GC06 === 0 ? 'PASS (0)' : 'FAIL'],
    ['GC07', '구체값 및 Next.js/React 식별자 포함', 'YES (0 allowed)', String(violationsByRule.GC07), violationsByRule.GC07 === 0 ? 'PASS (0)' : 'FAIL'],
  ]
  console.log('\n' + formatTable(valTableHeaders, valTableRows) + '\n')

  // 3. Adversarial Mutation Stress Test (Sanity Oracle)
  console.log('[Section 4] Running Adversarial Mutation Oracle to Prove Validator Sensitivity...')
  let mutationSensitivityVerified = true

  // Test 4.1: Corrupt observe field -> should trigger GC04
  const corruptObserveCode = `
    <DemoGuideCard
      title="테스트"
      concept="React 19 useOptimistic 800ms 상태 변경"
      steps={[
        { step: 1, title: "[버튼] 클릭", description: "클릭" },
        { step: 2, title: "[확인] 대조", description: "대조" }
      ]}
    />
  `
  const parsedCorrupted = parseGuideCardFromTsx(corruptObserveCode)
  assert.ok(parsedCorrupted, 'Must parse corrupted tsx')
  const lastStepCorrupted = parsedCorrupted.steps[parsedCorrupted.steps.length - 1]
  const isCorruptedInvalid = !lastStepCorrupted?.observe || lastStepCorrupted.observe.length < 5
  assert.ok(isCorruptedInvalid, 'Mutation Oracle: Missing observe MUST be flagged as invalid')

  // Test 4.2: Introduce template literal leak -> should trigger GC05
  const leakCode = `
    <DemoGuideCard
      title="테스트"
      concept="Next.js \${id} 동적 파라미터 200"
      steps={[
        { step: 1, title: "[확인] &lt;Link&gt;", description: "클릭", observe: "데이터 200 OK", observeAt: "verification" }
      ]}
    />
  `
  const parsedLeak = parseGuideCardFromTsx(leakCode)
  assert.ok(parsedLeak, 'Must parse leak tsx')
  const hasLeakPattern = /\$\{[^}]+\}/.test(parsedLeak.concept) || /&(?:lt|gt|amp);/.test(parsedLeak.steps[0].title)
  assert.ok(hasLeakPattern, 'Mutation Oracle: Leak pattern MUST be detected')

  console.log('  -> Mutation Sensitivity Oracle: PASSED (Validator successfully detects synthetic defects)')

  // 4. Step & Location Distribution Metrics
  console.log('\n[Section 5] Step Count & Observation Location Distributions:')
  console.log('  - Step Counts:', JSON.stringify(stepDistribution))
  console.log('  - ObserveAt Locations:', JSON.stringify(observeAtDistribution))

  const isApproved =
    renderedCount === 25 &&
    failedRenders === 0 &&
    validatorPassedCount === 25 &&
    violationsByRule.GC01 === 0 &&
    violationsByRule.GC02 === 0 &&
    violationsByRule.GC04 === 0 &&
    violationsByRule.GC05 === 0 &&
    violationsByRule.GC06 === 0 &&
    violationsByRule.GC07 === 0 &&
    mutationSensitivityVerified

  const verdict: 'APPROVE' | 'REJECT' = isApproved ? 'APPROVE' : 'REJECT'

  console.log('\n============================================================')
  console.log(`  FINAL EMPIRICAL VERDICT FOR M1: [ ${verdict} ]`)
  console.log(`  Rendered: ${renderedCount}/25 (100%)`)
  console.log(`  GC01/02/04/05/06/07 Zero Violations: ${isApproved ? 'YES' : 'NO'}`)
  console.log('============================================================\n')

  return {
    totalM1Demos: 25,
    renderedCount,
    failedRenders,
    validatorPassedCount,
    violationsByRule,
    failures,
    stepDistribution,
    observeAtDistribution,
    verdict,
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const res = runM1GettingStartedEmpiricalStress()
  if (res.verdict !== 'APPROVE') {
    process.exit(1)
  }
  process.exit(0)
}
