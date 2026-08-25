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

export interface M3VerificationReport {
  totalM3Demos: number
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
}

export function runM3ChallengerHarness(): M3VerificationReport {
  console.log('============================================================')
  console.log('  CHALLENGER 1: Milestone M3 Empirical Verification Harness')
  console.log('============================================================\n')

  const manifest = loadDemosManifest()
  const demoKit = loadTsxComponent('packages/demo-kit/src/index.ts')
  const DemoGuideCard = demoKit.DemoGuideCard
  const DemoContainer = demoKit.DemoContainer
  const DemoPlaygroundCard = demoKit.DemoPlaygroundCard
  const ExpectedActualPanel = demoKit.ExpectedActualPanel
  const DemoDeepDiveCard = demoKit.DemoDeepDiveCard

  // 1. Identify all M3 demos
  const apiRefDemos = manifest.filter((d) => (d.doc || '').includes('3-api-reference'))
  const m2Urls = apiRefDemos.filter((d) => {
    return (
      (d.url.startsWith('file-conventions/') && !d.url.includes('proxy')) ||
      d.url.startsWith('components/') ||
      d.url.startsWith('directives/')
    )
  })
  const m3Demos = apiRefDemos.filter((d) => !m2Urls.some((m) => m.url === d.url))

  console.log(`Identified ${m3Demos.length} demos in Milestone M3 (Expected: 75)`)

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
  const m3Audits = globalResult.audits.filter((a) => m3Demos.some((m) => m.url === a.url))

  // 3. Detailed per-demo empirical verification
  for (let idx = 0; idx < m3Demos.length; idx++) {
    const demo = m3Demos[idx]
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
      if (guideHtml.includes('undefined') && !guide.concept.includes('undefined')) {
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
    const audit = m3Audits.find((a) => a.url === demo.url)
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

  // 4. Audit Critical Concept Error Fixes for M3
  const conceptFixAudits = [
    {
      name: 'functions/image-response/dynamic-receipt (Satori/ImageResponse vs OG discount)',
      passed: false,
      details: '',
    },
    {
      name: 'config/redirects/regex-pattern-matching (next.config redirects vs runtime redirect())',
      passed: false,
      details: '',
    },
    {
      name: 'config/redirects/header-query-condition (next.config has/missing conditions)',
      passed: false,
      details: '',
    },
    {
      name: 'edge/v8-lightweight/nodejs-modules-bailout (Node.js API bailout in V8 Edge)',
      passed: false,
      details: '',
    },
    {
      name: 'config/env/build-time-injection (env bundled into client/server vs secret isolation)',
      passed: false,
      details: '',
    },
  ]

  // Check 1: dynamic-receipt
  const receiptDemo = m3Audits.find((a) => a.url === 'functions/image-response/dynamic-receipt')
  if (receiptDemo?.guide) {
    const text = (receiptDemo.guide.concept + ' ' + receiptDemo.guide.steps.map((s) => s.description).join(' ')).toLowerCase()
    const valid = (text.includes('영수증') || text.includes('receipt') || text.includes('동적 이미지')) &&
                  !text.includes('할인 배너 og') &&
                  (text.includes('imageresponse') || text.includes('satori') || text.includes('png') || text.includes('svg'))
    conceptFixAudits[0].passed = valid
    conceptFixAudits[0].details = `Concept: "${receiptDemo.guide.concept.slice(0, 60)}..."`
  }

  // Check 2: regex-pattern-matching
  const redirectRegexDemo = m3Audits.find((a) => a.url === 'config/redirects/regex-pattern-matching')
  if (redirectRegexDemo?.guide) {
    const text = (redirectRegexDemo.guide.concept + ' ' + redirectRegexDemo.guide.steps.map((s) => s.description).join(' ')).toLowerCase()
    const valid = (text.includes('next.config') || text.includes('redirects') || text.includes('설정')) &&
                  (text.includes('정규식') || text.includes('regex') || text.includes('패턴') || text.includes('307') || text.includes('308'))
    conceptFixAudits[1].passed = valid
    conceptFixAudits[1].details = `Concept: "${redirectRegexDemo.guide.concept.slice(0, 60)}..."`
  }

  // Check 3: header-query-condition
  const redirectCondDemo = m3Audits.find((a) => a.url === 'config/redirects/header-query-condition')
  if (redirectCondDemo?.guide) {
    const text = (redirectCondDemo.guide.concept + ' ' + redirectCondDemo.guide.steps.map((s) => s.description).join(' ')).toLowerCase()
    const valid = (text.includes('has') || text.includes('missing') || text.includes('헤더') || text.includes('쿼리')) &&
                  (text.includes('next.config') || text.includes('redirects') || text.includes('조건부'))
    conceptFixAudits[2].passed = valid
    conceptFixAudits[2].details = `Concept: "${redirectCondDemo.guide.concept.slice(0, 60)}..."`
  }

  // Check 4: nodejs-modules-bailout
  const bailoutDemo = m3Audits.find((a) => a.url === 'edge/v8-lightweight/nodejs-modules-bailout')
  if (bailoutDemo?.guide) {
    const text = (bailoutDemo.guide.concept + ' ' + bailoutDemo.guide.steps.map((s) => s.description).join(' ')).toLowerCase()
    const valid = (text.includes('bailout') || text.includes('node') || text.includes('v8') || text.includes('edge')) &&
                  (text.includes('제약') || text.includes('미지원') || text.includes('런타임') || text.includes('fs') || text.includes('crypto'))
    conceptFixAudits[3].passed = valid
    conceptFixAudits[3].details = `Concept: "${bailoutDemo.guide.concept.slice(0, 60)}..."`
  }

  // Check 5: env build-time-injection
  const envDemo = m3Audits.find((a) => a.url === 'config/env/build-time-injection')
  if (envDemo?.guide) {
    const text = (envDemo.guide.concept + ' ' + envDemo.guide.steps.map((s) => s.description).join(' ')).toLowerCase()
    const valid = (text.includes('빌드') || text.includes('번들') || text.includes('주입') || text.includes('env') || text.includes('정적 치환'))
    conceptFixAudits[4].passed = valid
    conceptFixAudits[4].details = `Concept: "${envDemo.guide.concept.slice(0, 60)}..."`
  }

  const passedAll =
    m3Demos.length === 75 &&
    renderedCleanly === 75 &&
    ssrFailures.length === 0 &&
    gc01Violations.length === 0 &&
    gc02Violations.length === 0 &&
    gc04Violations.length === 0 &&
    gc05Violations.length === 0 &&
    gc06Violations.length === 0 &&
    gc07Violations.length === 0 &&
    conceptFixAudits.every((c) => c.passed)

  console.log('------------------------------------------------------------')
  console.log(`Total M3 Demos:              ${m3Demos.length}/75`)
  console.log(`SSR & 4-Tier Render Clean:   ${renderedCleanly}/75 (Failures: ${ssrFailures.length})`)
  console.log(`GC01 Template Fingerprints:  ${gc01Violations.length} violations`)
  console.log(`GC02 Step Sequence Dupes:    ${gc02Violations.length} violations`)
  console.log(`GC04 Observe Target Spec:    ${gc04Violations.length} violations`)
  console.log(`GC05 String/Entity Leaks:    ${gc05Violations.length} violations`)
  console.log(`GC06 Step Count & Indexing:  ${gc06Violations.length} violations`)
  console.log(`GC07 Concrete Values / IDs:  ${gc07Violations.length} violations`)
  console.log(`GC03 UI Label Quoting:       ${gc03Violations.length} warnings (${((75 - gc03Violations.length) / 75 * 100).toFixed(1)}% match rate)`)
  console.log('------------------------------------------------------------')
  console.log('Step Count Breakdown:')
  for (const [count, freq] of Object.entries(stepCountDistribution)) {
    console.log(`  - ${count} steps: ${freq} demos (${((freq / 75) * 100).toFixed(1)}%)`)
  }
  console.log('ObserveAt Location Breakdown:')
  for (const [loc, freq] of Object.entries(observeAtDistribution)) {
    console.log(`  - ${loc}: ${freq} demos (${((freq / 75) * 100).toFixed(1)}%)`)
  }
  console.log('------------------------------------------------------------')
  console.log('Critical Concept Error Verification:')
  for (const item of conceptFixAudits) {
    console.log(`  [${item.passed ? 'PASS' : 'FAIL'}] ${item.name}`)
    console.log(`         ${item.details}`)
  }
  console.log('------------------------------------------------------------')
  console.log(`OVERALL VERDICT: ${passedAll ? 'APPROVE' : 'REJECT'}`)
  console.log('============================================================\n')

  return {
    totalM3Demos: m3Demos.length,
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
  }
}

// If run directly
if (process.argv[1]?.endsWith('m3-challenger-harness.ts')) {
  const result = runM3ChallengerHarness()
  if (!result.passedAll) {
    process.exit(1)
  }
}
