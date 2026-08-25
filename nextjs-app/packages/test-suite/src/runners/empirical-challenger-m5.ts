import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'
import assert from 'node:assert/strict'
import {
  loadDemosManifest,
  getDemoSourceDir,
  NEXTJS_APP_ROOT,
} from '../utils/test-helpers.ts'
import {
  parseGuideCardFromTsx,
  validateGuideConsistency,
} from './guide-consistency-validator.ts'

console.log('============================================================')
console.log('  CHALLENGER 1: Empirical M5 Full Verification & Stress Harness')
console.log('============================================================\n')

const baseRequire = createRequire(path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/package.json'))
const React = baseRequire('react')
const ReactDOMServer = baseRequire('react-dom/server')
const JsxRuntime = baseRequire('react/jsx-runtime')

// Transpile real DemoGuideCard component from source
const guideCardSourcePath = path.join(NEXTJS_APP_ROOT, 'packages/demo-kit/src/DemoGuideCard.tsx')
assert.ok(fs.existsSync(guideCardSourcePath), 'DemoGuideCard.tsx source must exist')
const guideCardSource = fs.readFileSync(guideCardSourcePath, 'utf-8')

const transpiledGuideCard = ts.transpileModule(guideCardSource, {
  compilerOptions: {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText

const moduleObj: { exports: { DemoGuideCard?: any } } = { exports: {} }
const customRequire = (name: string) => {
  if (name === 'react') return React
  if (name === 'react/jsx-runtime') return JsxRuntime
  return {}
}
const wrapper = new Function('require', 'module', 'exports', 'React', transpiledGuideCard)
wrapper(customRequire, moduleObj, moduleObj.exports, React)

const DemoGuideCard = moduleObj.exports.DemoGuideCard
assert.ok(DemoGuideCard, 'Real DemoGuideCard component must be loaded')

const demos = loadDemosManifest()
console.log(`[TEST 1] Rendering all ${demos.length} demos with real DemoGuideCard through React SSR...`)

let renderSuccessCount = 0
let renderFailCount = 0
const renderErrors: string[] = []

const stepDistribution: Record<number, number> = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
let observeFieldCount = 0
let lastStepObserveCount = 0

for (let idx = 0; idx < demos.length; idx++) {
  const demo = demos[idx]
  const dir = getDemoSourceDir(demo)
  const pageFile = path.join(dir, 'page.tsx')
  const layoutFile = path.join(dir, 'layout.tsx')

  let guideData = null
  for (const entry of [pageFile, layoutFile]) {
    if (fs.existsSync(entry)) {
      const content = fs.readFileSync(entry, 'utf-8')
      if (content.includes('DemoGuideCard')) {
        guideData = parseGuideCardFromTsx(content)
        if (guideData && guideData.steps.length > 0) {
          break
        }
      }
    }
  }

  if (!guideData || guideData.steps.length === 0) {
    const list = fs.readdirSync(dir).filter((f) => f.endsWith('.tsx'))
    for (const f of list) {
      const full = path.join(dir, f)
      const content = fs.readFileSync(full, 'utf-8')
      if (content.includes('DemoGuideCard')) {
        guideData = parseGuideCardFromTsx(content)
        if (guideData && guideData.steps.length > 0) {
          break
        }
      }
    }
  }

  if (!guideData || guideData.steps.length === 0) {
    renderFailCount++
    renderErrors.push(`[${demo.url}] Failed to parse GuideCardData from ${dir}`)
    continue
  }

  // Record step distribution
  const stepCount = guideData.steps.length
  stepDistribution[stepCount] = (stepDistribution[stepCount] || 0) + 1

  // Check last step observe
  const lastStep = guideData.steps[guideData.steps.length - 1]
  if (lastStep && lastStep.observe && lastStep.observe.trim().length >= 5) {
    lastStepObserveCount++
  }

  // Check observe fields across all steps
  for (const s of guideData.steps) {
    if (s.observe) observeFieldCount++
  }

  // Execute React SSR Render!
  try {
    const element = React.createElement(DemoGuideCard, {
      title: guideData.title,
      concept: guideData.concept,
      steps: guideData.steps,
    })
    const html = ReactDOMServer.renderToStaticMarkup(element)

    // Integrity checks on rendered HTML
    assert.ok(html.length > 100, `Rendered HTML must be substantial (>100 bytes), got ${html.length}`)
    assert.ok(html.includes('[가이드]'), 'Rendered HTML must include fieldset legend [가이드]')
    assert.ok(html.includes('핵심 원리:'), 'Rendered HTML must include 핵심 원리:')

    // If observe is present on last step, check that 관찰 → is rendered
    if (lastStep && lastStep.observe) {
      assert.ok(
        html.includes('관찰 →'),
        `Rendered HTML must contain '관찰 →' for demo ${demo.url}`,
      )
    }

    // Check for raw unescaped template literal or double-escaped entity leaks in rendered HTML
    assert.doesNotMatch(html, /\$\{[^}]+\}/, `HTML leaked template literal in ${demo.url}`)
    assert.doesNotMatch(html, /&amp;(?:lt|gt|amp|quot|apos|#39|#123|#125);/i, `HTML leaked double-escaped entities in ${demo.url}`)
    assert.doesNotMatch(html, /\b(?:TODO|FIXME|TBD)\b|undefined\s*입니다|NaN원/i, `HTML leaked placeholders in ${demo.url}`)

    renderSuccessCount++
  } catch (err: any) {
    renderFailCount++
    renderErrors.push(`[${demo.url}] SSR Render Crash: ${err.message}`)
  }
}

console.log(`\n  ✅ SSR Rendering Result: ${renderSuccessCount}/${demos.length} Passed (0 Crashes)`)
if (renderFailCount > 0) {
  console.error(`  ❌ SSR Render Failures:\n${renderErrors.join('\n')}`)
}
assert.strictEqual(renderSuccessCount, demos.length, 'All 241 demos must render successfully without SSR crash')

console.log('\n[TEST 2] Step Count Distribution & 3-Step Ratio Check...')
for (const [steps, count] of Object.entries(stepDistribution)) {
  const pct = ((count / demos.length) * 100).toFixed(2)
  console.log(`  Step ${steps}: ${count} demos (${pct}%)`)
}
const threeStepRatio = ((stepDistribution[3] / demos.length) * 100).toFixed(2)
console.log(`  -> 3-Step Ratio: ${threeStepRatio}% (Acceptance criterion: <= 70.0%)`)
assert.ok(
  stepDistribution[3] / demos.length <= 0.7,
  `3-Step ratio (${threeStepRatio}%) exceeds maximum limit of 70%`,
)

console.log('\n[TEST 3] Last-Step Observe Specification Coverage...')
console.log(`  Last step observe count: ${lastStepObserveCount}/${demos.length} (100%)`)
console.log(`  Total observe annotations across all steps: ${observeFieldCount}`)
assert.strictEqual(lastStepObserveCount, demos.length, 'All 241 demos must have observe on last step')

console.log('\n[TEST 4] AST Parsing & Syntactic Soundness of all 241 page.tsx files...')
let astParseErrors = 0
for (const demo of demos) {
  const dir = getDemoSourceDir(demo)
  const pageFile = path.join(dir, 'page.tsx')
  if (!fs.existsSync(pageFile)) {
    astParseErrors++
    console.error(`Missing page.tsx at ${pageFile}`)
    continue
  }
  const content = fs.readFileSync(pageFile, 'utf-8')
  const sf = ts.createSourceFile(pageFile, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const diags = (sf as any).parseDiagnostics || []
  if (diags.length > 0) {
    astParseErrors++
    console.error(`AST Parse error in ${pageFile}:`, diags)
  }
}
console.log(`  ✅ AST Parse Result: ${demos.length - astParseErrors}/${demos.length} Valid (0 Parse Errors)`)
assert.strictEqual(astParseErrors, 0, 'Zero AST parse errors allowed')

console.log('\n[TEST 5] Guide Consistency Stress Audit (GC01 ~ GC07)...')
const result = validateGuideConsistency({ log: false })

console.log(`  GC01 (Template Fingerprints) Violations: ${result.ruleStats.GC01.violations} (Target: 0)`)
console.log(`  GC02 (Step Sequence Duplicates) Violations: ${result.ruleStats.GC02.violations} (Target: 0)`)
console.log(`  GC03 (UI Label Quoting) Pass Rate: ${result.ruleStats.GC03.passRate.toFixed(1)}% (${result.ruleStats.GC03.passed}/${demos.length}) (Target: >= 90%)`)
console.log(`  GC04 (Observe Target Specification) Violations: ${result.ruleStats.GC04.violations} (Target: 0)`)
console.log(`  GC05 (String & Entity Leaks) Violations: ${result.ruleStats.GC05.violations} (Target: 0)`)
console.log(`  GC06 (Step Count Sanity & Sequence) Violations: ${result.ruleStats.GC06.violations} (Target: 0)`)
console.log(`  GC07 (Concrete Values & Identifiers) Violations: ${result.ruleStats.GC07.violations} (Target: 0)`)

assert.strictEqual(result.ruleStats.GC01.violations, 0, 'GC01 must have 0 violations')
assert.strictEqual(result.ruleStats.GC02.violations, 0, 'GC02 must have 0 violations')
assert.ok(result.ruleStats.GC03.passRate >= 90.0, 'GC03 pass rate must be >= 90.0%')
assert.strictEqual(result.ruleStats.GC04.violations, 0, 'GC04 must have 0 violations')
assert.strictEqual(result.ruleStats.GC05.violations, 0, 'GC05 must have 0 violations')
assert.strictEqual(result.ruleStats.GC06.violations, 0, 'GC06 must have 0 violations')
assert.strictEqual(result.ruleStats.GC07.violations, 0, 'GC07 must have 0 violations')

console.log('\n[TEST 6] Adversarial Boundary Stress Tests on DemoGuideCard Component...')
// Test 6.1: Edge case - all 5 observeAt locations
for (const loc of ['playground', 'verification', 'devtools', 'network', 'console'] as const) {
  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(DemoGuideCard, {
      title: `위치 테스트 ${loc}`,
      concept: '관찰 위치 렌더링 200 OK 테스트',
      steps: [
        { step: 1, title: '[클릭]', description: '동작', actionBadge: '클릭' },
        { step: 2, title: '관찰', description: '확인', observe: '데이터 변경 감지', observeAt: loc },
      ],
    }),
  )
  assert.ok(html.includes('관찰 →'))
  assert.ok(html.includes('데이터 변경 감지'))
}

// Test 6.2: Edge case - no observe field on intermediate steps
const htmlIntermediate = ReactDOMServer.renderToStaticMarkup(
  React.createElement(DemoGuideCard, {
    title: '중간 단계 observe 없음 테스트',
    concept: '중간 단계는 observe 생략 가능 200 OK',
    steps: [
      { step: 1, title: '[입력]', description: '값 입력' },
      { step: 2, title: '[전송]', description: '버튼 클릭' },
      { step: 3, title: '최종 관찰', description: '화면 확인', observe: '최종 결과 반영 완료', observeAt: 'verification' },
    ],
  }),
)
assert.ok(htmlIntermediate.includes('최종 결과 반영 완료'))

// Test 6.3: Edge case - extreme special characters, korean particles, unicode
const htmlUnicode = ReactDOMServer.renderToStaticMarkup(
  React.createElement(DemoGuideCard, {
    title: '특수문자 & 이모지 ⚡ 🛒 <Link href="/shop" />',
    concept: 'Next.js 16 `revalidateTag("cart:user_123")` -> 0ms & 800ms',
    steps: [
      { step: 1, title: '[+ 1개 추가 (VIP 특가)] 클릭', description: '수량 증정 & 쿠폰 [WELCOME2026] 적용' },
      { step: 2, title: '장바구니 🚀 반영', description: 'DevTools Network 탭 확인', observe: 'HTTP 200 OK & { id: 1, name: "특가 상품" }', observeAt: 'network' },
    ],
  }),
)
assert.ok(htmlUnicode.includes('특수문자 &amp; 이모지 ⚡ 🛒'))
assert.ok(htmlUnicode.includes('WELCOME2026'))
assert.ok(htmlUnicode.includes('HTTP 200 OK &amp; { id: 1, name: &quot;특가 상품&quot; }'))

console.log('  ✅ Real DemoGuideCard Component survived all adversarial edge cases without crash.')

console.log('\n============================================================')
console.log('🎉 ALL 6 EMPIRICAL VERIFICATION SUITES PASSED FLAWLESSLY!')
console.log('============================================================\n')
