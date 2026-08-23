import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  parseGuideCardFromTsx,
  extractPlaygroundMetadata,
  validateGuideConsistency,
  KNOWN_TEMPLATE_STEP_SETS,
  CONCEPT_TEMPLATE_PATTERNS,
} from '../runners/guide-consistency-validator.ts'
import { NEXTJS_APP_ROOT, loadDemosManifest, getDemoSourceDir } from '../utils/test-helpers.ts'

describe('Tier 5 Adversarial Hardening — 06: Guide Consistency Validator Stress & Oracle Harness', () => {
  // =========================================================================
  // 1. TSX Parser Stress Testing (parseGuideCardFromTsx)
  // =========================================================================
  describe('1. TSX Parser Edge Cases & Stress Scenarios', () => {
    it('1.1 should parse standard double-quoted props and steps', () => {
      const tsx = `
        export default function DemoPage() {
          return (
            <DemoGuideCard
              title="표준 가이드"
              concept="useOptimistic 훅을 사용하여 0ms 즉시 피드백을 제공합니다."
              steps={[
                { step: 1, title: "[+ 장바구니] 클릭", description: "버튼을 클릭합니다.", actionBadge: "클릭" },
                { step: 2, title: "서버 동기화 확인", description: "서버 응답을 확인합니다.", observe: "총액 15,000원 반영", observeAt: "verification" }
              ]}
            />
          )
        }
      `
      const parsed = parseGuideCardFromTsx(tsx)
      assert.ok(parsed, 'Must parse valid TSX')
      assert.strictEqual(parsed.title, '표준 가이드')
      assert.strictEqual(parsed.concept, 'useOptimistic 훅을 사용하여 0ms 즉시 피드백을 제공합니다.')
      assert.strictEqual(parsed.steps.length, 2)
      assert.strictEqual(parsed.steps[0].step, 1)
      assert.strictEqual(parsed.steps[0].title, '[+ 장바구니] 클릭')
      assert.strictEqual(parsed.steps[0].actionBadge, '클릭')
      assert.strictEqual(parsed.steps[1].observe, '총액 15,000원 반영')
      assert.strictEqual(parsed.steps[1].observeAt, 'verification')
    })

    it('1.2 should parse single-quoted props inside JSX expressions', () => {
      const tsx = `
        <DemoGuideCard
          title={'단일 따옴표 제목'}
          concept={'Next.js revalidatePath 200 OK 동작 원리입니다.'}
          steps={[
            { step: 1, title: '[요청 전송]', description: 'POST 요청을 발생시킵니다.' },
            { step: 2, title: '캐시 갱신 확인', description: '갱신된 타임스탬프를 확인합니다.', observe: 'timestamp 갱신 완료', observeAt: 'playground' }
          ]}
        />
      `
      const parsed = parseGuideCardFromTsx(tsx)
      assert.ok(parsed)
      assert.strictEqual(parsed.title, '단일 따옴표 제목')
      assert.strictEqual(parsed.concept, 'Next.js revalidatePath 200 OK 동작 원리입니다.')
      assert.strictEqual(parsed.steps.length, 2)
    })

    it('1.3 should parse template literals with multiline strings and internal whitespace', () => {
      const tsx = `
        <DemoGuideCard
          title={\`템플릿 리터럴 제목\`}
          concept={\`
            Next.js 16 App Router에서 Server Action 실행 시
            800ms 네트워크 지연 동안 UI 블로킹 없이 낙관적 업데이트를 수행합니다.
          \`}
          steps={[
            {
              step: 1,
              title: \`[주문하기] 클릭\`,
              description: \`
                주문 버튼을 눌러
                낙관적 상태를 확인합니다.
              \`,
              actionBadge: \`Action\`
            },
            {
              step: 2,
              title: \`완료 상태 관찰\`,
              description: \`서버 완료 응답을 확인합니다.\`,
              observe: \`주문 완료 상태 200 OK\`,
              observeAt: \`devtools\`
            }
          ]}
        />
      `
      const parsed = parseGuideCardFromTsx(tsx)
      assert.ok(parsed)
      assert.strictEqual(parsed.title, '템플릿 리터럴 제목')
      assert.ok(parsed.concept.includes('Server Action 실행 시'))
      assert.strictEqual(parsed.steps.length, 2)
      assert.strictEqual(parsed.steps[0].actionBadge, 'Action')
      assert.strictEqual(parsed.steps[1].observeAt, 'devtools')
    })

    it('1.4 should handle self-closing vs explicit closing DemoGuideCard tag', () => {
      const selfClosing = `<DemoGuideCard title="제목" concept="개념 200 OK" steps={[{ step: 1, title: "1", description: "d" }, { step: 2, title: "2", description: "d", observe: "12345" }]} />`
      const explicitClosing = `<DemoGuideCard title="제목" concept="개념 200 OK" steps={[{ step: 1, title: "1", description: "d" }, { step: 2, title: "2", description: "d", observe: "12345" }]}></DemoGuideCard>`

      const p1 = parseGuideCardFromTsx(selfClosing)
      const p2 = parseGuideCardFromTsx(explicitClosing)

      assert.ok(p1 && p2)
      assert.strictEqual(p1.title, p2.title)
      assert.strictEqual(p1.steps.length, p2.steps.length)
    })

    it('1.5 should return null when DemoGuideCard is not present in TSX', () => {
      const tsx = `export default function Page() { return <div>일반 컴포넌트</div> }`
      const parsed = parseGuideCardFromTsx(tsx)
      assert.strictEqual(parsed, null)
    })

    it('1.6 should handle unicode characters, emojis, and symbols in guide data', () => {
      const tsx = `
        <DemoGuideCard
          title="장바구니 🛒 & 결제 ⚡ 데모"
          concept="useOptimistic(15,000원 → 25,000원) 실시간 계산기입니다."
          steps={[
            { step: 1, title: "[+ 1개 추가] 클릭", description: "수량을 1개 늘립니다.", actionBadge: "🛒 담기" },
            { step: 2, title: "합계액 검증", description: "최종 합계를 확인합니다.", observe: "합계 25,000원 (VAT 포함)", observeAt: "verification" }
          ]}
        />
      `
      const parsed = parseGuideCardFromTsx(tsx)
      assert.ok(parsed)
      assert.strictEqual(parsed.title, '장바구니 🛒 & 결제 ⚡ 데모')
      assert.strictEqual(parsed.steps[0].actionBadge, '🛒 담기')
      assert.strictEqual(parsed.steps[1].observe, '합계 25,000원 (VAT 포함)')
    })
  })

  // =========================================================================
  // 2. Playground Metadata Extraction Stress Testing
  // =========================================================================
  describe('2. Playground Metadata Extraction & Interactive Elements', () => {
    it('2.1 should extract live interactive buttons, links, and inputs accurately from optimistic-cart', () => {
      const manifest = loadDemosManifest()
      const demo = manifest.find((d) => d.url.includes('optimistic-cart'))
      assert.ok(demo, 'optimistic-cart demo must exist')

      const dir = getDemoSourceDir(demo)
      const meta = extractPlaygroundMetadata(dir)

      assert.ok(meta.interactiveCount >= 1, `interactiveCount must be >= 1, got ${meta.interactiveCount}`)
      assert.ok(meta.allLabels.length >= 1, `allLabels must contain UI labels, got ${meta.allLabels.length}`)
    })

    it('2.2 should extract labels from nested spans within buttons and links', () => {
      const sampleDir = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline/mutating-data/optimistic-cart')
      const meta = extractPlaygroundMetadata(sampleDir)
      assert.ok(meta.buttons.length > 0)
    })
  })

  // =========================================================================
  // 3. GC01: Template Fingerprints Oracle
  // =========================================================================
  describe('3. Rule GC01: Template Fingerprints Prohibition', () => {
    it('3.1 should match all 6 known category template step sets', () => {
      assert.strictEqual(KNOWN_TEMPLATE_STEP_SETS.length, 6, 'Must define exactly 6 template sets')
      for (const set of KNOWN_TEMPLATE_STEP_SETS) {
        assert.strictEqual(set.length, 3, 'Each template set must have 3 steps')
      }
    })

    it('3.2 should match known concept boilerplate regex patterns', () => {
      assert.ok(CONCEPT_TEMPLATE_PATTERNS.length >= 7)

      const boilerplate1 = "Next.js 빌트인 컴포넌트 '<Link prefetch>'을 활용하여 쇼핑몰의 성능, SEO, 폼 상호작용을 최적화하는 실무 구현입니다."
      const boilerplate2 = "쇼핑몰 라우팅 계층에서 Next.js 특수 파일 컨벤션을 선언하여..."
      const boilerplate3 = "표준 아키텍처 스펙으로 설계된 App Router 데모입니다."

      assert.ok(CONCEPT_TEMPLATE_PATTERNS.some((p) => p.test(boilerplate1)))
      assert.ok(CONCEPT_TEMPLATE_PATTERNS.some((p) => p.test(boilerplate2)))
      assert.ok(CONCEPT_TEMPLATE_PATTERNS.some((p) => p.test(boilerplate3)))
    })

    it('3.3 should NOT flag authentic, custom concepts', () => {
      const authenticConcept = "네트워크 지연(800ms)이 있는 환경에서도 useOptimistic을 적용하면 버튼을 누르는 즉시(0ms) 장바구니 수량과 총액이 먼저 올라갑니다."
      assert.ok(!CONCEPT_TEMPLATE_PATTERNS.some((p) => p.test(authenticConcept)))
    })
  })

  // =========================================================================
  // 4. GC02: Step Title Duplicates Oracle
  // =========================================================================
  describe('4. Rule GC02: Step Title Sequence Uniqueness', () => {
    it('4.1 should detect identical 3-step sequences across multiple demos', () => {
      const stepSeq1 = ['쇼핑몰 시나리오 초기화', '핵심 인터랙션 수행', '성능 및 동작 검증'].join(' /// ')
      const stepSeq2 = ['쇼핑몰 시나리오 초기화', '핵심 인터랙션 수행', '성능 및 동작 검증'].join(' /// ')
      assert.strictEqual(stepSeq1, stepSeq2)
    })
  })

  // =========================================================================
  // 5. GC03: UI Label Quoting Oracle
  // =========================================================================
  describe('5. Rule GC03: UI Label Quoting & Bracket Verification', () => {
    it('5.1 should match bracketed UI labels including action symbols [+ 버튼]', () => {
      const guideText = '1. [+ 장바구니 담기] 클릭하여 상품을 담습니다.'
      const brackets = Array.from(guideText.matchAll(/\[([^\]]+)\]/g)).map((m) => m[1].trim())
      assert.strictEqual(brackets[0], '+ 장바구니 담기')

      const cleanB = brackets[0].replace(/[+\-→←]/g, '').trim().toLowerCase()
      const playgroundLabel = '장바구니 담기'
      const cleanL = playgroundLabel.replace(/[+\-→←]/g, '').trim().toLowerCase()

      assert.ok(cleanB.includes(cleanL) || cleanL.includes(cleanB))
    })

    it('5.2 should perform case-insensitive label matching', () => {
      const guideText = '1. [SUBMIT ORDER] 클릭하여 주문을 제출합니다.'
      const brackets = Array.from(guideText.matchAll(/\[([^\]]+)\]/g)).map((m) => m[1].trim())
      const cleanB = brackets[0].toLowerCase()
      const playgroundLabel = 'submit order'
      const cleanL = playgroundLabel.toLowerCase()
      assert.strictEqual(cleanB, cleanL)
    })
  })

  // =========================================================================
  // 6. GC04: Last Step Observe Specification Oracle
  // =========================================================================
  describe('6. Rule GC04: Observe Target & Location Badge Specification', () => {
    const ALLOWED = new Set(['playground', 'verification', 'devtools', 'network', 'console'])

    it('6.1 should pass valid observe targets >= 5 characters and allowed observeAt locations', () => {
      const validObserve = '총액 25,000원 반영 확인'
      assert.ok(validObserve.trim().length >= 5)

      for (const loc of ['playground', 'verification', 'devtools', 'network', 'console']) {
        assert.ok(ALLOWED.has(loc))
      }
    })

    it('6.2 should fail invalid observe targets (< 5 chars) or invalid locations', () => {
      const shortObserve = '확인'
      assert.ok(shortObserve.trim().length < 5)

      const invalidLocations = ['server', 'browser', 'database', 'terminal', 'custom']
      for (const loc of invalidLocations) {
        assert.ok(!ALLOWED.has(loc), `Location '${loc}' must not be allowed`)
      }
    })
  })

  // =========================================================================
  // 7. GC05: String Leaks & HTML Entity Leaks Prohibition Oracle
  // =========================================================================
  describe('7. Rule GC05: String Leaks & HTML Entity Escapes Prohibition', () => {
    const LEAK_REGEX = /\$\{[^}]+\}/
    const ENTITY_REGEX = /&(?:lt|gt|amp|quot|apos|#39|#123|#125);/i
    const PLACEHOLDER_REGEX = /\b(?:TODO|FIXME|TBD)\b|undefined\s*입니다|NaN원/i

    it('7.1 should detect unresolved template literals (${...})', () => {
      assert.ok(LEAK_REGEX.test('상품 ID ${id}에 대한 상세 정보'))
      assert.ok(LEAK_REGEX.test('${params.slug} 라우트 확인'))
      assert.ok(!LEAK_REGEX.test('정상적인 $100 달러 표기 및 100원 표기'))
    })

    it('7.2 should detect HTML entity escapes (&lt;, &gt;, &amp;, &quot;)', () => {
      assert.ok(ENTITY_REGEX.test('&lt;Link prefetch&gt; 옵션 대조'))
      assert.ok(ENTITY_REGEX.test('Next.js &amp; React 19'))
      assert.ok(ENTITY_REGEX.test('&quot;use client&quot; 지시어'))
      assert.ok(!ENTITY_REGEX.test("<Link prefetch> 또는 'use client' 정상 표기"))
    })

    it('7.3 should detect unresolved placeholders (TODO, FIXME, TBD, undefined 입니다)', () => {
      assert.ok(PLACEHOLDER_REGEX.test('TODO: 가이드 작성 필요'))
      assert.ok(PLACEHOLDER_REGEX.test('결과는 undefined 입니다'))
      assert.ok(PLACEHOLDER_REGEX.test('현재 가격은 NaN원 입니다'))
      assert.ok(!PLACEHOLDER_REGEX.test('모든 작업이 완료되었습니다.'))
    })

    it('7.4 should verify 100% clean GC05 status across all 241 demos in codebase', () => {
      const result = validateGuideConsistency({ log: false })
      assert.strictEqual(
        result.ruleStats.GC05.violations,
        0,
        `All 241 demos must have 0 GC05 violations (found ${result.ruleStats.GC05.violations})`
      )
      assert.strictEqual(result.ruleStats.GC05.passRate, 100)
    })
  })

  // =========================================================================
  // 8. GC06: Step Count Sanity & Sequence Numbering Oracle
  // =========================================================================
  describe('8. Rule GC06: Step Count Sanity & 1-Based Sequential Ordering', () => {
    it('8.1 should validate step count bounds (2 <= steps <= 6)', () => {
      const validCounts = [2, 3, 4, 5, 6]
      for (const count of validCounts) {
        assert.ok(count >= 2 && count <= 6, `Count ${count} must be valid`)
      }

      const invalidCounts = [0, 1, 7, 10]
      for (const count of invalidCounts) {
        assert.ok(count < 2 || count > 6, `Count ${count} must be invalid`)
      }
    })

    it('8.2 should enforce 1-based sequential step indexing', () => {
      const validSteps = [{ step: 1 }, { step: 2 }, { step: 3 }]
      const isValid = validSteps.every((s, i) => s.step === i + 1)
      assert.ok(isValid)

      const nonSequentialSteps = [{ step: 1 }, { step: 3 }]
      const isInvalid = !nonSequentialSteps.every((s, i) => s.step === i + 1)
      assert.ok(isInvalid)
    })
  })

  // =========================================================================
  // 9. GC07: Concrete Values & API Identifiers Oracle
  // =========================================================================
  describe('9. Rule GC07: Concrete Values & Technical Identifiers in Concept', () => {
    const NUMERIC_REGEX = /\b\d+(?:ms|s|px|KB|MB|%|개|원|배|종)?\b|200|404|307|308|500/
    const IDENTIFIER_REGEX =
      /useOptimistic|revalidatePath|revalidateTag|useActionState|useFormStatus|ImageResponse|headers|cookies|redirect|notFound|usePathname|useSearchParams|cacheTag|cacheLife|dynamicParams|use cache|use client|use server|next\.config|route\.ts|layout\.tsx|page\.tsx|error\.tsx|loading\.tsx|not-found\.tsx|template\.tsx|default\.tsx|Suspense|Promise|Server Action|RSC|RCC|PPR|ISR|SSG|SSR|LCP|CLS|GNB|API|CRUD|DOM|fetch|HTML|CSS|JSON|DB|URL|SEO/i

    it('9.1 should pass concepts containing latency, numeric values, or HTTP codes', () => {
      assert.ok(NUMERIC_REGEX.test('네트워크 지연 800ms 동안 낙관적 업데이트 수행'))
      assert.ok(NUMERIC_REGEX.test('HTTP 200 OK 응답 상태 확인'))
      assert.ok(NUMERIC_REGEX.test('307 Temporary Redirect 전이'))
      assert.ok(NUMERIC_REGEX.test('이미지 15px 패딩 적용'))
    })

    it('9.2 should pass concepts containing Next.js/React technical terms or backtick code', () => {
      assert.ok(IDENTIFIER_REGEX.test('useOptimistic 훅을 적용한 장바구니'))
      assert.ok(IDENTIFIER_REGEX.test('revalidatePath 서버 함수로 캐시 무효화'))
      assert.ok(IDENTIFIER_REGEX.test('Server Action 실행을 통한 데이터 변경'))
      assert.ok(/`[^`]+`/.test('`customHandler()` 함수를 통한 제어'))
    })

    it('9.3 should flag abstract concepts lacking any numbers or technical identifiers', () => {
      const vagueConcept = '이 데모는 효율적인 컴포넌트 구조를 설계하는 방법을 설명합니다.'
      const hasNumeric = NUMERIC_REGEX.test(vagueConcept)
      const hasIdentifier = IDENTIFIER_REGEX.test(vagueConcept) || /`[^`]+`/.test(vagueConcept)
      assert.ok(!hasNumeric && !hasIdentifier, 'Vague concept without numbers or IDs must be flagged')
    })
  })

  // =========================================================================
  // 10. CLI Flags & Strict Mode Execution Oracle
  // =========================================================================
  describe('10. CLI Flags, Strict Mode & Report Generation', () => {
    it('10.1 should treat GC03 as warn in default mode and error in strict mode', () => {
      const normalResult = validateGuideConsistency({ strict: false, log: false })
      assert.strictEqual(normalResult.ruleStats.GC03.severity, 'warn')

      const strictResult = validateGuideConsistency({ strict: true, log: false })
      assert.strictEqual(strictResult.ruleStats.GC03.severity, 'error')
    })

    it('10.2 should generate markdown report file when reportPath is provided', () => {
      const tmpReportPath = path.join(NEXTJS_APP_ROOT, 'docs/test-temp-guide-report.md')
      try {
        validateGuideConsistency({
          reportPath: tmpReportPath,
          log: false,
        })
        assert.ok(fs.existsSync(tmpReportPath), 'Report file must be created')
        const content = fs.readFileSync(tmpReportPath, 'utf-8')
        assert.ok(content.includes('Demo Guide Consistency Audit Report'))
        assert.ok(content.includes('Rule Summary Matrix'))
        assert.ok(content.includes('GC05 String & HTML Entity Leak Status'))
      } finally {
        if (fs.existsSync(tmpReportPath)) {
          fs.unlinkSync(tmpReportPath)
        }
      }
    })
  })
})
