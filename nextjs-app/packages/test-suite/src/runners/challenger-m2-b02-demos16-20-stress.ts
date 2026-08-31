import fs from 'node:fs'
import path from 'node:path'
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
import { parseGuideCardFromTsx } from './guide-consistency-validator.ts'

console.log('======================================================================')
console.log('  CHALLENGER 2: Milestone M2 (Batch B02 Demos 16–20) Empirical Stress Suite')
console.log('======================================================================\n')

const baseRequire = createRequire(path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/package.json'))
const React = baseRequire('react')
const ReactDOMServer = baseRequire('react-dom/server')

const demos = loadDemosManifest()
const targetUrls = [
  'error-handling/segment-error',
  'error-handling/global-error',
  'css/tailwind-v4',
  'css/css-modules',
  'images/image-optimization',
]

const m2TargetDemos = demos.filter((d) => targetUrls.includes(d.url))
assert.strictEqual(m2TargetDemos.length, 5, 'Must find exactly 5 target demos in manifest')

let passCount = 0
let failCount = 0
const findings: { demo: string; issue: string }[] = []

function check(assertion: boolean, demoUrl: string, message: string) {
  if (assertion) {
    passCount++
    console.log(`  ✅ [${demoUrl}] ${message}`)
  } else {
    failCount++
    findings.push({ demo: demoUrl, issue: message })
    console.error(`  ❌ [${demoUrl}] ${message}`)
  }
}

// -----------------------------------------------------------------------------
// Helper: transpile and execute TSX components in isolated context
// -----------------------------------------------------------------------------
function transpileTsxModule(filePath: string, customScope: Record<string, any> = {}) {
  const code = fs.readFileSync(filePath, 'utf-8')
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText

  const mod: { exports: any } = { exports: {} }
  const dummyRequire = (modName: string) => {
    if (modName === 'react') return React
    if (modName === 'react/jsx-runtime') return baseRequire('react/jsx-runtime')
    if (modName === '@study/demo-kit') {
      return {
        DemoContainer: ({ children }: any) => React.createElement('div', { 'data-testid': 'DemoContainer' }, children),
        DemoGuideCard: ({ title, concept, steps }: any) =>
          React.createElement('div', { 'data-testid': 'DemoGuideCard', title, 'data-concept': concept }, JSON.stringify(steps)),
        DemoPlaygroundCard: ({ title, children }: any) =>
          React.createElement('div', { 'data-testid': 'DemoPlaygroundCard', title }, children),
        ExpectedActualPanel: ({ title, expected, actual, isMatched, description }: any) =>
          React.createElement('div', {
            'data-testid': 'ExpectedActualPanel',
            'data-matched': String(isMatched),
            'data-expected': typeof expected === 'string' ? expected : '',
            'data-actual': typeof actual === 'string' ? actual : '',
            'data-desc': description,
          }),
        DemoDeepDiveCard: ({ title, children }: any) =>
          React.createElement('div', { 'data-testid': 'DemoDeepDiveCard', title }, children),
      }
    }
    if (modName === 'next/image') {
      return {
        default: (props: any) => React.createElement('img', { 'data-testid': 'next-image-mock', ...props }),
      }
    }
    if (modName === 'next/link') {
      return {
        default: ({ href, children, ...rest }: any) => React.createElement('a', { href, ...rest }, children),
      }
    }
    if (customScope[modName]) return customScope[modName]
    return {}
  }

  const fn = new Function('require', 'module', 'exports', 'React', transpiled)
  fn(dummyRequire, mod, mod.exports, React)
  return mod.exports
}

// -----------------------------------------------------------------------------
// SECTION 1: File Size & AST Integrity (< 250 lines & valid TSX)
// -----------------------------------------------------------------------------
console.log('[SECTION 1] Line Count & AST Integrity Check (<= 250 lines)...')
for (const demo of m2TargetDemos) {
  const dir = getDemoSourceDir(demo)
  const files = getAllFiles(dir, ['.ts', '.tsx'])

  for (const f of files) {
    const rel = path.relative(NEXTJS_APP_ROOT, f)
    const content = fs.readFileSync(f, 'utf-8')
    const lineCount = content.split('\n').length

    check(lineCount <= 250, demo.url, `${rel} has ${lineCount} lines (<= 250 required)`)

    // AST Parse check
    const sf = ts.createSourceFile(f, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const diags = (sf as any).parseDiagnostics || []
    check(diags.length === 0, demo.url, `${rel} AST parse has 0 errors`)

    // Check for hardcoded `isMatched: true` or `isMatched={true}`
    const isMatchedLiteralMatch = content.match(/isMatched\s*[:=]\s*true\b/g)
    check(
      !isMatchedLiteralMatch,
      demo.url,
      `${rel} has zero static isMatched: true literals`,
    )
  }
}

// -----------------------------------------------------------------------------
// SECTION 2: DEMO 16 (error-handling/segment-error) State Machine & Isolation
// -----------------------------------------------------------------------------
console.log('\n[SECTION 2] Demo 16 (segment-error) PaymentFlowContext & Layout Preservation...')
const demo16 = m2TargetDemos.find((d) => d.url === 'error-handling/segment-error')!
const demo16Dir = getDemoSourceDir(demo16)

const d16LayoutPath = path.join(demo16Dir, 'layout.tsx')
const d16FooterPath = path.join(demo16Dir, 'components/VerificationFooter.tsx')
const d16ContextPath = path.join(demo16Dir, 'components/context.tsx')
const d16HeaderPath = path.join(demo16Dir, 'components/OrderSummaryHeader.tsx')
const d16PaymentPagePath = path.join(demo16Dir, 'payment/page.tsx')
const d16PaymentErrorPath = path.join(demo16Dir, 'payment/error.tsx')

// 2.1 Check OrderSummaryHeader is imported in layout.tsx outside {children}
const layoutContent16 = fs.readFileSync(d16LayoutPath, 'utf-8')
check(
  layoutContent16.includes('<OrderSummaryHeader />') || layoutContent16.includes('<OrderSummaryHeader/>'),
  demo16.url,
  'layout.tsx renders OrderSummaryHeader outside children (preserved across segment errors)',
)
check(
  layoutContent16.includes('PaymentFlowProvider'),
  demo16.url,
  'layout.tsx wraps content with PaymentFlowProvider',
)

// 2.2 Transpile and run VerificationFooter through 5 lifecycle stages
const d16FooterMod = transpileTsxModule(d16FooterPath)
const VerificationFooter16 = d16FooterMod.VerificationFooter

// Stage 1: 'order' (Initial)
const html16_1 = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter16, { stage: 'order', errorMsg: null }),
)
check(html16_1.includes('data-matched="undefined"'), demo16.url, 'Initial stage "order" has isMatched: undefined')
check(html16_1.includes('인터랙션 대기 중'), demo16.url, 'Initial stage "order" actual states waiting for interaction')

// Stage 2: 'payment_ready'
const html16_2 = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter16, { stage: 'payment_ready', errorMsg: null }),
)
check(html16_2.includes('data-matched="undefined"'), demo16.url, 'Stage "payment_ready" has isMatched: undefined')
check(html16_2.includes('결제 세그먼트(/payment) 진입 완료'), demo16.url, 'Stage "payment_ready" actual reflects segment entry')

// Stage 3: 'errored'
const html16_3 = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter16, {
    stage: 'errored',
    errorMsg: 'PG사 결제 게이트웨이 연결 실패 (504 Gateway Timeout)',
  }),
)
check(html16_3.includes('data-matched="undefined"'), demo16.url, 'Stage "errored" has isMatched: undefined')
check(html16_3.includes('payment/error.tsx 포착 완료'), demo16.url, 'Stage "errored" actual reflects error boundary capture')
check(html16_3.includes('504 Gateway Timeout'), demo16.url, 'Stage "errored" actual includes 504 Gateway Timeout error message')

// Stage 4: 'recovered'
const html16_4 = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter16, { stage: 'recovered', errorMsg: null }),
)
check(html16_4.includes('data-matched="true"'), demo16.url, 'Stage "recovered" evaluates isMatched: true')
check(html16_4.includes('reset() 호출로 PaymentPage 재마운트 성공'), demo16.url, 'Stage "recovered" actual reflects reset() recovery')

// Stage 5: 'completed'
const html16_5 = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter16, { stage: 'completed', errorMsg: null }),
)
check(html16_5.includes('data-matched="true"'), demo16.url, 'Stage "completed" evaluates isMatched: true')
check(html16_5.includes('정상 결제 승인 완료'), demo16.url, 'Stage "completed" actual reflects payment completion')

// -----------------------------------------------------------------------------
// SECTION 3: DEMO 17 (error-handling/global-error) 3 Error Tiers
// -----------------------------------------------------------------------------
console.log('\n[SECTION 3] Demo 17 (global-error) 3 Error Tiers Validation...')
const demo17 = m2TargetDemos.find((d) => d.url === 'error-handling/global-error')!
const demo17Dir = getDemoSourceDir(demo17)

const d17ActionsPath = path.join(demo17Dir, 'actions.ts')
const d17SimulatorPath = path.join(demo17Dir, 'components/ErrorLayerSimulator.tsx')
const d17FooterPath = path.join(demo17Dir, 'components/VerificationFooter.tsx')

// 3.1 Test submitOrderAction Server Action directly
const d17ActionsMod = transpileTsxModule(d17ActionsPath)
const submitOrderAction = d17ActionsMod.submitOrderAction

// Tier 1 Invalid Email
const formData1 = new Map([['email', 'invalid-email'], ['amount', '10000']])
const fakeFormData1 = { get: (k: string) => formData1.get(k) || null } as any
const res1 = await submitOrderAction({ success: false, message: '' }, fakeFormData1)
check(res1.success === false, demo17.url, 'Tier 1 Form Action returns success: false for invalid email')
check(res1.fieldErrors?.email !== undefined, demo17.url, 'Tier 1 Form Action returns email field error')

// Tier 1 Invalid Amount
const formData2 = new Map([['email', 'test@test.com'], ['amount', '0']])
const fakeFormData2 = { get: (k: string) => formData2.get(k) || null } as any
const res2 = await submitOrderAction({ success: false, message: '' }, fakeFormData2)
check(res2.success === false, demo17.url, 'Tier 1 Form Action returns success: false for 0 amount')
check(res2.fieldErrors?.amount !== undefined, demo17.url, 'Tier 1 Form Action returns amount field error')

// Tier 1 Valid Submission
const formData3 = new Map([['email', 'buyer@domain.com'], ['amount', '50000']])
const fakeFormData3 = { get: (k: string) => formData3.get(k) || null } as any
const res3 = await submitOrderAction({ success: false, message: '' }, fakeFormData3)
check(res3.success === true, demo17.url, 'Tier 1 Form Action returns success: true for valid input')
check(res3.message.includes('50,000'), demo17.url, 'Tier 1 Form Action formats formatted currency in success message')

// 3.2 Simulator Interactive Buttons Inspection
const simContent17 = fs.readFileSync(d17SimulatorPath, 'utf-8')
check(
  simContent17.includes('2. 세그먼트 예외 던지기 시뮬레이션'),
  demo17.url,
  'ErrorLayerSimulator has interactive button for Tier 2 segment exception',
)
check(
  simContent17.includes('3. 루트 레이아웃 크래시 시뮬레이션'),
  demo17.url,
  'ErrorLayerSimulator has interactive button for Tier 3 global-error simulation',
)
check(
  simContent17.includes('global-error.tsx (Root Layout Crash)'),
  demo17.url,
  'ErrorLayerSimulator provides modal simulation with root crash explanation',
)

// 3.3 VerificationFooter dynamic 3-tier binding
const d17FooterMod = transpileTsxModule(d17FooterPath)
const VerificationFooter17 = d17FooterMod.VerificationFooter

// Uninteracted
const html17_init = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter17, {
    state: { success: false, message: '' },
    segmentSimulated: false,
    globalSimulated: false,
  }),
)
check(html17_init.includes('data-matched="undefined"'), demo17.url, 'Initial state has isMatched: undefined')
check(html17_init.includes('인터랙션 대기 중'), demo17.url, 'Initial state actual prompt guides interaction')

// Form Interacted
const html17_form = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter17, {
    state: res1,
    segmentSimulated: false,
    globalSimulated: false,
  }),
)
check(html17_form.includes('data-matched="true"'), demo17.url, 'Form action state triggers isMatched: true')
check(html17_form.includes('useActionState 처리 완료'), demo17.url, 'Form action actual reflects useActionState message')

// Segment Interacted
const html17_seg = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter17, {
    state: { success: false, message: '' },
    segmentSimulated: true,
    globalSimulated: false,
  }),
)
check(html17_seg.includes('data-matched="true"'), demo17.url, 'Segment error simulation triggers isMatched: true')
check(html17_seg.includes('error.tsx 격리 및 복구 시뮬레이션 완료'), demo17.url, 'Segment simulation actual reflects error.tsx isolation')

// Global Interacted
const html17_glob = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter17, {
    state: { success: false, message: '' },
    segmentSimulated: false,
    globalSimulated: true,
  }),
)
check(html17_glob.includes('data-matched="true"'), demo17.url, 'Global error simulation triggers isMatched: true')
check(html17_glob.includes('global-error.tsx (&lt;html&gt;&lt;body&gt;) 루트 크래시 포착'), demo17.url, 'Global simulation actual reflects global-error.tsx capture')

// -----------------------------------------------------------------------------
// SECTION 4: DEMO 18 (css/tailwind-v4) Theme/Class Synthesis
// -----------------------------------------------------------------------------
console.log('\n[SECTION 4] Demo 18 (tailwind-v4) Dynamic Theme & Class Synthesis...')
const demo18 = m2TargetDemos.find((d) => d.url === 'css/tailwind-v4')!
const demo18Dir = getDemoSourceDir(demo18)

const d18FooterPath = path.join(demo18Dir, 'components/VerificationFooter.tsx')
const d18InspectorPath = path.join(demo18Dir, 'components/ThemeInspectorClient.tsx')

// 4.1 ThemeInspectorClient class synthesis logic test
const d18FooterMod = transpileTsxModule(d18FooterPath)
const VerificationFooter18 = d18FooterMod.VerificationFooter

// Uninteracted
const html18_init = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter18, {
    hasInteracted: false,
    accentColor: 'indigo',
    paddingSize: 'normal',
    selectedSize: 270,
    hasBadge: true,
    activeClasses: 'rounded-lg border border-indigo-300 bg-indigo-50/50 p-4 shadow-2xs transition-all',
  }),
)
check(html18_init.includes('data-matched="undefined"'), demo18.url, 'Initial state has isMatched: undefined')
check(html18_init.includes('인터랙션 대기 중'), demo18.url, 'Initial actual prompts user to tweak theme toolbar')

// Interacted: Emerald + Spacious + 280mm + No Badge
const synthesizedClasses = 'rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 shadow-2xs transition-all'
const html18_interacted = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter18, {
    hasInteracted: true,
    accentColor: 'emerald',
    paddingSize: 'spacious',
    selectedSize: 280,
    hasBadge: false,
    activeClasses: synthesizedClasses,
  }),
)
check(html18_interacted.includes('data-matched="true"'), demo18.url, 'Interacted state evaluates isMatched: true')
check(html18_interacted.includes('색상=emerald'), demo18.url, 'Actual reflects color=emerald')
check(html18_interacted.includes('여백=spacious'), demo18.url, 'Actual reflects padding=spacious')
check(html18_interacted.includes('사이즈=280mm'), demo18.url, 'Actual reflects size=280mm')
check(html18_interacted.includes('뱃지=OFF'), demo18.url, 'Actual reflects badge=OFF')
check(html18_interacted.includes(synthesizedClasses), demo18.url, 'Actual includes full synthesized Tailwind v4 classes string')

// -----------------------------------------------------------------------------
// SECTION 5: DEMO 19 (css/css-modules) CSS Hash Scoping & Independent Actions
// -----------------------------------------------------------------------------
console.log('\n[SECTION 5] Demo 19 (css-modules) CSS Hash Scoping & Independent Actions...')
const demo19 = m2TargetDemos.find((d) => d.url === 'css/css-modules')!
const demo19Dir = getDemoSourceDir(demo19)

const d19ProductCssPath = path.join(demo19Dir, 'components/ProductCard.module.css')
const d19BannerCssPath = path.join(demo19Dir, 'components/PromotionBannerCard.module.css')
const d19FooterPath = path.join(demo19Dir, 'components/VerificationFooter.tsx')

// 5.1 Verify CSS class definitions in both module files
const prodCss = fs.readFileSync(d19ProductCssPath, 'utf-8')
const bannerCss = fs.readFileSync(d19BannerCssPath, 'utf-8')

for (const cls of ['.card', '.title', '.badge', '.action']) {
  check(prodCss.includes(cls), demo19.url, `ProductCard.module.css defines ${cls}`)
  check(bannerCss.includes(cls), demo19.url, `PromotionBannerCard.module.css defines ${cls}`)
}

// Check distinct color palettes
check(prodCss.includes('#93c5fd') && prodCss.includes('#1e3a8a'), demo19.url, 'ProductCard uses distinct Blue palette')
check(bannerCss.includes('#6ee7b7') && bannerCss.includes('#064e3b'), demo19.url, 'PromotionBannerCard uses distinct Green palette')

// 5.2 VerificationFooter State Independence
const d19FooterMod = transpileTsxModule(d19FooterPath)
const VerificationFooter19 = d19FooterMod.VerificationFooter

// Uninteracted
const html19_init = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter19, { cartAdded: false, couponClaimed: false }),
)
check(html19_init.includes('data-matched="undefined"'), demo19.url, 'Initial state has isMatched: undefined')
check(html19_init.includes('인터랙션 대기 중'), demo19.url, 'Initial actual prompts user to click card action buttons')

// Cart Added Only
const html19_cart = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter19, { cartAdded: true, couponClaimed: false }),
)
check(html19_cart.includes('data-matched="true"'), demo19.url, 'cartAdded evaluates isMatched: true')
check(html19_cart.includes('ProductCard 상태: 장바구니 담김'), demo19.url, 'Actual reflects ProductCard cartAdded')
check(html19_cart.includes('PromotionBannerCard 상태: 대기 중'), demo19.url, 'Actual reflects PromotionBannerCard still waiting')

// Coupon Claimed Only
const html19_coupon = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter19, { cartAdded: false, couponClaimed: true }),
)
check(html19_coupon.includes('data-matched="true"'), demo19.url, 'couponClaimed evaluates isMatched: true')
check(html19_coupon.includes('ProductCard 상태: 대기 중'), demo19.url, 'Actual reflects ProductCard still waiting')
check(html19_coupon.includes('PromotionBannerCard 상태: 30% 할인쿠폰 발급완료'), demo19.url, 'Actual reflects PromotionBannerCard couponClaimed')

// Both Interacted
const html19_both = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter19, { cartAdded: true, couponClaimed: true }),
)
check(html19_both.includes('data-matched="true"'), demo19.url, 'Both actions evaluate isMatched: true')
check(html19_both.includes('장바구니 담김') && html19_both.includes('할인쿠폰 발급완료'), demo19.url, 'Actual reflects both component state updates simultaneously')

// -----------------------------------------------------------------------------
// SECTION 6: DEMO 20 (images/image-optimization) next/image Pipeline & Zero CLS
// -----------------------------------------------------------------------------
console.log('\n[SECTION 6] Demo 20 (image-optimization) next/image Pipeline & Zero CLS...')
const demo20 = m2TargetDemos.find((d) => d.url === 'images/image-optimization')!
const demo20Dir = getDemoSourceDir(demo20)

const d20ClientPath = path.join(demo20Dir, 'components/ImageComparisonClient.tsx')
const d20FooterPath = path.join(demo20Dir, 'components/VerificationFooter.tsx')

// 6.1 Inspect ImageComparisonClient source code for real next/image usage
const d20ClientContent = fs.readFileSync(d20ClientPath, 'utf-8')
check(
  d20ClientContent.includes("import Image from 'next/image'"),
  demo20.url,
  'Imports real Image from next/image',
)
check(
  d20ClientContent.includes('width={400}') && d20ClientContent.includes('height={225}'),
  demo20.url,
  'Provides explicit width={400} and height={225} aspect ratio for Zero CLS',
)
check(
  d20ClientContent.includes('quality={quality}') && d20ClientContent.includes('priority={priority}'),
  demo20.url,
  'Passes dynamic quality and priority props to next/image',
)
check(
  d20ClientContent.includes('<img') && d20ClientContent.includes('<Image'),
  demo20.url,
  'Renders both standard <img> and next/image for side-by-side empirical comparison',
)

// 6.2 VerificationFooter Dynamic Pipeline Binding
const d20FooterMod = transpileTsxModule(d20FooterPath)
const VerificationFooter20 = d20FooterMod.VerificationFooter

// Uninteracted
const html20_init = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter20, {
    hasInteracted: false,
    quality: 75,
    priority: false,
    viewMode: 'both',
  }),
)
check(html20_init.includes('data-matched="undefined"'), demo20.url, 'Initial state has isMatched: undefined')
check(html20_init.includes('인터랙션 대기 중'), demo20.url, 'Initial actual prompts user to adjust quality/priority')

// Interacted: quality=90, priority=true, viewMode='next-image'
const html20_interacted = ReactDOMServer.renderToStaticMarkup(
  React.createElement(VerificationFooter20, {
    hasInteracted: true,
    quality: 90,
    priority: true,
    viewMode: 'next-image',
  }),
)
check(html20_interacted.includes('data-matched="true"'), demo20.url, 'Interacted state evaluates isMatched: true')
check(html20_interacted.includes('quality=90%'), demo20.url, 'Actual reflects quality=90%')
check(html20_interacted.includes('priority=true (LCP 사전 로드 활성화)'), demo20.url, 'Actual reflects priority=true')
check(html20_interacted.includes('next/image 단독 뷰'), demo20.url, 'Actual reflects viewMode=next-image')
check(html20_interacted.includes('CLS 0 달성 완료'), demo20.url, 'Actual reflects Zero CLS aspect ratio guarantee')

// -----------------------------------------------------------------------------
// SECTION 7: DemoGuideCard & DemoDeepDiveCard Structure Check across D16–D20
// -----------------------------------------------------------------------------
console.log('\n[SECTION 7] Guide Card & DeepDive Card Structure Verification...')
for (const demo of m2TargetDemos) {
  const dir = getDemoSourceDir(demo)
  const pageFile = path.join(dir, 'page.tsx')
  const layoutFile = path.join(dir, 'layout.tsx')

  let guideData = null
  for (const entry of [pageFile, layoutFile]) {
    if (fs.existsSync(entry)) {
      const content = fs.readFileSync(entry, 'utf-8')
      if (content.includes('DemoGuideCard')) {
        guideData = parseGuideCardFromTsx(content)
        if (guideData && guideData.steps.length > 0) break
      }
    }
  }

  check(guideData !== null && guideData.steps.length >= 3, demo.url, `Guide card has ${guideData?.steps.length} steps (>= 3)`)
  const lastStep = guideData?.steps[guideData.steps.length - 1]
  check(Boolean(lastStep?.observe && lastStep.observe.length >= 10), demo.url, 'Last guide step has concrete observe target')
  check(lastStep?.observeAt === 'playground', demo.url, 'Last guide step observeAt is playground')

  // Check DeepDiveCard in VerificationFooter.tsx
  const footerFile = path.join(dir, 'components/VerificationFooter.tsx')
  const footerContent = fs.readFileSync(footerFile, 'utf-8')
  check(footerContent.includes('DemoDeepDiveCard'), demo.url, 'VerificationFooter contains DemoDeepDiveCard')
  check(footerContent.includes('1. 핵심 스펙 및 개념 요약'), demo.url, 'DeepDive card contains Section 1')
  check(footerContent.includes('2. 데모 예제 기반 동작 원리'), demo.url, 'DeepDive card contains Section 2')
  check(footerContent.includes('3. 실무적 장점 (Why Use This)'), demo.url, 'DeepDive card contains Section 3')
  check(footerContent.includes('4. 주요 활용 상황 (When to Use)'), demo.url, 'DeepDive card contains Section 4')
  check(footerContent.includes('5. 실무 주의사항 및 핵심 팁 (Caution & Tips)'), demo.url, 'DeepDive card contains Section 5')
}

// -----------------------------------------------------------------------------
// Summary & Verdict
// -----------------------------------------------------------------------------
console.log('\n======================================================================')
console.log(`Audited Demos 16–20: ${m2TargetDemos.length} Demos`)
console.log(`Passed Assertions: ${passCount}`)
console.log(`Failed Assertions: ${failCount}`)
console.log('======================================================================\n')

if (failCount > 0) {
  console.error('FAILED FINDINGS:')
  findings.forEach((f) => console.error(`  - [${f.demo}] ${f.issue}`))
  console.error('\nVERDICT: REQUEST_CHANGES\n')
  process.exit(1)
} else {
  console.log('VERDICT: APPROVE')
  console.log('All state machines, isolation boundaries, error tiers, and verification bindings verified empirically!\n')
  process.exit(0)
}
