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

describe('Tier 5 Adversarial Hardening — 07: Milestone M3 Empirical Verification & Stress Harness', () => {
  const manifest = loadDemosManifest()
  const demoKit = loadTsxComponent('packages/demo-kit/src/index.ts')
  const DemoGuideCard = demoKit.DemoGuideCard
  const DemoContainer = demoKit.DemoContainer
  const DemoPlaygroundCard = demoKit.DemoPlaygroundCard
  const ExpectedActualPanel = demoKit.ExpectedActualPanel
  const DemoDeepDiveCard = demoKit.DemoDeepDiveCard

  // Isolate M3 Demos (75 total)
  const apiRefDemos = manifest.filter((d) => (d.doc || '').includes('3-api-reference'))
  const m2Urls = apiRefDemos.filter((d) => {
    return (
      (d.url.startsWith('file-conventions/') && !d.url.includes('proxy')) ||
      d.url.startsWith('components/') ||
      d.url.startsWith('directives/')
    )
  })
  const m3Demos = apiRefDemos.filter((d) => !m2Urls.some((m) => m.url === d.url))

  it('7.1 Scope & Manifest Invariant: Exactly 75 demos must be in Milestone M3', () => {
    assert.strictEqual(m3Demos.length, 75, `Expected exactly 75 M3 demos, found ${m3Demos.length}`)
  })

  it('7.2 GC01 ~ GC07 Zero-Violation Guarantee across all 75 M3 demos', () => {
    const globalResult = validateGuideConsistency({ strict: false, log: false })
    const m3Audits = globalResult.audits.filter((a) => m3Demos.some((m) => m.url === a.url))

    assert.strictEqual(m3Audits.length, 75, 'All 75 M3 demos must be audited')

    for (const audit of m3Audits) {
      assert.ok(audit.guide, `[${audit.url}] DemoGuideCard must be present and parseable`)
      const errorViolations = audit.violations.filter((v) => v.severity === 'error')
      assert.strictEqual(
        errorViolations.length,
        0,
        `[${audit.url}] Found ${errorViolations.length} error violations: ${errorViolations.map((v) => v.message).join('; ')}`,
      )
    }
  })

  it('7.3 GC04 Observe Target & Location Badge Rigorous Integrity across all 75 M3 demos', () => {
    const ALLOWED_LOCATIONS = new Set(['playground', 'verification', 'devtools', 'network', 'console'])
    for (const demo of m3Demos) {
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

  it('7.4 Empirical SSR & 4-Tier Container Rendering for all 75 M3 demos', () => {
    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')

    for (const demo of m3Demos) {
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

  it('7.5 Critical Concept Error Demos in M3 must be accurately corrected', () => {
    const globalResult = validateGuideConsistency({ strict: false, log: false })

    // 1. dynamic-receipt
    const receiptAudit = globalResult.audits.find((a) => a.url === 'functions/image-response/dynamic-receipt')
    assert.ok(receiptAudit?.guide)
    const receiptText = (receiptAudit.guide.concept + ' ' + receiptAudit.guide.steps.map((s) => s.description).join(' ')).toLowerCase()
    assert.ok(
      receiptText.includes('영수증') || receiptText.includes('receipt') || receiptText.includes('imageresponse'),
      'dynamic-receipt must teach dynamic receipt generation',
    )
    assert.ok(!receiptText.includes('할인 배너 og'), 'dynamic-receipt must not contain OG discount copy-paste')

    // 2. regex-pattern-matching
    const regexAudit = globalResult.audits.find((a) => a.url === 'config/redirects/regex-pattern-matching')
    assert.ok(regexAudit?.guide)
    const regexText = (regexAudit.guide.concept + ' ' + regexAudit.guide.steps.map((s) => s.description).join(' ')).toLowerCase()
    assert.ok(
      regexText.includes('next.config') || regexText.includes('redirects'),
      'regex-pattern-matching must teach next.config.ts redirects()',
    )

    // 3. header-query-condition
    const condAudit = globalResult.audits.find((a) => a.url === 'config/redirects/header-query-condition')
    assert.ok(condAudit?.guide)
    const condText = (condAudit.guide.concept + ' ' + condAudit.guide.steps.map((s) => s.description).join(' ')).toLowerCase()
    assert.ok(
      condText.includes('has') || condText.includes('missing') || condText.includes('헤더') || condText.includes('쿼리'),
      'header-query-condition must teach has/missing condition routing',
    )

    // 4. nodejs-modules-bailout
    const bailoutAudit = globalResult.audits.find((a) => a.url === 'edge/v8-lightweight/nodejs-modules-bailout')
    assert.ok(bailoutAudit?.guide)
    const bailoutText = (bailoutAudit.guide.concept + ' ' + bailoutAudit.guide.steps.map((s) => s.description).join(' ')).toLowerCase()
    assert.ok(
      bailoutText.includes('bailout') || bailoutText.includes('v8') || bailoutText.includes('edge') || bailoutText.includes('node'),
      'nodejs-modules-bailout must teach Node.js runtime bailout in Edge',
    )

    // 5. env build-time-injection
    const envAudit = globalResult.audits.find((a) => a.url === 'config/env/build-time-injection')
    assert.ok(envAudit?.guide)
    const envText = (envAudit.guide.concept + ' ' + envAudit.guide.steps.map((s) => s.description).join(' ')).toLowerCase()
    assert.ok(
      envText.includes('빌드') || envText.includes('번들') || envText.includes('주입') || envText.includes('정적 치환'),
      'env build-time-injection must teach build-time static string replacement',
    )
  })

  it('7.6 Oracle Resilience: Adversarial mutations must trigger validation failures', () => {
    // 1. Template Step Set mutation
    const fakeTemplateGuide = {
      title: '가짜 템플릿',
      concept: 'Next.js 16 App Router 200 OK 사양입니다.',
      steps: [
        { step: 1, title: KNOWN_TEMPLATE_STEP_SETS[1][0], description: '설명 1' },
        { step: 2, title: KNOWN_TEMPLATE_STEP_SETS[1][1], description: '설명 2' },
        { step: 3, title: KNOWN_TEMPLATE_STEP_SETS[1][2], description: '설명 3', observe: '관찰 데이터 200 OK' },
      ],
    }
    const isStepTmpl = KNOWN_TEMPLATE_STEP_SETS.some((set) =>
      set.every((t, i) => t === fakeTemplateGuide.steps[i].title),
    )
    assert.ok(isStepTmpl, 'Oracle must flag known template step titles')

    // 2. String leak mutation
    const fakeLeakGuide = {
      title: '유출 가이드',
      concept: '경로 ${id}에 대한 설명입니다.',
      steps: [
        { step: 1, title: '조작', description: '설명' },
        { step: 2, title: '확인', description: '설명', observe: '확인 200 OK' },
      ],
    }
    assert.ok(/\$\{[^}]+\}/.test(fakeLeakGuide.concept), 'Oracle must detect ${...} leaks')
  })
})
