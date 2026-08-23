import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  validateGuideConsistency,
  parseGuideCardFromTsx,
  extractPlaygroundMetadata,
} from '../runners/guide-consistency-validator.ts'
import { loadDemosManifest, getDemoSourceDir } from '../utils/test-helpers.ts'

describe('Tier 1: Feature 13 - Demo Guide Consistency & Schema Validation', () => {
  const manifest = loadDemosManifest()
  const result = validateGuideConsistency({ log: false })

  it('13.1 should parse DemoGuideCard from all 241 demos without parsing failures', () => {
    assert.strictEqual(result.totalDemos, 241, 'Expected exactly 241 demos to be scanned')
    assert.strictEqual(result.audits.length, 241, 'Expected 241 demo audits')
    for (const audit of result.audits) {
      assert.ok(audit.guide, `DemoGuideCard must be parsed for demo '${audit.url}'`)
      assert.ok(audit.guide.steps.length >= 2, `Demo '${audit.url}' must have at least 2 steps`)
    }
  })

  it('13.2 should verify 100% clean GC05 (zero string and HTML entity leaks across all 241 demos)', () => {
    assert.strictEqual(
      result.ruleStats.GC05.violations,
      0,
      `Expected 0 GC05 string/entity leak violations across all 241 demos (found ${result.ruleStats.GC05.violations})`,
    )
    assert.strictEqual(result.ruleStats.GC05.passRate, 100)
  })

  it('13.3 should extract playground interactive metadata accurately', () => {
    const optimisticDemo = manifest.find((d) => d.url.includes('optimistic-cart'))
    assert.ok(optimisticDemo, 'optimistic-cart demo must exist')
    const dir = getDemoSourceDir(optimisticDemo)
    const meta = extractPlaygroundMetadata(dir)
    assert.ok(meta.interactiveCount > 0, 'optimistic-cart must have interactive elements')
    assert.ok(meta.allLabels.length > 0, 'optimistic-cart must have extracted UI labels')
  })

  it('13.4 should validate DemoStep observe and observeAt location badge schema', () => {
    const sampleTsx = `
      <DemoGuideCard
        title="테스트 가이드"
        concept="Next.js 16 App Router 테스트 개념입니다."
        steps={[
          { step: 1, title: "[조작] 버튼 클릭", description: "버튼을 클릭합니다.", actionBadge: "클릭" },
          { step: 2, title: "결과 확인", description: "결과를 확인합니다.", observe: "상태 변화 200 OK", observeAt: "verification" }
        ]}
      />
    `
    const parsed = parseGuideCardFromTsx(sampleTsx)
    assert.ok(parsed, 'Sample TSX must parse')
    assert.strictEqual(parsed.steps.length, 2)
    assert.strictEqual(parsed.steps[1].observe, '상태 변화 200 OK')
    assert.strictEqual(parsed.steps[1].observeAt, 'verification')
  })

  it('13.5 should compute category breakdown stats across 4 primary doc categories', () => {
    const categories = Object.keys(result.categoryStats)
    assert.ok(categories.includes('1-getting-started'))
    assert.ok(categories.includes('2-guides'))
    assert.ok(categories.includes('3-api-reference'))
    assert.ok(categories.includes('5-architecture'))

    assert.strictEqual(result.categoryStats['1-getting-started'].total, 25)
    assert.strictEqual(result.categoryStats['2-guides'].total, 77)
    assert.strictEqual(result.categoryStats['3-api-reference'].total, 135)
    assert.strictEqual(result.categoryStats['5-architecture'].total, 4)
  })

  it('13.6 should parse TSX with trailing commas in steps array without dropping the last step', () => {
    const sampleTrailingCommaTsx = `
      <DemoGuideCard
        title="트레일링 콤마 가이드"
        concept="Prettier 포맷팅으로 steps 배열 마지막에 콤마가 존재하는 200 OK 사양입니다."
        steps={[
          {
            step: 1,
            title: "[조작] 클릭",
            description: "첫 번째 단계 설명입니다.",
            actionBadge: "클릭",
          },
          {
            step: 2,
            title: "결과 확인",
            description: "두 번째 단계 설명입니다.",
            observe: "상태 변화 200 OK",
            observeAt: "verification",
          },
        ]}
      />
    `
    const parsed = parseGuideCardFromTsx(sampleTrailingCommaTsx)
    assert.ok(parsed, 'TSX with trailing commas must parse')
    assert.strictEqual(parsed.steps.length, 2, 'Trailing comma must not drop final step')
    assert.strictEqual(parsed.steps[1].observe, '상태 변화 200 OK')
    assert.strictEqual(parsed.steps[1].observeAt, 'verification')
  })

  it('13.7 should parse TSX with mixed/nested quotes in title, concept, and step properties without string truncation', () => {
    const sampleMixedQuotesTsx = `
      <DemoGuideCard
        title='[Click "Submit"] 버튼 데모'
        concept="함수 또는 컴포넌트에 'use cache'를 선언하면 800ms 지연 없이 0ms 즉시 응답합니다."
        steps={[
          { step: 1, title: '[Click "Action"] 수행', description: '버튼 "제출"을 클릭합니다.' },
          { step: 2, title: "결과 '200 OK' 확인", description: "서버 'use server' 응답을 확인합니다.", observe: '관찰 대상 "성공 200 OK" 데이터', observeAt: "verification" },
        ]}
      />
    `
    const parsed = parseGuideCardFromTsx(sampleMixedQuotesTsx)
    assert.ok(parsed, 'TSX with mixed quotes must parse')
    assert.strictEqual(parsed.title, '[Click "Submit"] 버튼 데모')
    assert.strictEqual(
      parsed.concept,
      "함수 또는 컴포넌트에 'use cache'를 선언하면 800ms 지연 없이 0ms 즉시 응답합니다."
    )
    assert.strictEqual(parsed.steps[0].title, '[Click "Action"] 수행')
    assert.strictEqual(parsed.steps[1].observe, '관찰 대상 "성공 200 OK" 데이터')
  })

  it('13.8 should parse TSX with self-closing sub-tags inside props without premature termination', () => {
    const sampleSelfClosingTagTsx = `
      <DemoGuideCard
        title="Link <Image src='/logo.png' /> 컴포넌트 데모"
        concept="JSX <br /> 태그나 <Image /> 컴포넌트 참조가 포함된 200 OK 개념입니다."
        steps={[
          { step: 1, title: "[조작] <Button /> 클릭", description: "버튼을 클릭합니다." },
          { step: 2, title: "결과 확인", description: "결과를 확인합니다.", observe: "상태 변화 200 OK", observeAt: "playground" }
        ]}
      />
    `
    const parsed = parseGuideCardFromTsx(sampleSelfClosingTagTsx)
    assert.ok(parsed, 'TSX with self-closing sub-tags in props must parse')
    assert.strictEqual(parsed.title, "Link <Image src='/logo.png' /> 컴포넌트 데모")
    assert.ok(parsed.concept.includes('<Image />'))
    assert.strictEqual(parsed.steps.length, 2)
  })
})
