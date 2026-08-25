import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import {
  loadDemosManifest,
  getDemoSourceDir,
  getAllFiles,
  NEXTJS_APP_ROOT,
  type Demo,
} from '../utils/test-helpers.ts'
import {
  validateGuideConsistency,
  parseGuideCardFromTsx,
  extractPlaygroundMetadata,
  KNOWN_TEMPLATE_STEP_SETS,
  CONCEPT_TEMPLATE_PATTERNS,
  type GuideCardData,
} from './guide-consistency-validator.ts'

// SSR React setup
const baselineRequire = createRequire(path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/package.json'))
const React = baselineRequire('react')
const ReactDOMServer = baselineRequire('react-dom/server')

// Dynamic tsx component loader from demo-kit
import ts from 'typescript'

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
    if (mod === 'react/jsx-runtime') return baselineRequire('react/jsx-runtime')
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

export interface M4VerificationReport {
  totalM4Demos: number
  total2GuidesDemos: number
  total5ArchitectureDemos: number
  renderedCleanly: number
  ssrFailures: string[]
  gc01Violations: string[]
  gc02Violations: string[]
  gc03Violations: string[]
  gc04Violations: string[]
  gc05Violations: string[]
  gc06Violations: string[]
  gc07Violations: string[]
  conceptFixAudits: { name: string; passed: boolean; details: string }[]
  stepCountDistribution: Record<number, number>
  observeAtDistribution: Record<string, number>
  passedAll: boolean
  all241Valid: boolean
  all241AuditSummary: {
    total: number
    valid: number
    gc01: number
    gc02: number
    gc04: number
    gc05: number
    gc06: number
    gc07: number
  }
}

export function runM4ChallengerHarness(): M4VerificationReport {
  console.log('============================================================')
  console.log('  CHALLENGER 1: Milestone M4 Empirical Verification Harness')
  console.log('============================================================\n')

  const manifest = loadDemosManifest()
  const demoKit = loadTsxComponent('packages/demo-kit/src/index.ts')
  const DemoGuideCard = demoKit.DemoGuideCard
  const DemoContainer = demoKit.DemoContainer
  const DemoPlaygroundCard = demoKit.DemoPlaygroundCard
  const ExpectedActualPanel = demoKit.ExpectedActualPanel
  const DemoDeepDiveCard = demoKit.DemoDeepDiveCard

  // 1. Identify all M4 demos (2-guides/* and 5-architecture/*)
  const getCat = (doc: string) => {
    const norm = (doc || '').replace(/^\/?(nextjs-docs\/)?/, '')
    const seg = norm.split('/')[0] || ''
    return seg
  }

  const guidesDemos = manifest.filter((d) => getCat(d.doc) === '2-guides')
  const archDemos = manifest.filter((d) => getCat(d.doc) === '5-architecture')
  const m4Demos = [...guidesDemos, ...archDemos]

  console.log(`Identified ${guidesDemos.length} demos in 2-guides (Expected: 77)`)
  console.log(`Identified ${archDemos.length} demos in 5-architecture (Expected: 4)`)
  console.log(`Total M4 Demos identified: ${m4Demos.length} (Expected: 81)\n`)

  const ssrFailures: string[] = []
  const gc01Violations: string[] = []
  const gc02Violations: string[] = []
  const gc03Violations: string[] = []
  const gc04Violations: string[] = []
  const gc05Violations: string[] = []
  const gc06Violations: string[] = []
  const gc07Violations: string[] = []
  const stepCountDistribution: Record<number, number> = {}
  const observeAtDistribution: Record<string, number> = {}

  let renderedCleanly = 0

  // 2. Global consistency validator run
  const globalResult = validateGuideConsistency({ strict: false, log: false })
  const m4Audits = globalResult.audits.filter((a) => m4Demos.some((m) => m.url === a.url))

  // 3. Detailed per-demo empirical verification across all 81 M4 demos
  for (let idx = 0; idx < m4Demos.length; idx++) {
    const demo = m4Demos[idx]
    const dir = getDemoSourceDir(demo)
    const files = getAllFiles(dir, ['.tsx', '.ts'])

    // Find GuideCard
    let guide: GuideCardData | null = null
    const rootEntries = [path.join(dir, 'page.tsx'), path.join(dir, 'layout.tsx')]
    for (const entry of rootEntries) {
      if (!fs.existsSync(entry)) continue
      const text = fs.readFileSync(entry, 'utf-8')
      if (!text.includes('DemoGuideCard')) continue
      guide = parseGuideCardFromTsx(text)
      if (guide && guide.steps.length > 0) break
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

    if (!guide) {
      ssrFailures.push(`[${demo.url}] Could not parse DemoGuideCard from source files`)
      continue
    }

    // Record step count distribution
    const stepCount = guide.steps.length
    stepCountDistribution[stepCount] = (stepCountDistribution[stepCount] || 0) + 1

    // Record observeAt distribution
    const lastStep = guide.steps[guide.steps.length - 1]
    const loc = lastStep?.observeAt || 'none'
    observeAtDistribution[loc] = (observeAtDistribution[loc] || 0) + 1

    // Empirical SSR Rendering test
    try {
      // 1. Render DemoGuideCard standalone
      const guideHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(DemoGuideCard, {
          title: guide.title,
          concept: guide.concept,
          steps: guide.steps,
        }),
      )

      const escapeHtml = (str: string) =>
        str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')

      // Verification checks on HTML
      if (!guideHtml.includes('<fieldset')) {
        throw new Error('Rendered HTML does not contain <fieldset>')
      }
      if (!guideHtml.includes(`[가이드] ${escapeHtml(guide.title)}`)) {
        throw new Error(`Rendered HTML does not contain title "[가이드] ${escapeHtml(guide.title)}"`)
      }
      if (!guideHtml.includes('핵심 원리:</span>')) {
        throw new Error('Rendered HTML does not contain concept prefix "핵심 원리:</span>"')
      }
      if (!guideHtml.includes('관찰 →')) {
        throw new Error('Rendered HTML does not render "관찰 →"')
      }
      if (lastStep?.observe && !guideHtml.includes(escapeHtml(lastStep.observe))) {
        throw new Error(`Rendered HTML missing final observe text "${escapeHtml(lastStep.observe)}"`)
      }
      if (lastStep?.observeAt) {
        const badgeMap: Record<string, string> = {
          playground: '실습 영역',
          verification: '검증 패널',
          devtools: 'DevTools',
          network: 'Network',
          console: 'Console',
        }
        const expectedBadge = badgeMap[lastStep.observeAt] || lastStep.observeAt
        if (!guideHtml.includes(expectedBadge)) {
          throw new Error(`Rendered HTML missing observeAt badge "${expectedBadge}"`)
        }
      }

      // Check for illegal strings in rendered HTML
      const allGuideText = [
        guide.concept,
        ...guide.steps.flatMap((s) => [s.title, s.description, s.actionBadge || '', s.observe || '']),
      ].join(' ')

      if (guideHtml.includes('undefined') && !allGuideText.includes('undefined')) {
        throw new Error('Rendered HTML contains unexpected "undefined"')
      }
      if (guideHtml.includes('NaN')) {
        throw new Error('Rendered HTML contains "NaN"')
      }
      if (guideHtml.includes('[object Object]')) {
        throw new Error('Rendered HTML contains "[object Object]"')
      }

      // 2. Render Full 4-Tier Container
      const fullHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(
          DemoContainer,
          null,
          React.createElement(DemoGuideCard, {
            title: guide.title,
            concept: guide.concept,
            steps: guide.steps,
          }),
          React.createElement(DemoPlaygroundCard, { title: '실습' }, React.createElement('div', null, '실습 내용')),
          React.createElement(ExpectedActualPanel, {
            title: '검증',
            expected: '정상',
            actual: '정상',
            isMatched: true,
          }),
          React.createElement(DemoDeepDiveCard, { title: '심층 분석' }, React.createElement('p', null, '개념')),
        ),
      )

      const fieldsetCount = (fullHtml.match(/<fieldset/g) || []).length
      if (fieldsetCount !== 4) {
        throw new Error(`Expected 4 fieldset sections in 4-tier layout, got ${fieldsetCount}`)
      }

      renderedCleanly++
    } catch (err: any) {
      ssrFailures.push(`[${demo.url}] SSR Error: ${err.message}`)
    }

    // GC Violations from audit
    const audit = m4Audits.find((a) => a.url === demo.url)
    if (audit) {
      for (const v of audit.violations) {
        const msg = `[${demo.url}] ${v.message}`
        if (v.rule === 'GC01') gc01Violations.push(msg)
        if (v.rule === 'GC02') gc02Violations.push(msg)
        if (v.rule === 'GC03') gc03Violations.push(msg)
        if (v.rule === 'GC04') gc04Violations.push(msg)
        if (v.rule === 'GC05') gc05Violations.push(msg)
        if (v.rule === 'GC06') gc06Violations.push(msg)
        if (v.rule === 'GC07') gc07Violations.push(msg)
      }
    }
  }

  // 4. Audit Critical Concept Error Fixes for M4
  // Concept Error #2: guides/server-actions/start-transition (programmatic startTransition vs useActionState/useFormStatus form)
  const conceptFixAudits = [
    {
      name: 'guides/server-actions/start-transition (programmatic startTransition vs form action state)',
      passed: false,
      details: '',
    },
  ]

  const startTransitionDemo = m4Audits.find((a) => a.url === 'guides/server-actions/start-transition')
  if (startTransitionDemo?.guide) {
    const text = (startTransitionDemo.guide.concept + ' ' + startTransitionDemo.guide.steps.map((s) => s.description).join(' ')).toLowerCase()
    const valid = (text.includes('starttransition') || text.includes('비동기 트랜지션')) &&
                  (text.includes('ispending') || text.includes('로딩') || text.includes('지연') || text.includes('600ms')) &&
                  !text.includes('useactionstate') &&
                  !text.includes('useformstatus')
    conceptFixAudits[0].passed = valid
    conceptFixAudits[0].details = `Concept: "${startTransitionDemo.guide.concept.slice(0, 70)}..."`
  }

  // 5. Stress-test across all 241 demos
  const all241Summary = {
    total: globalResult.totalDemos,
    valid: globalResult.validDemos,
    gc01: globalResult.ruleStats.GC01.violations,
    gc02: globalResult.ruleStats.GC02.violations,
    gc04: globalResult.ruleStats.GC04.violations,
    gc05: globalResult.ruleStats.GC05.violations,
    gc06: globalResult.ruleStats.GC06.violations,
    gc07: globalResult.ruleStats.GC07.violations,
  }

  const all241Valid =
    all241Summary.total === 241 &&
    all241Summary.valid === 241 &&
    all241Summary.gc01 === 0 &&
    all241Summary.gc02 === 0 &&
    all241Summary.gc04 === 0 &&
    all241Summary.gc05 === 0 &&
    all241Summary.gc06 === 0 &&
    all241Summary.gc07 === 0

  const passedAll =
    m4Demos.length === 81 &&
    renderedCleanly === 81 &&
    ssrFailures.length === 0 &&
    gc01Violations.length === 0 &&
    gc02Violations.length === 0 &&
    gc04Violations.length === 0 &&
    gc05Violations.length === 0 &&
    gc06Violations.length === 0 &&
    gc07Violations.length === 0 &&
    conceptFixAudits.every((c) => c.passed) &&
    all241Valid

  console.log('------------------------------------------------------------')
  console.log(`Total M4 Demos:              ${m4Demos.length}/81 (2-guides: ${guidesDemos.length}, 5-architecture: ${archDemos.length})`)
  console.log(`SSR & 4-Tier Render Clean:   ${renderedCleanly}/81 (Failures: ${ssrFailures.length})`)
  console.log(`GC01 Template Fingerprints:  ${gc01Violations.length} violations`)
  console.log(`GC02 Step Sequence Dupes:    ${gc02Violations.length} violations`)
  console.log(`GC04 Observe Target Spec:    ${gc04Violations.length} violations`)
  console.log(`GC05 String/Entity Leaks:    ${gc05Violations.length} violations`)
  console.log(`GC06 Step Count & Indexing:  ${gc06Violations.length} violations`)
  console.log(`GC07 Concrete Values / IDs:  ${gc07Violations.length} violations`)
  console.log(`GC03 UI Label Quoting:       ${gc03Violations.length} warnings (${((81 - gc03Violations.length) / 81 * 100).toFixed(1)}% match rate)`)
  console.log('------------------------------------------------------------')
  console.log('M4 Step Count Breakdown:')
  for (const [count, freq] of Object.entries(stepCountDistribution)) {
    console.log(`  - ${count} steps: ${freq} demos (${((freq / 81) * 100).toFixed(1)}%)`)
  }
  console.log('M4 ObserveAt Location Breakdown:')
  for (const [loc, freq] of Object.entries(observeAtDistribution)) {
    console.log(`  - ${loc}: ${freq} demos (${((freq / 81) * 100).toFixed(1)}%)`)
  }
  console.log('------------------------------------------------------------')
  console.log('Critical Concept Error Verification:')
  for (const item of conceptFixAudits) {
    console.log(`  [${item.passed ? 'PASS' : 'FAIL'}] ${item.name}`)
    console.log(`         ${item.details}`)
  }
  console.log('------------------------------------------------------------')
  console.log('Full Repo 241 Demos Audit Summary:')
  console.log(`  - Total Demos: ${all241Summary.total}/241`)
  console.log(`  - Valid Demos (0 errors): ${all241Summary.valid}/241 (100%)`)
  console.log(`  - GC01 Errors: ${all241Summary.gc01}`)
  console.log(`  - GC02 Errors: ${all241Summary.gc02}`)
  console.log(`  - GC04 Errors: ${all241Summary.gc04}`)
  console.log(`  - GC05 Errors: ${all241Summary.gc05}`)
  console.log(`  - GC06 Errors: ${all241Summary.gc06}`)
  console.log(`  - GC07 Errors: ${all241Summary.gc07}`)
  console.log('------------------------------------------------------------')
  console.log(`OVERALL VERDICT: ${passedAll ? 'APPROVE' : 'REJECT'}`)
  console.log('============================================================\n')

  return {
    totalM4Demos: m4Demos.length,
    total2GuidesDemos: guidesDemos.length,
    total5ArchitectureDemos: archDemos.length,
    renderedCleanly,
    ssrFailures,
    gc01Violations,
    gc02Violations,
    gc03Violations,
    gc04Violations,
    gc05Violations,
    gc06Violations,
    gc07Violations,
    conceptFixAudits,
    stepCountDistribution,
    observeAtDistribution,
    passedAll,
    all241Valid,
    all241AuditSummary: all241Summary,
  }
}

// If run directly
if (process.argv[1]?.endsWith('m4-challenger-harness.ts')) {
  const result = runM4ChallengerHarness()
  if (!result.passedAll) {
    process.exit(1)
  }
}
