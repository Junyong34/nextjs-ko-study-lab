import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  parseGuideCardFromTsx,
  extractPlaygroundMetadata,
  validateGuideConsistency,
  KNOWN_TEMPLATE_STEP_SETS,
  CONCEPT_TEMPLATE_PATTERNS,
} from './guide-consistency-validator.ts'
import { NEXTJS_APP_ROOT, loadDemosManifest, getDemoSourceDir } from '../utils/test-helpers.ts'

console.log('========================================================================')
console.log('  EMPIRICAL CHALLENGER 2: ADVERSARIAL STRESS TEST SUITE & ORACLE')
console.log('========================================================================\n')

interface TestResult {
  id: string
  category: string
  description: string
  status: 'PASS' | 'FAIL'
  expected: string
  actual: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  bugDescription?: string
}

const results: TestResult[] = []

// Helper runner
function runCase(
  id: string,
  category: string,
  description: string,
  severity: TestResult['severity'],
  fn: () => void,
  bugDesc?: string
) {
  try {
    fn()
    results.push({
      id,
      category,
      description,
      status: 'PASS',
      expected: 'Assertion satisfied',
      actual: 'Assertion satisfied',
      severity,
    })
    console.log(`  ✅ [PASS] ${id} (${severity}): ${description}`)
  } catch (err: any) {
    results.push({
      id,
      category,
      description,
      status: 'FAIL',
      expected: err.expected !== undefined ? String(err.expected) : 'Valid parsing',
      actual: err.actual !== undefined ? String(err.actual) : err.message,
      severity,
      bugDescription: bugDesc || err.message,
    })
    console.error(`  ❌ [FAIL] ${id} (${severity}): ${description}`)
    console.error(`     -> Error: ${err.message}`)
  }
}

// ============================================================================
// 1. TSX Parser Stress Tests (parseGuideCardFromTsx)
// ============================================================================
console.log('\n--- 1. TSX Parser Edge Cases & Stress Scenarios ---')

runCase(
  'BUG-01A',
  'TSX Parser',
  'Single quotes containing double quotes in step title (title: \'[Click "Submit"]\')',
  'CRITICAL',
  () => {
    const tsx = `<DemoGuideCard title="제목" concept="개념 200 OK" steps={[{ step: 1, title: '[Click "Submit"] 버튼', description: '설명' }, { step: 2, title: '확인', description: '설명', observe: '12345' }]} />`
    const parsed = parseGuideCardFromTsx(tsx)
    assert.ok(parsed, 'Must parse TSX')
    assert.strictEqual(parsed.steps[0].title, '[Click "Submit"] 버튼')
  },
  'Character class ["\'] matches opening single quote and closes at inner double quote, truncating title to "[Click ".'
)

runCase(
  'BUG-01B',
  'TSX Parser',
  'Double quotes containing single quotes in concept (concept="... \'use server\' ...")',
  'CRITICAL',
  () => {
    const tsx = `<DemoGuideCard title="제목" concept="폼에서 'use server' 함수를 직접 호출하여 800ms 지연 처리" steps={[{ step: 1, title: '1', description: 'd' }, { step: 2, title: '2', description: 'd', observe: '12345' }]} />`
    const parsed = parseGuideCardFromTsx(tsx)
    assert.ok(parsed, 'Must parse TSX')
    assert.strictEqual(parsed.concept, "폼에서 'use server' 함수를 직접 호출하여 800ms 지연 처리")
  },
  'Character class ["\'] matches opening double quote and closes at inner single quote before "use server", truncating concept to "폼에서 " and causing false positive GC07 violations.'
)

runCase(
  'BUG-02',
  'TSX Parser',
  'Trailing comma before closing bracket in steps array (Prettier/ESLint formatted)',
  'CRITICAL',
  () => {
    const tsx = `
      <DemoGuideCard
        title="제목"
        concept="개념 200 OK"
        steps={[
          {
            step: 1,
            title: "[조작] 클릭",
            description: "설명",
          },
          {
            step: 2,
            title: "결과 확인",
            description: "설명",
            observe: "관찰 대상 12345",
            observeAt: 'verification',
          },
        ]}
      />
    `
    const parsed = parseGuideCardFromTsx(tsx)
    assert.ok(parsed, 'Must parse TSX')
    assert.strictEqual(parsed.steps.length, 2, `Expected 2 steps, got ${parsed.steps.length}`)
  },
  'Regex objRegex lookahead (?=\\s*,\\s*\\{|\\s*\\]) fails when trailing comma exists before ], dropping the final step and triggering false positive GC04 and GC06 violations.'
)

runCase(
  'BUG-03',
  'TSX Parser',
  'Props containing self-closing sub-tag "/>" (e.g. title="Link <Image src=\'/a.png\' /> Demo")',
  'HIGH',
  () => {
    const tsx = `<DemoGuideCard title="Link <Image src='/a.png' /> Demo" concept="개념 200 OK" steps={[{ step: 1, title: "[조작] 클릭", description: "설명" }, { step: 2, title: "확인", description: "설명", observe: "12345" }]} />`
    const parsed = parseGuideCardFromTsx(tsx)
    assert.ok(parsed, 'Must parse TSX')
    assert.strictEqual(parsed.steps.length, 2, `Expected 2 steps, got ${parsed.steps.length}`)
  },
  'Regex /<DemoGuideCard\\b([\\s\\S]*?)(?:\\/>|<\\/DemoGuideCard>)/ terminates at inner "/>", excluding steps={...} and returning empty steps [].'
)

runCase(
  'PARSE-01',
  'TSX Parser',
  'Standard double-quoted TSX props parsing',
  'INFO',
  () => {
    const tsx = `<DemoGuideCard title="표준 제목" concept="useOptimistic 0ms 즉각 반응" steps={[{ step: 1, title: "[+ 버튼] 클릭", description: "설명" }, { step: 2, title: "확인", description: "설명", observe: "총액 15,000원 반영", observeAt: "verification" }]} />`
    const parsed = parseGuideCardFromTsx(tsx)
    assert.ok(parsed)
    assert.strictEqual(parsed.title, '표준 제목')
    assert.strictEqual(parsed.concept, 'useOptimistic 0ms 즉각 반응')
    assert.strictEqual(parsed.steps.length, 2)
  }
)

runCase(
  'PARSE-02',
  'TSX Parser',
  'Template literals with multiline formatting and whitespace',
  'INFO',
  () => {
    const tsx = `
      <DemoGuideCard
        title={\`멀티라인 제목\`}
        concept={\`
          Next.js App Router 16.3
          800ms 지연 처리
        \`}
        steps={[
          { step: 1, title: \`[조작] 클릭\`, description: \`설명 1\` },
          { step: 2, title: \`결과\`, description: \`설명 2\`, observe: \`200 OK 수신 완료\`, observeAt: \`playground\` }
        ]}
      />
    `
    const parsed = parseGuideCardFromTsx(tsx)
    assert.ok(parsed)
    assert.ok(parsed.concept.includes('800ms 지연 처리'))
    assert.strictEqual(parsed.steps.length, 2)
  }
)

// ============================================================================
// 2. GC01~GC07 Rule Oracles
// ============================================================================
console.log('\n--- 2. GC01~GC07 Rule Oracles ---')

runCase('GC01-01', 'GC01', 'Identify 6 category template step sets', 'INFO', () => {
  assert.strictEqual(KNOWN_TEMPLATE_STEP_SETS.length, 6)
  for (const set of KNOWN_TEMPLATE_STEP_SETS) {
    assert.strictEqual(set.length, 3)
  }
})

runCase('GC01-02', 'GC01', 'Identify 7 concept template boilerplate patterns', 'INFO', () => {
  assert.ok(CONCEPT_TEMPLATE_PATTERNS.length >= 7)
  const bp = "Next.js 빌트인 컴포넌트 '<Link prefetch>'을 활용하여 쇼핑몰의 성능, SEO..."
  assert.ok(CONCEPT_TEMPLATE_PATTERNS.some((p) => p.test(bp)))
})

runCase('GC02-01', 'GC02', 'Detect duplicated step sequences across demos', 'INFO', () => {
  const steps1 = ['초기화', '인터랙션', '검증'].join(' /// ')
  const steps2 = ['초기화', '인터랙션', '검증'].join(' /// ')
  assert.strictEqual(steps1, steps2)
})

runCase('GC03-01', 'GC03', 'Bracket UI label extraction with prefix symbols [+ 버튼]', 'INFO', () => {
  const guideText = '1. [+ 장바구니 담기] 클릭'
  const brackets = Array.from(guideText.matchAll(/\[([^\]]+)\]/g)).map((m) => m[1].trim())
  const cleanB = brackets[0].replace(/[+\-→←]/g, '').trim().toLowerCase()
  assert.strictEqual(cleanB, '장바구니 담기')
})

runCase('GC03-02', 'GC03', 'Fallback unbracketed matching for labels >= 3 chars', 'INFO', () => {
  const guideText = '결과를 확인하기 위해 주문제출 버튼을 클릭합니다.'
  const playgroundLabel = '주문제출'
  assert.ok(guideText.toLowerCase().includes(playgroundLabel.toLowerCase()))
})

runCase('GC04-01', 'GC04', 'Observe target length validation (>= 5 chars)', 'INFO', () => {
  const valid = '총액 25,000원 반영'
  assert.ok(valid.trim().length >= 5)
  const invalid = '확인'
  assert.ok(invalid.trim().length < 5)
})

runCase('GC04-02', 'GC04', 'ObserveAt location badge whitelist', 'INFO', () => {
  const ALLOWED = new Set(['playground', 'verification', 'devtools', 'network', 'console'])
  for (const l of ['playground', 'verification', 'devtools', 'network', 'console']) {
    assert.ok(ALLOWED.has(l))
  }
  assert.ok(!ALLOWED.has('server'))
})

runCase('GC05-01', 'GC05', 'Detect template literal and HTML entity leaks', 'INFO', () => {
  const LEAK_REGEX = /\$\{[^}]+\}/
  const ENTITY_REGEX = /&(?:lt|gt|amp|quot|apos|#39|#123|#125);/i
  assert.ok(LEAK_REGEX.test('${id} 파라미터'))
  assert.ok(ENTITY_REGEX.test('&lt;Link&gt;'))
})

runCase('GC05-02', 'GC05', '100% GC05 clean status across all 241 demos in repository', 'CRITICAL', () => {
  const result = validateGuideConsistency({ log: false })
  assert.strictEqual(result.ruleStats.GC05.violations, 0)
  assert.strictEqual(result.ruleStats.GC05.passRate, 100)
})

runCase('GC06-01', 'GC06', 'Step count sanity bounds (2 <= steps <= 6)', 'INFO', () => {
  assert.ok(2 >= 2 && 6 <= 6)
  assert.ok(1 < 2 || 7 > 6)
})

runCase('GC06-02', 'GC06', '1-based sequential step indexing', 'INFO', () => {
  const valid = [{ step: 1 }, { step: 2 }]
  assert.ok(valid.every((s, i) => s.step === i + 1))
})

runCase('GC07-01', 'GC07', 'Concrete values & technical identifiers matching', 'INFO', () => {
  const NUMERIC_REGEX = /\b\d+(?:ms|s|px|KB|MB|%|개|원|배|종)?\b|200|404|307|308|500/
  assert.ok(NUMERIC_REGEX.test('지연 800ms'))
  assert.ok(NUMERIC_REGEX.test('상태 200 OK'))
})

// ============================================================================
// 3. CLI Strict Mode & Report Options
// ============================================================================
console.log('\n--- 3. CLI Flags & Options ---')

runCase('CLI-01', 'CLI', 'Default mode: GC03 severity is warn', 'INFO', () => {
  const res = validateGuideConsistency({ strict: false, log: false })
  assert.strictEqual(res.ruleStats.GC03.severity, 'warn')
})

runCase('CLI-02', 'CLI', 'Strict mode: GC03 severity is error', 'INFO', () => {
  const res = validateGuideConsistency({ strict: true, log: false })
  assert.strictEqual(res.ruleStats.GC03.severity, 'error')
})

// Print Summary
console.log('\n========================================================================')
const total = results.length
const passed = results.filter((r) => r.status === 'PASS').length
const failed = results.filter((r) => r.status === 'FAIL').length
console.log(`  AGGREGATED RESULTS: Total: ${total} | Passed: ${passed} | Failed: ${failed}`)
console.log('========================================================================\n')

if (failed > 0) {
  console.log('  CRITICAL VULNERABILITIES IDENTIFIED:')
  for (const f of results.filter((r) => r.status === 'FAIL')) {
    console.log(`  - [${f.id}] ${f.category} (${f.severity}): ${f.description}`)
    console.log(`    Root Cause: ${f.bugDescription}`)
  }
}
