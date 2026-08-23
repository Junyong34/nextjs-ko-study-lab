import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'
import { NEXTJS_APP_ROOT } from '../utils/test-helpers.ts'

// SSR React loader using baseline package dependencies
const baselineRequire = createRequire(path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/package.json'))
const React = baselineRequire('react')
const jsxRuntime = baselineRequire('react/jsx-runtime')
const ReactDOMServer = baselineRequire('react-dom/server')

/**
 * Dynamically transpile and load TSX component from source
 */
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
    if (mod === 'react/jsx-runtime') return jsxRuntime
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

describe('Tier 5 Adversarial Hardening — 05: DemoGuideCard & 4-Tier Layout Stress Oracle (M0)', () => {
  const demoKit = loadTsxComponent('packages/demo-kit/src/index.ts')
  const DemoGuideCard = demoKit.DemoGuideCard
  const DemoContainer = demoKit.DemoContainer
  const DemoPlaygroundCard = demoKit.DemoPlaygroundCard
  const ExpectedActualPanel = demoKit.ExpectedActualPanel
  const DemoDeepDiveCard = demoKit.DemoDeepDiveCard

  it('5.1 Module Exports Contract: DemoGuideCard and types must be correctly exported', () => {
    assert.ok(DemoGuideCard, 'DemoGuideCard must be exported by @study/demo-kit')
    assert.strictEqual(typeof DemoGuideCard, 'function', 'DemoGuideCard must be a React functional component')
    assert.ok(DemoContainer, 'DemoContainer must be exported')
    assert.ok(DemoPlaygroundCard, 'DemoPlaygroundCard must be exported')
    assert.ok(ExpectedActualPanel, 'ExpectedActualPanel must be exported')
    assert.ok(DemoDeepDiveCard, 'DemoDeepDiveCard must be exported')
  })

  it('5.2 Backward Compatibility: Steps without observe or observeAt must render cleanly', () => {
    const props = {
      title: '레거시 가이드 테스트',
      concept: '기존 3스텝 레거시 가이드 렌더링 호환성을 검증합니다.',
      steps: [
        {
          step: 1,
          title: '지시어 선언 위치 확인',
          description: '파일 최상단 또는 함수 최상단에 선언된 지시어의 스코프를 점검합니다.',
          actionBadge: '지시어 점검',
        },
        {
          step: 2,
          title: '경계 전환 인터랙션',
          description: '서버 컴포넌트와 클라이언트 컴포넌트 간의 상호 호출을 실행합니다.',
        },
      ],
    }

    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(DemoGuideCard, props))

    assert.ok(html.includes('<fieldset'), 'Must contain fieldset root')
    assert.ok(html.includes('[가이드] 레거시 가이드 테스트'), 'Must render legend')
    assert.ok(html.includes('핵심 원리:</span> 기존 3스텝 레거시 가이드'), 'Must render concept')
    assert.ok(html.includes('지시어 점검'), 'Must render actionBadge when present')
    assert.ok(html.includes('경계 전환 인터랙션'), 'Must render step 2 title')
    assert.ok(!html.includes('관찰 →'), 'Must NOT render observation line when observe is absent')
    assert.ok(!html.includes('undefined'), 'Must NOT contain undefined strings in HTML')
  })

  it('5.3 observe without observeAt: Must render 관찰 label without location badge', () => {
    const props = {
      title: '관찰 안내 기본 테스트',
      concept: 'observe 필드만 있고 observeAt이 생략된 경우의 렌더링을 검증합니다.',
      steps: [
        {
          step: 1,
          title: '[장바구니 담기] 클릭',
          description: '상품 카드에서 담기 버튼을 클릭합니다.',
          observe: '장바구니 수량 1 증가 및 알림 토스트 출력',
        },
      ],
    }

    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(DemoGuideCard, props))

    assert.ok(html.includes('관찰 →'), 'Must render 관찰 prefix')
    assert.ok(html.includes('장바구니 수량 1 증가 및 알림 토스트 출력'), 'Must render observe text')
    // Check that none of the location labels are rendered
    assert.ok(!html.includes('검증 패널'), 'Must not render 검증 패널 badge')
    assert.ok(!html.includes('실습 영역'), 'Must not render 실습 영역 badge')
    assert.ok(!html.includes('DevTools'), 'Must not render DevTools badge')
    assert.ok(!html.includes('Network'), 'Must not render Network badge')
    assert.ok(!html.includes('Console'), 'Must not render Console badge')
  })

  it('5.4 All 5 Standard observeAt Locations: Must map labels and CSS styles accurately', () => {
    const testCases = [
      {
        loc: 'playground',
        expectedLabel: '실습 영역',
        expectedClassSubstring: 'border-blue-200',
      },
      {
        loc: 'verification',
        expectedLabel: '검증 패널',
        expectedClassSubstring: 'border-emerald-200',
      },
      {
        loc: 'devtools',
        expectedLabel: 'DevTools',
        expectedClassSubstring: 'border-purple-200',
      },
      {
        loc: 'network',
        expectedLabel: 'Network',
        expectedClassSubstring: 'border-amber-200',
      },
      {
        loc: 'console',
        expectedLabel: 'Console',
        expectedClassSubstring: 'border-zinc-300',
      },
    ]

    for (const tc of testCases) {
      const props = {
        title: `위치 테스트: ${tc.loc}`,
        concept: `${tc.loc} 위치 배지 렌더링 검증`,
        steps: [
          {
            step: 1,
            title: '조작',
            description: '설명',
            observe: `결과 확인 (${tc.loc})`,
            observeAt: tc.loc as any,
          },
        ],
      }

      const html = ReactDOMServer.renderToStaticMarkup(React.createElement(DemoGuideCard, props))
      assert.ok(
        html.includes(tc.expectedLabel),
        `Must render Korean label "${tc.expectedLabel}" for location "${tc.loc}"`,
      )
      assert.ok(
        html.includes(tc.expectedClassSubstring),
        `Must apply theme class containing "${tc.expectedClassSubstring}" for location "${tc.loc}"`,
      )
    }
  })

  it('5.5 Adversarial observeAt: Fallback resilience for unrecognized or custom locations', () => {
    const props = {
      title: '비표준 위치 배지 테스트',
      concept: '타입 단언 등으로 비표준 위치가 주어졌을 때 fallback 렌더링을 검증합니다.',
      steps: [
        {
          step: 1,
          title: '비표준 위치',
          description: '커스텀 관찰 위치 지정',
          observe: '커스텀 위치 관찰',
          observeAt: 'database-log' as any,
        },
      ],
    }

    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(DemoGuideCard, props))
    assert.ok(html.includes('database-log'), 'Must render the custom string directly as badge text')
    assert.ok(
      html.includes('border-zinc-200 bg-zinc-100 text-zinc-600'),
      'Must apply neutral fallback styling when location is unrecognized',
    )
  })

  it('5.6 Multiline Strings & Special Characters & XSS Safety', () => {
    const multilineConcept = `첫 번째 줄 설명입니다.
두 번째 줄: 서버 렌더링 파이프라인.
세 번째 줄: 캐시 태그 <ProductList id="123"> 및 & 특수기호 대조.`

    const multilineObserve = `1. HTTP 200 OK 수신
2. JSON 페이로드 { "status": "active" }
3. HTML 태그 <div> 안전 렌더링`

    const props = {
      title: '특수문자 & <Link prefetch={true}> 테스트',
      concept: multilineConcept,
      className: 'custom-guide-wrapper-class',
      steps: [
        {
          step: 1,
          title: '[<Form action={...}>] 제출',
          description: '엔티티 & 특수문자가 포함된 "설명" \'따옴표\'',
          actionBadge: '<Action>',
          observe: multilineObserve,
          observeAt: 'verification' as const,
        },
      ],
    }

    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(DemoGuideCard, props))

    assert.ok(html.includes('custom-guide-wrapper-class'), 'Must forward className prop')
    // React automatically escapes HTML entities in SSR text
    assert.ok(html.includes('&lt;Link prefetch={true}&gt;'), 'Must escape title HTML tags in SSR')
    assert.ok(html.includes('&lt;Form action={...}&gt;'), 'Must escape step title HTML tags')
    assert.ok(html.includes('&lt;Action&gt;'), 'Must escape actionBadge HTML tags')
    assert.ok(!html.includes('<script>'), 'Must be injection safe')
    assert.ok(html.includes('HTTP 200 OK 수신'), 'Must preserve multiline text content')
  })

  it('5.7 Extreme Step Counts: 0 steps, 1 step, 10 steps', () => {
    // 0 steps
    const html0 = ReactDOMServer.renderToStaticMarkup(
      React.createElement(DemoGuideCard, {
        title: '0스텝',
        concept: '스텝이 비어있는 경우',
        steps: [],
      }),
    )
    assert.ok(html0.includes('<ol'), 'Must render empty ol without throwing')

    // 10 steps
    const steps10 = Array.from({ length: 10 }, (_, i) => ({
      step: i + 1,
      title: `[스텝 ${i + 1}] 실행`,
      description: `스텝 ${i + 1} 상세 설명`,
      actionBadge: `Badge ${i + 1}`,
      observe: i === 9 ? '최종 검증 완료' : undefined,
      observeAt: (i === 9 ? 'verification' : undefined) as any,
    }))

    const html10 = ReactDOMServer.renderToStaticMarkup(
      React.createElement(DemoGuideCard, {
        title: '10스텝 대량 절차',
        concept: '대량 스텝 렌더링 스트레스 테스트',
        steps: steps10,
      }),
    )

    for (let i = 1; i <= 10; i++) {
      assert.ok(html10.includes(`[스텝 ${i}] 실행`), `Must render step ${i}`)
    }
    assert.ok(html10.includes('최종 검증 완료'), 'Must render final observe')
  })

  it('5.8 Full 4-Tier Layout Integration: Semantic structure, fieldset boundaries, and dark mode classes', () => {
    const fullTree = React.createElement(
      DemoContainer,
      { className: 'space-y-6' },
      React.createElement(DemoGuideCard, {
        title: '4단 통합 테스트 데모',
        concept: '가이드, 실습, 검증, 개념정리의 4단 레이아웃 표준 규약을 검증합니다.',
        steps: [
          {
            step: 1,
            title: '[실행] 버튼 클릭',
            description: '테스트 실행',
            actionBadge: '트리거',
            observe: '검증 패널 200 OK',
            observeAt: 'verification',
          },
        ],
      }),
      React.createElement(
        DemoPlaygroundCard,
        { title: '실습 영역' },
        React.createElement('button', { type: 'button' }, '실습 버튼'),
      ),
      React.createElement(ExpectedActualPanel, {
        title: '기대값 vs 실제값 대조',
        expected: '상태 200 OK',
        actual: '상태 200 OK',
        isMatched: true,
      }),
      React.createElement(
        DemoDeepDiveCard,
        { title: '핵심 아키텍처 원리' },
        React.createElement('p', null, 'DeepDive 상세 설명'),
      ),
    )

    const html = ReactDOMServer.renderToStaticMarkup(fullTree)

    // 1. All 4 tiers must be fieldset elements
    const fieldsetMatches = html.match(/<fieldset/g) || []
    assert.strictEqual(fieldsetMatches.length, 4, 'Must render exactly 4 fieldset sections (4-tier standard)')

    // 2. Legend tags for all 4 sections
    assert.ok(html.includes('[가이드] 4단 통합 테스트 데모'), 'Tier 1 [가이드] legend must exist')
    assert.ok(html.includes('[데모 예제] 실습 영역'), 'Tier 2 [데모 예제] legend must exist')
    assert.ok(html.includes('[검증] 기대값 vs 실제값 대조'), 'Tier 3 [검증] legend must exist')
    assert.ok(html.includes('[개념 정리] 핵심 아키텍처 원리'), 'Tier 4 [개념 정리] legend must exist')

    // 3. Dark mode class support
    assert.ok(html.includes('dark:bg-zinc-950'), 'Must contain dark mode background styles')
    assert.ok(html.includes('dark:border-zinc-800'), 'Must contain dark mode border styles')
    assert.ok(html.includes('dark:text-zinc-100'), 'Must contain dark mode text styles')

    // 4. Verification panel status badge
    assert.ok(html.includes('검증 완료'), 'Must render Tier 3 verification badge')
  })
})
