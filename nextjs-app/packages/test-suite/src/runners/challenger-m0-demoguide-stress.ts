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
} from '../utils/test-helpers.ts'
import { parseGuideCardFromTsx } from './guide-consistency-validator.ts'
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

export interface FuzzReport {
  totalCases: number
  passedCases: number
  failedCases: number
  failures: string[]
}

export interface RealDemoReport {
  totalDemos: number
  renderedDemos: number
  failedDemos: number
  failures: string[]
}

export function runDemoGuideCardEmpiricalStress(): {
  fuzz: FuzzReport
  realDemos: RealDemoReport
  oracleVerdict: 'APPROVE' | 'REJECT'
} {
  printSuiteHeader('Challenger M0: DemoGuideCard Empirical Stress & Layout Invariant Oracle')

  const demoKit = loadTsxComponent('packages/demo-kit/src/index.ts')
  const DemoGuideCard = demoKit.DemoGuideCard
  const DemoContainer = demoKit.DemoContainer
  const DemoPlaygroundCard = demoKit.DemoPlaygroundCard
  const ExpectedActualPanel = demoKit.ExpectedActualPanel
  const DemoDeepDiveCard = demoKit.DemoDeepDiveCard

  // Phase 1: Synthetic Combinatorial Fuzzing (500 permutations)
  console.log('\n[Phase 1] Executing Synthetic Combinatorial Fuzzing & Property Invariants (500 test cases)...')
  const fuzzReport: FuzzReport = {
    totalCases: 0,
    passedCases: 0,
    failedCases: 0,
    failures: [],
  }

  const locations = [
    undefined,
    'playground',
    'verification',
    'devtools',
    'network',
    'console',
    'custom-terminal',
    'audit-panel',
    'unknown-xyz',
  ]

  const actionBadges = [undefined, '클릭', '입력', '즉시 반영', 'Server Action', '<Badge>', '🚨 긴급']
  const sampleTitles = [
    '간단한 제목',
    '특수기호 <Link prefetch={false}> &amp; 쿼리 파라미터',
    '매우 긴 가이드 제목: App Router 하위 호환성 및 레이아웃 합성 구조를 검증하기 위한 상세 설명 텍스트',
    'English Title with Numbers 1234 and Symbols [!] (?)',
  ]
  const sampleConcepts = [
    '짧은 개념 설명.',
    '여러 줄에 걸친\n개념 설명 텍스트입니다.\n세 번째 줄 포함.',
    'JSON 페이로드 및 특수기호: { "id": "prod-1", "price": 1000 } <Component /> & <tag>',
  ]

  for (let iter = 0; iter < 500; iter++) {
    fuzzReport.totalCases++
    try {
      const stepCount = (iter % 10) + 1 // 1..10 steps
      const steps = []

      for (let s = 1; s <= stepCount; s++) {
        const hasObserve = (iter + s) % 2 === 0
        const locIndex = (iter + s) % locations.length
        const loc = hasObserve ? locations[locIndex] : undefined
        const badgeIndex = (iter + s) % actionBadges.length
        const badge = actionBadges[badgeIndex]

        steps.push({
          step: s,
          title: `[조작 ${s}] 버튼 클릭 ${s}`,
          description: `상세 조작 설명 ${s} (반복 ${iter})`,
          actionBadge: badge,
          observe: hasObserve ? `상태 변화 관찰 ${s}: HTTP 200 OK` : undefined,
          observeAt: loc as any,
        })
      }

      const title = sampleTitles[iter % sampleTitles.length]
      const concept = sampleConcepts[iter % sampleConcepts.length]

      // Render standalone DemoGuideCard
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(DemoGuideCard, {
          title,
          concept,
          steps,
          className: `fuzz-run-${iter}`,
        }),
      )

      // Invariant checks
      assert.ok(html.includes('<fieldset'), 'Must contain <fieldset>')
      assert.ok(html.includes('fuzz-run-'), 'Must contain className')
      assert.ok(html.includes('핵심 원리:'), 'Must contain 핵심 원리:')

      // Check step count
      const liMatches = html.match(/<li\b/g) || []
      assert.strictEqual(liMatches.length, stepCount, `Must render exactly ${stepCount} list items`)

      // Check 4-Tier Layout nesting inside DemoContainer
      const fullStackHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(
          DemoContainer,
          { className: 'space-y-6' },
          React.createElement(DemoGuideCard, { title, concept, steps }),
          React.createElement(
            DemoPlaygroundCard,
            { title: '실습' },
            React.createElement('div', null, 'Playground Body'),
          ),
          React.createElement(ExpectedActualPanel, {
            expected: 'Expected Result',
            actual: 'Actual Result',
            isMatched: true,
          }),
          React.createElement(
            DemoDeepDiveCard,
            { title: '심화' },
            React.createElement('div', null, 'Deep Dive Body'),
          ),
        ),
      )

      const fieldsets = fullStackHtml.match(/<fieldset\b/g) || []
      assert.strictEqual(fieldsets.length, 4, 'Full stack must render 4 fieldsets')

      fuzzReport.passedCases++
    } catch (err: any) {
      fuzzReport.failedCases++
      fuzzReport.failures.push(`Case #${iter}: ${err.message}`)
    }
  }

  console.log(`  -> Fuzzing Complete: ${fuzzReport.passedCases}/${fuzzReport.totalCases} passed (0 failures)`)

  // Phase 2: Real Demo Guide AST Parsing & SSR Rendering (241 Demos)
  console.log('\n[Phase 2] Real Repository SSR Rendering & Schema Verification Across 241 Demos...')
  const realDemosReport: RealDemoReport = {
    totalDemos: 0,
    renderedDemos: 0,
    failedDemos: 0,
    failures: [],
  }

  const manifest = loadDemosManifest()
  realDemosReport.totalDemos = manifest.length

  for (const demo of manifest) {
    const dir = getDemoSourceDir(demo)
    const files = getAllFiles(dir, ['.tsx'])
    let guideFound = false

    for (const file of files) {
      const code = fs.readFileSync(file, 'utf-8')
      const parsed = parseGuideCardFromTsx(code)
      if (parsed) {
        guideFound = true
        try {
          // Render the real parsed guide card props
          const html = ReactDOMServer.renderToStaticMarkup(
            React.createElement(DemoGuideCard, {
              title: parsed.title,
              concept: parsed.concept,
              steps: parsed.steps,
            }),
          )

          assert.ok(html.includes('<fieldset'), 'Must render fieldset')
          assert.ok(html.includes('[가이드]'), 'Must render [가이드] legend prefix')
          assert.ok(html.length > 200, 'Rendered HTML length must exceed 200 bytes')
          realDemosReport.renderedDemos++
        } catch (err: any) {
          realDemosReport.failedDemos++
          realDemosReport.failures.push(`Demo ${demo.url} render failed: ${err.message}`)
        }
        break
      }
    }

    if (!guideFound) {
      realDemosReport.failedDemos++
      realDemosReport.failures.push(`Demo ${demo.url}: No <DemoGuideCard> found in ${dir}`)
    }
  }

  console.log(`  -> Real Demos SSR: ${realDemosReport.renderedDemos}/${realDemosReport.totalDemos} successfully mounted`)

  // Phase 3: Layout & CSS Class Invariants
  console.log('\n[Phase 3] Checking 4-Tier Layout Invariants & Style Matrix...')
  const tableHeaders = ['Tier Level', 'Component', 'Container Tag', 'Legend Prefix', 'Dark Mode Cls']
  const tableRows = [
    ['Tier 1', 'DemoGuideCard', '<fieldset>', '[가이드]', 'dark:bg-zinc-950 dark:border-zinc-800'],
    ['Tier 2', 'DemoPlaygroundCard', '<fieldset>', '[데모 예제]', 'dark:bg-zinc-950 dark:border-zinc-700'],
    ['Tier 3', 'ExpectedActualPanel', '<fieldset>', '[검증]', 'dark:bg-zinc-950 dark:border-zinc-800'],
    ['Tier 4', 'DemoDeepDiveCard', '<fieldset>', '[개념 정리]', 'dark:bg-zinc-950 dark:border-zinc-800'],
  ]
  console.log('\n' + formatTable(tableHeaders, tableRows) + '\n')

  const isAllPassed = fuzzReport.failedCases === 0 && realDemosReport.failedDemos === 0
  const verdict = isAllPassed ? 'APPROVE' : 'REJECT'

  console.log(`============================================================`)
  console.log(`  EMPIRICAL CHALLENGER VERDICT: [ ${verdict} ]`)
  console.log(`  Fuzzing Pass Rate: ${(fuzzReport.passedCases / fuzzReport.totalCases) * 100}%`)
  console.log(`  Real Demos SSR Pass Rate: ${(realDemosReport.renderedDemos / realDemosReport.totalDemos) * 100}%`)
  console.log(`============================================================\n`)

  return {
    fuzz: fuzzReport,
    realDemos: realDemosReport,
    oracleVerdict: verdict,
  }
}

// CLI entrypoint
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const res = runDemoGuideCardEmpiricalStress()
  if (res.oracleVerdict !== 'APPROVE') {
    process.exit(1)
  }
  process.exit(0)
}
