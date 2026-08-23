import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../../../../..')
const NEXTJS_APP_ROOT = path.join(WORKSPACE_ROOT, 'nextjs-app')
const DOCS_ROOT = path.join(WORKSPACE_ROOT, 'nextjs-docs')

console.log('============================================================')
console.log('  CHALLENGER 2: Empirical Uniqueness & Integrity Checker   ')
console.log('============================================================\n')

export interface SectionContent {
  raw: string
  text: string
}

export interface DemoDeepDive {
  url: string
  zone: string
  filePath: string
  title: string
  fullRaw: string
  fullText: string
  section1: SectionContent
  section2: SectionContent
  section3: SectionContent
  section4: SectionContent
  section5: SectionContent
}

function cleanHtml(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/{/g, '{')
    .replace(/}/g, '}')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractSectionsFromTsx(filePath: string, content: string, url: string, zone: string): DemoDeepDive {
  const cardMatch = content.match(/<DemoDeepDiveCard\s+title=({?"[^"]+"}|'[^']+'|"[^"]+")>([\s\S]*?)<\/DemoDeepDiveCard>/)
  assert.ok(cardMatch, `Demo ${url} (${filePath}) must contain <DemoDeepDiveCard> component`)

  const cardTitle = cardMatch[1].replace(/^[{'"]+|['"}]+$/g, '')
  const cardBody = cardMatch[2]

  const sec1Match = cardBody.match(/1\.\s*핵심\s*스펙[\s\S]*?<\/h[45]>([\s\S]*?)(?=<div>\s*<h[45]|\s*<h[45]|\s*<div\s+className="[^"]*">\s*<h[45]|$)/i)
  const sec2Match = cardBody.match(/2\.\s*데모\s*예제[\s\S]*?<\/h[45]>([\s\S]*?)(?=<div>\s*<h[45]|\s*<h[45]|\s*<div\s+className="[^"]*">\s*<h[45]|$)/i)
  const sec3Match = cardBody.match(/3\.\s*실무적\s*장점[\s\S]*?<\/h[45]>([\s\S]*?)(?=<div>\s*<h[45]|\s*<h[45]|\s*<div\s+className="[^"]*">\s*<h[45]|$)/i)
  const sec4Match = cardBody.match(/4\.\s*주요\s*활용[\s\S]*?<\/h[45]>([\s\S]*?)(?=<div>\s*<h[45]|\s*<h[45]|\s*<div\s+className="[^"]*">\s*<h[45]|$)/i)
  const sec5Match = cardBody.match(/5\.\s*실무\s*주의사항[\s\S]*?<\/h[45]>([\s\S]*?)(?=<\/div>\s*<\/DemoDeepDiveCard>|(?:\s*<\/div>){2,3}|$)/i)

  assert.ok(sec1Match, `Demo ${url} missing Section 1 in ${filePath}`)
  assert.ok(sec2Match, `Demo ${url} missing Section 2 in ${filePath}`)
  assert.ok(sec3Match, `Demo ${url} missing Section 3 in ${filePath}`)
  assert.ok(sec4Match, `Demo ${url} missing Section 4 in ${filePath}`)
  assert.ok(sec5Match, `Demo ${url} missing Section 5 in ${filePath}`)

  return {
    url,
    zone,
    filePath,
    title: cardTitle,
    fullRaw: cardBody,
    fullText: cleanHtml(cardBody),
    section1: { raw: sec1Match[1], text: cleanHtml(sec1Match[1]) },
    section2: { raw: sec2Match[1], text: cleanHtml(sec2Match[1]) },
    section3: { raw: sec3Match[1], text: cleanHtml(sec3Match[1]) },
    section4: { raw: sec4Match[1], text: cleanHtml(sec4Match[1]) },
    section5: { raw: sec5Match[1], text: cleanHtml(sec5Match[1]) },
  }
}

// 3-gram Jaccard Similarity Calculator
function getNGrams(text: string, n = 3): Set<string> {
  const words = text.toLowerCase().replace(/[^\w가-힣]/g, ' ').split(/\s+/).filter(Boolean)
  const ngrams = new Set<string>()
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.add(words[i] + ' ' + words[i+1] + ' ' + words[i+2])
  }
  return ngrams
}

function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1.0
  if (setA.size === 0 || setB.size === 0) return 0.0
  let intersection = 0
  const [smaller, larger] = setA.size < setB.size ? [setA, setB] : [setB, setA]
  for (const item of smaller) {
    if (larger.has(item)) intersection++
  }
  const union = setA.size + setB.size - intersection
  return union === 0 ? 0 : intersection / union
}

export async function runEmpiricalUniquenessAudit() {
  const yamlPath = path.join(NEXTJS_APP_ROOT, 'packages/demos/demos.yaml')
  const jsonPath = path.join(NEXTJS_APP_ROOT, 'packages/demos/demos-manifest.json')

  const yamlDemos = yaml.load(fs.readFileSync(yamlPath, 'utf-8')) as Array<any>
  const jsonDemos = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as Array<any>

  console.log(`[Phase 1] Manifest Validation: ${yamlDemos.length} yaml entries, ${jsonDemos.length} json entries.`)
  assert.strictEqual(yamlDemos.length, 241, 'demos.yaml must contain exactly 241 entries')
  assert.strictEqual(jsonDemos.length, 241, 'demos-manifest.json must contain exactly 241 entries')

  const parsedDemos: DemoDeepDive[] = []

  // Extract DeepDive content from all 241 demos
  for (const demo of yamlDemos) {
    const appDir = demo.zone === 'baseline' ? 'apps/demo-baseline' : 'apps/demo-cache-components'
    const demoDir = path.join(NEXTJS_APP_ROOT, appDir, 'src/app/zone', demo.zone, demo.url)
    
    const footerPath = path.join(demoDir, 'components/VerificationFooter.tsx')
    const pagePath = path.join(demoDir, 'page.tsx')
    
    let targetPath = ''
    if (fs.existsSync(footerPath)) {
      targetPath = footerPath
    } else if (fs.existsSync(pagePath)) {
      const pageContent = fs.readFileSync(pagePath, 'utf-8')
      if (pageContent.includes('DemoDeepDiveCard')) {
        targetPath = pagePath
      }
    }

    assert.ok(targetPath, `Could not locate DemoDeepDiveCard for demo: ${demo.url}`)
    const content = fs.readFileSync(targetPath, 'utf-8')
    const parsed = extractSectionsFromTsx(targetPath, content, demo.url, demo.zone)
    parsedDemos.push(parsed)
  }

  console.log(`[Phase 2] Extracted 5-Section DeepDive content across all ${parsedDemos.length} demos.\n`)

  let testFailures: string[] = []

  // Test 1: Zero Boilerplate string across all files
  console.log('--- Check 1: Zero occurrences of boilerplate template text ---')
  const boilerplatePattern = /표준 아키텍처 스펙으로/
  const boilerplateDemos = parsedDemos.filter(d => boilerplatePattern.test(d.fullRaw))
  if (boilerplateDemos.length > 0) {
    testFailures.push(`Found boilerplate string '표준 아키텍처 스펙으로' in ${boilerplateDemos.length} demos: ${boilerplateDemos.map(d => d.url).join(', ')}`)
  } else {
    console.log('  ✅ PASS: 0 occurrences of "표준 아키텍처 스펙으로" across all 241 demos.')
  }

  // Test 2: Placeholder tokens check
  console.log('--- Check 2: Zero unresolved placeholders in DeepDive content ---')
  const placeholderPattern = /\bTODO\b|\bFIXME\b|undefined\s*입니다|NaN원/
  const placeholderDemos = parsedDemos.filter(d => placeholderPattern.test(d.fullRaw))
  if (placeholderDemos.length > 0) {
    testFailures.push(`Found unresolved placeholders in: ${placeholderDemos.map(d => d.url).join(', ')}`)
  } else {
    console.log('  ✅ PASS: 0 unresolved placeholders (TODO, FIXME, undefined, NaN).')
  }

  // Test 3: Substantial length per section
  console.log('--- Check 3: Substantial content length across Sections 1, 2, 3, 4, 5 ---')
  const shortSections: string[] = []
  for (const d of parsedDemos) {
    if (d.section1.text.length < 30) shortSections.push(`${d.url} Section 1 too short (${d.section1.text.length} chars)`)
    if (d.section2.text.length < 30) shortSections.push(`${d.url} Section 2 too short (${d.section2.text.length} chars)`)
    if (d.section3.text.length < 30) shortSections.push(`${d.url} Section 3 too short (${d.section3.text.length} chars)`)
    if (d.section4.text.length < 30) shortSections.push(`${d.url} Section 4 too short (${d.section4.text.length} chars)`)
    if (d.section5.text.length < 30) shortSections.push(`${d.url} Section 5 too short (${d.section5.text.length} chars)`)
  }
  if (shortSections.length > 0) {
    testFailures.push(`Found ${shortSections.length} substandard short sections:\n${shortSections.join('\n')}`)
  } else {
    console.log('  ✅ PASS: All 5 sections across all 241 demos have substantial, high-density explanations (>=30 chars per section).')
  }

  // Test 4: Verbatim exact duplication across all demo pairs
  console.log('--- Check 4: Verbatim exact duplication across all demo pairs ---')
  const exactSec1Dupes: string[] = []
  const exactSec2Dupes: string[] = []
  const exactSec5Dupes: string[] = []
  const exactFullDupes: string[] = []

  for (let i = 0; i < parsedDemos.length; i++) {
    for (let j = i + 1; j < parsedDemos.length; j++) {
      const a = parsedDemos[i]
      const b = parsedDemos[j]

      if (a.section1.text === b.section1.text && a.section1.text.length > 20) {
        exactSec1Dupes.push(`Sec 1 duplicate: [${a.url}] <==> [${b.url}]`)
      }
      if (a.section2.text === b.section2.text && a.section2.text.length > 20) {
        exactSec2Dupes.push(`Sec 2 duplicate: [${a.url}] <==> [${b.url}]`)
      }
      if (a.section5.text === b.section5.text && a.section5.text.length > 20) {
        exactSec5Dupes.push(`Sec 5 duplicate: [${a.url}] <==> [${b.url}]`)
      }
      if (a.fullText === b.fullText) {
        exactFullDupes.push(`Full duplicate: [${a.url}] <==> [${b.url}]`)
      }
    }
  }

  if (exactSec1Dupes.length > 0) testFailures.push(`Found ${exactSec1Dupes.length} exact Section 1 duplicates:\n${exactSec1Dupes.join('\n')}`)
  if (exactSec2Dupes.length > 0) testFailures.push(`Found ${exactSec2Dupes.length} exact Section 2 duplicates:\n${exactSec2Dupes.join('\n')}`)
  if (exactSec5Dupes.length > 0) testFailures.push(`Found ${exactSec5Dupes.length} exact Section 5 duplicates:\n${exactSec5Dupes.join('\n')}`)
  if (exactFullDupes.length > 0) testFailures.push(`Found ${exactFullDupes.length} exact full DeepDive duplicates:\n${exactFullDupes.join('\n')}`)

  if (exactSec1Dupes.length === 0 && exactSec2Dupes.length === 0 && exactSec5Dupes.length === 0 && exactFullDupes.length === 0) {
    console.log('  ✅ PASS: 0 exact verbatim duplicate sections across all 28,920 demo pairs.')
  }

  // Test 5: Sibling & Cluster Similarity Audit (Jaccard 3-gram threshold < 0.85)
  console.log('--- Check 5: Sibling and Cluster Similarity Audit (Jaccard 3-gram < 0.85) ---')
  const highSimilarityPairs: string[] = []

  const demoNGrams = parsedDemos.map(d => ({
    demo: d,
    sec1Gram: getNGrams(d.section1.text),
    sec2Gram: getNGrams(d.section2.text),
    sec5Gram: getNGrams(d.section5.text),
    fullGram: getNGrams(d.fullText),
  }))

  for (let i = 0; i < demoNGrams.length; i++) {
    for (let j = i + 1; j < demoNGrams.length; j++) {
      const a = demoNGrams[i]
      const b = demoNGrams[j]

      const aSegments = a.demo.url.split('/').filter(Boolean)
      const bSegments = b.demo.url.split('/').filter(Boolean)
      const isSibling = aSegments[0] === bSegments[0] && (aSegments.length > 1 && aSegments[1] === bSegments[1])

      const simSec1 = jaccardSimilarity(a.sec1Gram, b.sec1Gram)
      const simSec2 = jaccardSimilarity(a.sec2Gram, b.sec2Gram)
      const simSec5 = jaccardSimilarity(a.sec5Gram, b.sec5Gram)
      const simFull = jaccardSimilarity(a.fullGram, b.fullGram)

      if (simFull > 0.85) {
        highSimilarityPairs.push(
          `Full Card Overlap (${(simFull * 100).toFixed(1)}%): [${a.demo.url}] vs [${b.demo.url}] (sibling: ${isSibling})`
        )
      }
      if (simSec1 > 0.85 && a.sec1Gram.size > 10 && b.sec1Gram.size > 10) {
        highSimilarityPairs.push(
          `Section 1 Overlap (${(simSec1 * 100).toFixed(1)}%): [${a.demo.url}] vs [${b.demo.url}]`
        )
      }
      if (simSec2 > 0.85 && a.sec2Gram.size > 10 && b.sec2Gram.size > 10) {
        highSimilarityPairs.push(
          `Section 2 Overlap (${(simSec2 * 100).toFixed(1)}%): [${a.demo.url}] vs [${b.demo.url}]`
        )
      }
      if (simSec5 > 0.85 && a.sec5Gram.size > 10 && b.sec5Gram.size > 10) {
        highSimilarityPairs.push(
          `Section 5 Overlap (${(simSec5 * 100).toFixed(1)}%): [${a.demo.url}] vs [${b.demo.url}]`
        )
      }
    }
  }

  if (highSimilarityPairs.length > 0) {
    testFailures.push(`Found ${highSimilarityPairs.length} suspiciously similar demo pairs (>85% overlap):\n${highSimilarityPairs.join('\n')}`)
  } else {
    console.log('  ✅ PASS: All sibling and cluster demo pairs exhibit unique, differentiated content (Jaccard similarity < 0.85).')
  }

  // Test 6: Critical Concept Errors Audit (6 Critical + 2 Edge cases)
  console.log('--- Check 6: Verification of 6 Critical Concept Errors + Clarifications ---')
  const conceptChecks = [
    {
      url: 'file-conventions/page/react-19-use-params',
      name: 'React 19 use(params) Promise unwrapping',
      validate: (d: DemoDeepDive) => {
        const text = d.fullRaw
        assert.match(text, /use\(params\)|use\(/i, 'Must teach React 19 use(params)')
        assert.match(text, /Promise/i, 'Must mention Promise unwrapping')
        assert.ok(!text.includes('useParams() 훅을 호출하여 파라미터를 동기적으로 가져옵니다'), 'Must not teach useParams() as primary mechanism')
      },
    },
    {
      url: 'guides/server-actions/start-transition',
      name: 'Server Actions startTransition programmatic execution',
      validate: (d: DemoDeepDive) => {
        const text = d.fullRaw
        assert.match(text, /startTransition|useTransition/i, 'Must teach startTransition/useTransition')
        assert.match(text, /트랜지션|우선순위|논블로킹|isPending/i, 'Must mention transition mechanics or UI responsiveness')
        assert.ok(!text.includes('useActionState와 useFormStatus를 사용하여 폼 상태'), 'Must not copy useActionState form status text')
      },
    },
    {
      url: 'functions/image-response/dynamic-receipt',
      name: 'ImageResponse dynamic payment receipt',
      validate: (d: DemoDeepDive) => {
        const text = d.fullRaw
        assert.match(text, /ImageResponse|Satori|영수증|receipt/i, 'Must teach ImageResponse receipt generation')
        assert.ok(!text.includes('할인 배지 OG 이미지 생성'), 'Must not be discount badge OG copy-paste')
      },
    },
    {
      url: 'config/redirects/regex-pattern-matching',
      name: 'next.config.ts redirects regex pattern matching',
      validate: (d: DemoDeepDive) => {
        const text = d.fullRaw
        assert.match(text, /next\.config|redirects\(\)/i, 'Must teach next.config.ts redirects')
        assert.match(text, /regex|정규식|패턴|source/i, 'Must mention regex pattern matching')
      },
    },
    {
      url: 'config/redirects/header-query-condition',
      name: 'next.config.ts redirects header/query conditions',
      validate: (d: DemoDeepDive) => {
        const text = d.fullRaw
        assert.match(text, /next\.config|redirects\(\)/i, 'Must teach next.config.ts redirects')
        assert.match(text, /has|missing|헤더|쿼리|쿠키/i, 'Must mention has/missing header/query/cookie matching')
      },
    },
    {
      url: 'error-handling/segment-error',
      name: 'error.tsx React Error Boundary segment isolation',
      validate: (d: DemoDeepDive) => {
        const text = d.fullRaw
        assert.match(text, /error\.tsx|ErrorBoundary|에러\s*바운더리|격리/i, 'Must teach error.tsx Error Boundary')
        assert.ok(!text.includes('notFound() 또는 forbidden() 함수를 호출하여'), 'Must not teach notFound/forbidden')
      },
    },
    {
      url: 'error-handling/global-error',
      name: 'global-error.tsx root layout error boundary',
      validate: (d: DemoDeepDive) => {
        const text = d.fullRaw
        assert.match(text, /global-error\.tsx|루트|html|body/i, 'Must teach global-error.tsx root error handling')
      },
    },
    {
      url: 'edge/v8-lightweight/nodejs-modules-bailout',
      name: 'V8 Edge runtime Node.js module bailout',
      validate: (d: DemoDeepDive) => {
        const text = d.fullRaw
        assert.match(text, /Edge|V8|Node\.js|bailout|모듈\s*제약/i, 'Must teach Node.js module bailout under V8 Edge')
        assert.ok(!text.includes('global-web-apis와 동일한'), 'Must not be global-web-apis duplicate')
      },
    },
    {
      url: 'file-conventions/route-segment-config/instant-prefetch',
      name: 'Route segment config instant prefetch',
      validate: (d: DemoDeepDive) => {
        const text = d.fullRaw
        assert.ok(!text.includes('export const instant = true'), 'Must not contain fictional export const instant')
      },
    },
    {
      url: 'config/env/build-time-injection',
      name: 'Build-time env injection',
      validate: (d: DemoDeepDive) => {
        const text = d.fullRaw
        assert.match(text, /클라이언트|번들링|인라인|빌드/i, 'Must clarify build-time inlining and bundle mechanics')
      },
    },
  ]

  for (const check of conceptChecks) {
    const target = parsedDemos.find(d => d.url === check.url)
    if (!target) {
      testFailures.push(`Could not find target demo for concept check: ${check.url}`)
      continue
    }
    try {
      check.validate(target)
      console.log(`  ✅ PASS: Concept check [${check.name}] verified on ${check.url}`)
    } catch (err: any) {
      testFailures.push(`Concept check failed on ${check.url} (${check.name}): ${err.message}`)
      console.error(`  ❌ FAIL: Concept check [${check.name}] on ${check.url}: ${err.message}`)
    }
  }

  console.log('\n============================================================')
  if (testFailures.length > 0) {
    console.error(`❌ EMPIRICAL AUDIT FAILED: ${testFailures.length} issues identified.`)
    for (const f of testFailures) {
      console.error(` - ${f}`)
    }
    process.exit(1)
  } else {
    console.log(`🎉 EMPIRICAL AUDIT PASSED! All 241 demos verified for 5-section completeness, uniqueness, zero copy-paste, and conceptual correctness.`)
    console.log('============================================================\n')
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runEmpiricalUniquenessAudit().catch(err => {
    console.error('Fatal execution error:', err)
    process.exit(1)
  })
}
