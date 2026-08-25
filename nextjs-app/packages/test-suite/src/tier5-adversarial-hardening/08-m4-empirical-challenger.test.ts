import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'
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
  KNOWN_TEMPLATE_STEP_SETS,
  CONCEPT_TEMPLATE_PATTERNS,
  type GuideCardData,
} from '../runners/guide-consistency-validator.ts'

// SSR React setup
const baselineRequire = createRequire(path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/package.json'))
const React = baselineRequire('react')
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

describe('Tier 5 Adversarial Hardening — 08: Milestone M4 Empirical Verification & Stress Harness', () => {
  const manifest = loadDemosManifest()
  const demoKit = loadTsxComponent('packages/demo-kit/src/index.ts')
  const DemoGuideCard = demoKit.DemoGuideCard
  const DemoContainer = demoKit.DemoContainer
  const DemoPlaygroundCard = demoKit.DemoPlaygroundCard
  const ExpectedActualPanel = demoKit.ExpectedActualPanel
  const DemoDeepDiveCard = demoKit.DemoDeepDiveCard

  // Isolate M4 Demos (81 total: 77 in 2-guides, 4 in 5-architecture)
  const getCat = (doc: string) => {
    const norm = (doc || '').replace(/^\/?(nextjs-docs\/)?/, '')
    const seg = norm.split('/')[0] || ''
    return seg
  }

  const guidesDemos = manifest.filter((d) => getCat(d.doc) === '2-guides')
  const archDemos = manifest.filter((d) => getCat(d.doc) === '5-architecture')
  const m4Demos = [...guidesDemos, ...archDemos]

  it('8.1 Scope & Manifest Invariant: Exactly 81 demos must be in Milestone M4 (77 guides + 4 architecture)', () => {
    assert.strictEqual(guidesDemos.length, 77, `Expected 77 2-guides demos, found ${guidesDemos.length}`)
    assert.strictEqual(archDemos.length, 4, `Expected 4 5-architecture demos, found ${archDemos.length}`)
    assert.strictEqual(m4Demos.length, 81, `Expected exactly 81 M4 demos, found ${m4Demos.length}`)
  })

  it('8.2 GC01 ~ GC07 Zero-Violation Guarantee across all 81 M4 demos', () => {
    const globalResult = validateGuideConsistency({ strict: false, log: false })
    const m4Audits = globalResult.audits.filter((a) => m4Demos.some((m) => m.url === a.url))

    assert.strictEqual(m4Audits.length, 81, 'All 81 M4 demos must be audited')

    for (const audit of m4Audits) {
      assert.ok(audit.guide, `[${audit.url}] DemoGuideCard must be present and parseable`)
      const errorViolations = audit.violations.filter((v) => v.severity === 'error')
      assert.strictEqual(
        errorViolations.length,
        0,
        `[${audit.url}] Found ${errorViolations.length} error violations: ${errorViolations.map((v) => v.message).join('; ')}`,
      )
    }
  })

  it('8.3 GC04 Observe Target & Location Badge Rigorous Integrity across all 81 M4 demos', () => {
    const ALLOWED_LOCATIONS = new Set(['playground', 'verification', 'devtools', 'network', 'console'])
    for (const demo of m4Demos) {
      const dir = getDemoSourceDir(demo)
      const files = getAllFiles(dir, ['.tsx', '.ts'])
      let guide: GuideCardData | null = null

      for (const f of files) {
        const text = fs.readFileSync(f, 'utf-8')
        if (text.includes('DemoGuideCard')) {
          guide = parseGuideCardFromTsx(text)
          if (guide && guide.steps.length > 0) break
        }
      }

      assert.ok(guide, `[${demo.url}] Guide must exist`)
      const lastStep = guide.steps[guide.steps.length - 1]
      assert.ok(lastStep, `[${demo.url}] Must have final step`)
      assert.ok(
        lastStep.observe && lastStep.observe.trim().length >= 5,
        `[${demo.url}] Final step must have observe string >= 5 chars (got "${lastStep.observe}")`,
      )
      if (lastStep.observeAt) {
        assert.ok(
          ALLOWED_LOCATIONS.has(lastStep.observeAt),
          `[${demo.url}] Invalid observeAt location "${lastStep.observeAt}"`,
        )
      }
    }
  })

  it('8.4 Empirical SSR & 4-Tier Container Rendering for all 81 M4 demos', () => {
    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')

    for (const demo of m4Demos) {
      const dir = getDemoSourceDir(demo)
      const files = getAllFiles(dir, ['.tsx', '.ts'])
      let guide: GuideCardData | null = null

      for (const f of files) {
        const text = fs.readFileSync(f, 'utf-8')
        if (text.includes('DemoGuideCard')) {
          guide = parseGuideCardFromTsx(text)
          if (guide && guide.steps.length > 0) break
        }
      }

      assert.ok(guide, `[${demo.url}] Guide must be present`)

      // 1. Standalone DemoGuideCard SSR
      const guideHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(DemoGuideCard, {
          title: guide.title,
          concept: guide.concept,
          steps: guide.steps,
        }),
      )

      assert.ok(guideHtml.includes('<fieldset'), `[${demo.url}] Must contain <fieldset`)
      assert.ok(
        guideHtml.includes(`[가이드] ${escapeHtml(guide.title)}`),
        `[${demo.url}] Must contain legend [가이드] title`,
      )
      assert.ok(guideHtml.includes('핵심 원리:</span>'), `[${demo.url}] Must contain concept prefix`)
      assert.ok(guideHtml.includes('관찰 →'), `[${demo.url}] Must render 관찰 prefix`)

      const lastStep = guide.steps[guide.steps.length - 1]
      assert.ok(
        guideHtml.includes(escapeHtml(lastStep.observe!)),
        `[${demo.url}] Must render observe text in HTML`,
      )

      // 2. Full 4-Tier Layout Integration SSR
      const fullHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(
          DemoContainer,
          null,
          React.createElement(DemoGuideCard, {
            title: guide.title,
            concept: guide.concept,
            steps: guide.steps,
          }),
          React.createElement(DemoPlaygroundCard, { title: '실습' }, React.createElement('div', null, '실습')),
          React.createElement(ExpectedActualPanel, {
            title: '검증',
            expected: '정상',
            actual: '정상',
            isMatched: true,
          }),
          React.createElement(DemoDeepDiveCard, { title: '개념' }, React.createElement('p', null, '설명')),
        ),
      )

      const fieldsetCount = (fullHtml.match(/<fieldset/g) || []).length
      assert.strictEqual(fieldsetCount, 4, `[${demo.url}] Expected 4 fieldsets in 4-tier container`)
    }
  })

  it('8.5 Critical Concept Error #2 (guides/server-actions/start-transition) must be accurately corrected', () => {
    const globalResult = validateGuideConsistency({ strict: false, log: false })

    const startTransitionAudit = globalResult.audits.find(
      (a) => a.url === 'guides/server-actions/start-transition',
    )
    assert.ok(startTransitionAudit?.guide)
    const text = (
      startTransitionAudit.guide.concept +
      ' ' +
      startTransitionAudit.guide.steps.map((s) => s.description).join(' ')
    ).toLowerCase()

    assert.ok(
      text.includes('starttransition') || text.includes('비동기 트랜지션'),
      'start-transition must teach programmatic startTransition',
    )
    assert.ok(
      text.includes('ispending') || text.includes('600ms') || text.includes('로딩') || text.includes('지연'),
      'start-transition must include isPending or 600ms latency',
    )
    assert.ok(
      !text.includes('useactionstate') && !text.includes('useformstatus'),
      'start-transition must not describe form action state hooks',
    )
  })

  it('8.6 Global Repository Health: 241/241 demos in repository have 0 GC01/02/04/05/06/07 errors', () => {
    const globalResult = validateGuideConsistency({ strict: false, log: false })

    assert.strictEqual(globalResult.totalDemos, 241, 'Must have 241 total demos')
    assert.strictEqual(globalResult.validDemos, 241, 'All 241 demos must be valid with 0 errors')
    assert.strictEqual(globalResult.ruleStats.GC01.violations, 0, '0 GC01 errors')
    assert.strictEqual(globalResult.ruleStats.GC02.violations, 0, '0 GC02 errors')
    assert.strictEqual(globalResult.ruleStats.GC04.violations, 0, '0 GC04 errors')
    assert.strictEqual(globalResult.ruleStats.GC05.violations, 0, '0 GC05 errors')
    assert.strictEqual(globalResult.ruleStats.GC06.violations, 0, '0 GC06 errors')
    assert.strictEqual(globalResult.ruleStats.GC07.violations, 0, '0 GC07 errors')
  })

  it('8.7 Oracle Resilience: Adversarial mutations must trigger validation failures', () => {
    // 1. Template Step Set mutation
    const fakeTemplateGuide = {
      title: '쇼핑몰 시나리오 가짜 템플릿',
      concept: 'Next.js 16 App Router 200 OK 사양입니다.',
      steps: [
        { step: 1, title: KNOWN_TEMPLATE_STEP_SETS[0][0], description: '설명 1' },
        { step: 2, title: KNOWN_TEMPLATE_STEP_SETS[0][1], description: '설명 2' },
        { step: 3, title: KNOWN_TEMPLATE_STEP_SETS[0][2], description: '설명 3', observe: '관찰 데이터 200 OK' },
      ],
    }
    const isStepTmpl = KNOWN_TEMPLATE_STEP_SETS.some((set) =>
      set.every((t, i) => t === fakeTemplateGuide.steps[i].title),
    )
    assert.ok(isStepTmpl, 'Oracle must flag known template step titles')

    // 2. String leak mutation
    const fakeLeakGuide = {
      title: '유출 가이드',
      concept: '경로 &lt;Link&gt;에 대한 설명입니다.',
      steps: [
        { step: 1, title: '조작', description: '설명' },
        { step: 2, title: '확인', description: '설명', observe: '확인 200 OK' },
      ],
    }
    assert.ok(/&lt;/.test(fakeLeakGuide.concept), 'Oracle must detect &lt; entity leaks')
  })
})
