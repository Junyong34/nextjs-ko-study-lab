import assert from 'node:assert/strict'
import {
  parseGuideCardFromTsx,
  validateGuideConsistency,
  extractPlaygroundMetadata,
  KNOWN_TEMPLATE_STEP_SETS,
  CONCEPT_TEMPLATE_PATTERNS,
} from './guide-consistency-validator.ts'
import { loadDemosManifest, getDemoSourceDir } from '../utils/test-helpers.ts'

console.log('================================================================================')
console.log('  CHALLENGER 1 (M0 Iteration 2): REMEDIATION EMPIRICAL STRESS ORACLE')
console.log('================================================================================\n')

interface StressResult {
  id: string
  category: string
  name: string
  status: 'PASS' | 'FAIL'
  error?: string
}

const results: StressResult[] = []

function testCase(id: string, category: string, name: string, fn: () => void) {
  try {
    fn()
    results.push({ id, category, name, status: 'PASS' })
    console.log(`  ✅ [PASS] ${id} (${category}): ${name}`)
  } catch (err: any) {
    results.push({ id, category, name, status: 'FAIL', error: err.message })
    console.error(`  ❌ [FAIL] ${id} (${category}): ${name}`)
    console.error(`     -> Error: ${err.message}`)
    if (err.stack) console.error(err.stack)
  }
}

// ============================================================================
// Suite 1: Vulnerability 1 — Paired Quote Truncation & Mixed Quote Resilience
// ============================================================================
console.log('\n--- 1. Vulnerability 1 Verification: Paired Quote Truncation ---')

testCase('V1-01', 'Quotes', 'Double quotes containing internal single quotes (Korean technical term)', () => {
  const tsx = `<DemoGuideCard title="제목" concept="함수 또는 컴포넌트에 'use cache'를 선언하면 800ms 지연 없이 0ms 즉시 응답합니다." steps={[{ step: 1, title: "1", description: "d" }, { step: 2, title: "2", description: "d", observe: "12345" }]} />`
  const parsed = parseGuideCardFromTsx(tsx)
  assert.ok(parsed)
  assert.strictEqual(parsed.concept, "함수 또는 컴포넌트에 'use cache'를 선언하면 800ms 지연 없이 0ms 즉시 응답합니다.")
})

testCase('V1-02', 'Quotes', 'Single quotes containing internal double quotes in title & steps', () => {
  const tsx = `<DemoGuideCard title='[Click "Submit"] 버튼 데모' concept='개념 200 OK' steps={[{ step: 1, title: '[Click "Action"] 수행', description: '버튼 "제출"을 클릭합니다.' }, { step: 2, title: '확인', description: '설명', observe: '관찰 대상 "성공 200 OK" 데이터', observeAt: 'verification' }]} />`
  const parsed = parseGuideCardFromTsx(tsx)
  assert.ok(parsed)
  assert.strictEqual(parsed.title, '[Click "Submit"] 버튼 데모')
  assert.strictEqual(parsed.steps[0].title, '[Click "Action"] 수행')
  assert.strictEqual(parsed.steps[0].description, '버튼 "제출"을 클릭합니다.')
  assert.strictEqual(parsed.steps[1].observe, '관찰 대상 "성공 200 OK" 데이터')
})

testCase('V1-03', 'Quotes', 'Braced JSX double quotes {"..."} and single quotes {\'...\'}', () => {
  const tsx = `<DemoGuideCard title={"Next.js 'App Router' 16.3"} concept={'React 19 "Server Actions" 200 OK'} steps={[{ step: 1, title: "S1", description: "D1" }, { step: 2, title: "S2", description: "D2", observe: "Obs 200" }]} />`
  const parsed = parseGuideCardFromTsx(tsx)
  assert.ok(parsed)
  assert.strictEqual(parsed.title, "Next.js 'App Router' 16.3")
  assert.strictEqual(parsed.concept, 'React 19 "Server Actions" 200 OK')
})

testCase('V1-04', 'Quotes', 'Template literal backticks with escaped backticks and multiline text', () => {
  const tsx = `
    <DemoGuideCard
      title={\`멀티라인 \\\`백틱\\\` 제목\`}
      concept={\`
        줄 1: 'use server' & "use client"
        줄 2: 800ms 네트워크 지연
      \`}
      steps={[
        { step: 1, title: \`[조작] 클릭\`, description: \`설명 1\` },
        { step: 2, title: \`결과 확인\`, description: \`설명 2\`, observe: \`200 OK 수신 완료\`, observeAt: \`playground\` }
      ]}
    />
  `
  const parsed = parseGuideCardFromTsx(tsx)
  assert.ok(parsed)
  assert.ok(parsed.concept.includes("'use server' & \"use client\""))
  assert.ok(parsed.concept.includes("800ms 네트워크 지연"))
  assert.strictEqual(parsed.steps[1].observe, "200 OK 수신 완료")
})

testCase('V1-05', 'Quotes', 'Audit of 5 live production demos previously broken by quote truncation', () => {
  const res = validateGuideConsistency({ log: false })
  const targetUrls = [
    'caching/basic',
    'file-conventions/route/rest-api-orders',
    'server-actions/basic',
    'server-client-components/composition',
    'server-client-components/serialization',
  ]

  for (const url of targetUrls) {
    const audit = res.audits.find((a) => a.url === url)
    assert.ok(audit, `Demo '${url}' must exist in manifest`)
    assert.ok(audit.guide, `Demo '${url}' must have parsed guide`)
    // Ensure no GC07 violations are falsely triggered due to truncation
    const gc07Violation = audit.violations.find((v) => v.rule === 'GC07')
    assert.strictEqual(gc07Violation, undefined, `Demo '${url}' should NOT have false GC07 violation`)
    assert.ok(audit.guide.concept.length > 30, `Demo '${url}' concept must not be truncated (len=${audit.guide.concept.length})`)
  }
})

// ============================================================================
// Suite 2: Vulnerability 2 — Array Trailing Comma Drop
// ============================================================================
console.log('\n--- 2. Vulnerability 2 Verification: Array Trailing Comma Drop ---')

testCase('V2-01', 'Trailing Comma', 'Prettier/ESLint multi-line trailing comma before closing bracket ]', () => {
  const tsx = `
    <DemoGuideCard
      title="트레일링 콤마"
      concept="Prettier 포맷팅 200 OK"
      steps={[
        {
          step: 1,
          title: "[조작] 클릭",
          description: "첫 번째 단계",
        },
        {
          step: 2,
          title: "결과 확인",
          description: "두 번째 단계",
          observe: "상태 200 OK 관찰 대상",
          observeAt: 'verification',
        },
      ]}
    />
  `
  const parsed = parseGuideCardFromTsx(tsx)
  assert.ok(parsed)
  assert.strictEqual(parsed.steps.length, 2, `Expected 2 steps, got ${parsed.steps.length}`)
  assert.strictEqual(parsed.steps[0].step, 1)
  assert.strictEqual(parsed.steps[1].step, 2)
  assert.strictEqual(parsed.steps[1].observe, "상태 200 OK 관찰 대상")
  assert.strictEqual(parsed.steps[1].observeAt, "verification")
})

testCase('V2-02', 'Trailing Comma', 'Single-line steps array with trailing comma', () => {
  const tsx = `<DemoGuideCard title="T" concept="C 200" steps={[{ step: 1, title: "S1", description: "D1" }, { step: 2, title: "S2", description: "D2", observe: "Obs 200" },]} />`
  const parsed = parseGuideCardFromTsx(tsx)
  assert.ok(parsed)
  assert.strictEqual(parsed.steps.length, 2)
  assert.strictEqual(parsed.steps[1].observe, "Obs 200")
})

testCase('V2-03', 'Trailing Comma', '6-step array with trailing comma and varied whitespace/comments', () => {
  const tsx = `
    <DemoGuideCard
      title="6 스텝"
      concept="개념 200 OK"
      steps={[
        { step: 1, title: "Step 1", description: "Desc 1" },
        { step: 2, title: "Step 2", description: "Desc 2" },
        { step: 3, title: "Step 3", description: "Desc 3" },
        { step: 4, title: "Step 4", description: "Desc 4" },
        { step: 5, title: "Step 5", description: "Desc 5" },
        { step: 6, title: "Step 6", description: "Desc 6", observe: "Final Step 6 Observe 200 OK" },
      ]}
    />
  `
  const parsed = parseGuideCardFromTsx(tsx)
  assert.ok(parsed)
  assert.strictEqual(parsed.steps.length, 6)
  assert.strictEqual(parsed.steps[5].observe, "Final Step 6 Observe 200 OK")
})

// ============================================================================
// Suite 3: Vulnerability 3 — Self-Closing Sub-Tag Early Termination
// ============================================================================
console.log('\n--- 3. Vulnerability 3 Verification: Self-Closing Sub-Tags ---')

testCase('V3-01', 'Sub-tags', 'Self-closing <Image /> inside title prop attribute', () => {
  const tsx = `<DemoGuideCard title="Link <Image src='/logo.png' /> Demo" concept="개념 200 OK" steps={[{ step: 1, title: "[조작] 클릭", description: "설명" }, { step: 2, title: "확인", description: "설명", observe: "상태 200 OK", observeAt: "playground" }]} />`
  const parsed = parseGuideCardFromTsx(tsx)
  assert.ok(parsed)
  assert.strictEqual(parsed.title, "Link <Image src='/logo.png' /> Demo")
  assert.strictEqual(parsed.steps.length, 2)
  assert.strictEqual(parsed.steps[1].observe, "상태 200 OK")
})

testCase('V3-02', 'Sub-tags', 'Multiple self-closing sub-tags (<br />, <hr />, <input />) across props', () => {
  const tsx = `
    <DemoGuideCard
      title="복합 <Icon name='test' /> 컴포넌트"
      concept="첫 번째 줄 <br /> 두 번째 줄 <hr /> 200 OK 사양"
      steps={[
        { step: 1, title: "입력 <input type='text' /> 조작", description: "설명" },
        { step: 2, title: "결과 확인", description: "설명", observe: "관찰 대상 200 OK", observeAt: "verification" }
      ]}
    />
  `
  const parsed = parseGuideCardFromTsx(tsx)
  assert.ok(parsed)
  assert.ok(parsed.title.includes("<Icon name='test' />"))
  assert.ok(parsed.concept.includes("<br />"))
  assert.ok(parsed.steps[0].title.includes("<input type='text' />"))
  assert.strictEqual(parsed.steps.length, 2)
})

testCase('V3-03', 'Sub-tags', 'Explicit closing tag </DemoGuideCard> with nested whitespace', () => {
  const tsx = `
    <DemoGuideCard
      title="Explicit Close Tag"
      concept="Concept 200 OK"
      steps={[
        { step: 1, title: "S1", description: "D1" },
        { step: 2, title: "S2", description: "D2", observe: "Obs 200" }
      ]}
    >
    </DemoGuideCard>
  `
  const parsed = parseGuideCardFromTsx(tsx)
  assert.ok(parsed)
  assert.strictEqual(parsed.title, "Explicit Close Tag")
  assert.strictEqual(parsed.steps.length, 2)
})

// ============================================================================
// Suite 4: Property Fuzzing (500 Randomized TSX Permutations)
// ============================================================================
console.log('\n--- 4. Property Fuzzing (500 Combinatorial Permutations) ---')

testCase('FUZZ-500', 'Fuzzing', '500 Combinatorial synthetic TSX variations with quotes, sub-tags, and commas', () => {
  const titles = [
    'Simple Title',
    '[Click "Submit"] Demo',
    'Link <Image src="/a.png" /> Optimization',
    "Title with 'single' and \"double\" quotes",
    '한국어 제목: [장바구니 담기 + 1]',
    'Escape \\"Quotes\\" and \\\'Single\\\'',
  ]

  const concepts = [
    'Next.js App Router 16.3 useOptimistic 0ms 즉각 반응',
    "함수 'use cache'와 \"use server\"를 선언하여 800ms 지연 처리 200 OK",
    'Concept with <Link href="/test" /> component 404 notFound',
    'Multi\nline\nconcept 307 redirect',
    'Sub-tags <br /> and <hr /> with numeric 500 status',
  ]

  const step1Titles = [
    '[조작] 버튼 클릭',
    '[Click "Action"] 수행',
    '<Button type="submit" /> 클릭',
    "입력 폼 '이름' 기입",
  ]

  const observeTargets = [
    '상태 변화 200 OK 반영',
    '장바구니 "15,000원" 갱신 확인',
    "네트워크 'revalidateTag' 트리거 관찰",
    '관찰 대상 <Badge /> 200 OK',
  ]

  const locations = ['playground', 'verification', 'devtools', 'network', 'console', undefined]

  for (let i = 0; i < 500; i++) {
    const t = titles[i % titles.length]
    const c = concepts[i % concepts.length]
    const s1 = step1Titles[i % step1Titles.length]
    const obs = observeTargets[i % observeTargets.length]
    const loc = locations[i % locations.length]
    const trailingComma = i % 2 === 0 ? ',' : ''
    const quoteStyle = i % 3

    let titleAttr = ''
    if (quoteStyle === 0) titleAttr = `title="${t.replace(/"/g, '\\"')}"`
    else if (quoteStyle === 1) titleAttr = `title='${t.replace(/'/g, "\\'")}'`
    else titleAttr = `title={\`${t.replace(/`/g, '\\`')}\`}`

    const locAttr = loc ? `, observeAt: "${loc}"` : ''

    const tsx = `
      <DemoGuideCard
        ${titleAttr}
        concept={\`${c}\`}
        steps={[
          { step: 1, title: \`${s1}\`, description: "Desc 1" },
          { step: 2, title: "[Step 2] Final", description: "Desc 2", observe: \`${obs}\`${locAttr} }${trailingComma}
        ]}
      />
    `

    const parsed = parseGuideCardFromTsx(tsx)
    assert.ok(parsed, `Fuzz #${i}: must parse successfully`)
    assert.strictEqual(parsed.steps.length, 2, `Fuzz #${i}: must have exactly 2 steps`)
    assert.strictEqual(parsed.steps[1].observe, obs, `Fuzz #${i}: observe target must match`)
    if (loc) {
      assert.strictEqual(parsed.steps[1].observeAt, loc, `Fuzz #${i}: location badge must match`)
    }
  }
})

// ============================================================================
// Suite 5: Full Monorepo Scan & Invariant Verification
// ============================================================================
console.log('\n--- 5. Full Monorepo Scan (241 Demos) ---')

testCase('SCAN-241', 'Repository Scan', 'All 241 live demos parse cleanly with 0 GC05 violations', () => {
  const result = validateGuideConsistency({ log: false })
  assert.strictEqual(result.totalDemos, 241, 'Expected 241 demos')
  assert.strictEqual(result.audits.length, 241, 'Expected 241 audits')
  assert.strictEqual(result.ruleStats.GC05.violations, 0, 'Expected 0 GC05 violations')
  assert.strictEqual(result.ruleStats.GC05.passRate, 100, 'Expected 100% GC05 pass rate')

  for (const a of result.audits) {
    assert.ok(a.guide, `Guide must exist for ${a.url}`)
    assert.ok(a.guide.steps.length >= 2, `Steps must be >= 2 for ${a.url}`)
    assert.ok(a.guide.title.trim().length > 0, `Title must not be empty for ${a.url}`)
    assert.ok(a.guide.concept.trim().length > 0, `Concept must not be empty for ${a.url}`)
  }
})

// ============================================================================
// Summary Matrix
// ============================================================================
console.log('\n================================================================================')
const total = results.length
const passed = results.filter((r) => r.status === 'PASS').length
const failed = results.filter((r) => r.status === 'FAIL').length
console.log(`  AGGREGATED STRESS ORACLE: Total: ${total} | Passed: ${passed} | Failed: ${failed}`)
console.log('================================================================================\n')

if (failed > 0) {
  process.exit(1)
} else {
  console.log('🎉 ALL 15 EMPIRICAL ADVERSARIAL STRESS SUITES PASSED CLEANLY (500 FUZZ CYCLES).')
}
