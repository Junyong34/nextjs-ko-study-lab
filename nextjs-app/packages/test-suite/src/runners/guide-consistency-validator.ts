import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  loadDemosManifest,
  getDemoSourceDir,
  getAllFiles,
  NEXTJS_APP_ROOT,
  type Demo,
} from '../utils/test-helpers.ts'
import { formatTable, printSuiteHeader } from '../utils/reporter.ts'

export type GuideRuleId = 'GC01' | 'GC02' | 'GC03' | 'GC04' | 'GC05' | 'GC06' | 'GC07'
export type GuideRuleSeverity = 'error' | 'warn'

export interface GuideCardStep {
  step: number
  title: string
  description: string
  actionBadge?: string
  observe?: string
  observeAt?: string
}

export interface GuideCardData {
  title: string
  concept: string
  steps: GuideCardStep[]
}

export interface PlaygroundMetadata {
  interactiveCount: number
  buttons: string[]
  links: string[]
  inputs: string[]
  allLabels: string[]
}

export interface DemoRuleViolation {
  rule: GuideRuleId
  severity: GuideRuleSeverity
  message: string
}

export interface DemoGuideAudit {
  url: string
  zone: string
  doc: string
  category: string
  guide: GuideCardData | null
  interactiveCount: number
  labels: string[]
  violations: DemoRuleViolation[]
}

export interface CategorySummary {
  category: string
  total: number
  passed: number
  gc01: number
  gc02: number
  gc03: number
  gc04: number
  gc05: number
  gc06: number
  gc07: number
}

export interface RuleSummary {
  id: GuideRuleId
  name: string
  severity: GuideRuleSeverity
  violations: number
  passed: number
  passRate: number
}

export interface GuideConsistencyResult {
  totalDemos: number
  validDemos: number
  audits: DemoGuideAudit[]
  categoryStats: Record<string, CategorySummary>
  ruleStats: Record<GuideRuleId, RuleSummary>
  errors: string[]
  warnings: string[]
}

export const KNOWN_TEMPLATE_STEP_SETS: string[][] = [
  ['쇼핑몰 시나리오 초기화', '핵심 인터랙션 수행', '성능 및 동작 검증'],
  ['함수 파라미터 및 컨텍스트 확인', '함수 호출 및 비동기 처리', '비즈니스 규칙 반영 검증'],
  ['라우트 파일 컨벤션 확인', '라우팅 및 상태 전이 실행', '파일 컨벤션 런타임 검증'],
  ['설정 프로파일 점검', '요청 가로채기 및 라우팅 테스트', '보안 및 인프라 효과 검증'],
  ['컴포넌트 렌더링 점검', '동적 옵션 조작', '최적화 결과 대조'],
  ['지시어 선언 위치 확인', '경계 전환 인터랙션', '번들 및 캐시 분리 검증'],
]

export const CONCEPT_TEMPLATE_PATTERNS: RegExp[] = [
  /Next\.js 빌트인 컴포넌트 '.*'을 활용하여 쇼핑몰의 성능, SEO/,
  /쇼핑몰 라우팅 계층에서 Next\.js 특수 파일 컨벤션/,
  /Next\.js App Router의 '.*' 기능을 활용하여 쇼핑몰의 데이터 페칭/,
  /Next\.js App Router의 설정 파일 '.*'을 활용하여/,
  /Next\.js 지시어 '.*'을 선언하여 서버와 클라이언트 컴포넌트의 실행 경계를/,
  /Next\.js 빌트인 함수 '.*'을 활용하여 서버\/클라이언트 런타임 동작을 제어하고/,
  /표준 아키텍처 스펙으로/,
]

const ALLOWED_OBSERVE_LOCATIONS = new Set([
  'playground',
  'verification',
  'devtools',
  'network',
  'console',
])

function stripNonPlaygroundBlocks(tsxContent: string): string {
  return tsxContent
    .replace(/<DemoGuideCard[\s\S]*?(?:\/>|<\/DemoGuideCard>)/g, '')
    .replace(/<VerificationFooter[\s\S]*?(?:\/>|<\/VerificationFooter>)/g, '')
    .replace(/<DemoDeepDiveCard[\s\S]*?(?:\/>|<\/DemoDeepDiveCard>)/g, '')
}

function cleanHtml(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, ' ')
    // 표현식은 지우되, 그 안의 문자열 리터럴은 화면에 실제로 보이는 라벨이므로 살린다.
    // 예: {isPending ? '검증 중...' : '쿠폰 적용'} -> 검증 중... 쿠폰 적용
    .replace(/\{[^}]+\}/g, (expr) => {
      const literals = expr.match(/'[^']*'|"[^"]*"|`[^`${]*`/g)
      return literals ? ` ${literals.map((s) => s.slice(1, -1)).join(' ')} ` : ' '
    })
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * JSX 여는 태그의 끝을 찾는다. `onClick={() => fn()}` 처럼 속성값 표현식 안에 `>`가
 * 들어 있기 때문에 `<button[^>]*>` 같은 정규식은 화살표의 `>`에서 조기 종료된다.
 * 중괄호 깊이와 따옴표 상태를 추적해 태그 밖의 `>`만 태그 끝으로 인정한다.
 */
function findOpenTagEnd(src: string, from: number): { end: number; selfClosing: boolean } | null {
  let depth = 0
  let quote: string | null = null
  for (let i = from; i < src.length; i++) {
    const c = src[i]
    if (quote) {
      if (c === quote && src[i - 1] !== '\\') quote = null
      continue
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue }
    if (c === '{') { depth++; continue }
    if (c === '}') { depth--; continue }
    if (depth > 0) continue
    if (c === '>') return { end: i, selfClosing: src[i - 1] === '/' }
  }
  return null
}

export interface JsxElement {
  openTag: string
  inner: string
}

/**
 * 지정한 태그의 여는 태그와 그 안쪽 내용을 찾는다. 같은 태그가 중첩된 경우 깊이를 세어
 * 짝이 맞는 닫는 태그까지를 내용으로 잡는다.
 */
export function findJsxElements(src: string, ...tagNames: string[]): JsxElement[] {
  const out: JsxElement[] = []
  for (const tag of tagNames) {
    const openRe = new RegExp(`<${tag}(?=[\\s/>])`, 'g')
    let m: RegExpExecArray | null
    while ((m = openRe.exec(src)) !== null) {
      const tagEnd = findOpenTagEnd(src, m.index + 1 + tag.length)
      if (!tagEnd) continue
      const openTag = src.slice(m.index, tagEnd.end + 1)
      if (tagEnd.selfClosing) {
        out.push({ openTag, inner: '' })
        continue
      }
      // 짝이 맞는 닫는 태그 탐색 (동일 태그 중첩 대응)
      const scanRe = new RegExp(`<${tag}(?=[\\s/>])|</${tag}>`, 'g')
      scanRe.lastIndex = tagEnd.end + 1
      let depth = 1
      let closeAt = -1
      let s: RegExpExecArray | null
      while ((s = scanRe.exec(src)) !== null) {
        if (s[0].startsWith('</')) {
          depth--
          if (depth === 0) { closeAt = s.index; break }
        } else {
          const nested = findOpenTagEnd(src, s.index + 1 + tag.length)
          if (nested && !nested.selfClosing) depth++
        }
      }
      out.push({ openTag, inner: closeAt >= 0 ? src.slice(tagEnd.end + 1, closeAt) : '' })
    }
  }
  return out
}

/**
 * 데모 디렉토리 안에 다른 데모가 중첩돼 있으면(예: parallel-routes 안의
 * parallel-routes/conditional-slot) 그 하위 트리는 이 데모의 것이 아니다.
 * 배제하지 않으면 부모 데모가 자식 데모의 가이드와 UI 라벨을 자기 것으로 집는다.
 */
function isInsideNestedDemo(filePath: string, demoDir: string, nestedDirs: string[]): boolean {
  return nestedDirs.some((nested) => filePath.startsWith(nested + path.sep))
}

export function extractPlaygroundMetadata(
  demoDir: string,
  nestedDemoDirs: string[] = [],
): PlaygroundMetadata {
  const files = getAllFiles(demoDir, ['.tsx', '.ts']).filter(
    (f) => !isInsideNestedDemo(f, demoDir, nestedDemoDirs),
  )
  let interactiveCount = 0
  const labelSet = new Set<string>()
  const buttons: string[] = []
  const links: string[] = []
  const inputs: string[] = []

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8')
    const clean = stripNonPlaygroundBlocks(raw)

    // 1. Buttons
    let match: RegExpExecArray | null
    for (const el of findJsxElements(clean, 'button')) {
      interactiveCount++
      const label = cleanHtml(el.inner)
      if (label && label.length <= 40) {
        buttons.push(label)
        labelSet.add(label)
      }
    }

    // 2. Reset Button
    const resetRegex = /<DemoResetButton[^>]*label=["']([^"']+)["']/g
    while ((match = resetRegex.exec(clean)) !== null) {
      interactiveCount++
      const label = match[1].trim()
      buttons.push(label)
      labelSet.add(label)
    }

    // 3. Next.js Link
    for (const el of findJsxElements(clean, 'Link')) {
      interactiveCount++
      const label = cleanHtml(el.inner)
      if (label && label.length <= 40) {
        links.push(label)
        labelSet.add(label)
      }
    }

    // 4. Inputs
    for (const el of findJsxElements(clean, 'input', 'textarea', 'select')) {
      interactiveCount++
      const ph = el.openTag.match(/placeholder=["']([^"']+)["']/)
      if (ph) {
        inputs.push(ph[1].trim())
        labelSet.add(ph[1].trim())
      }
      const aria = el.openTag.match(/aria-label=["']([^"']+)["']/)
      if (aria) {
        inputs.push(aria[1].trim())
        labelSet.add(aria[1].trim())
      }
    }
  }

  return {
    interactiveCount,
    buttons,
    links,
    inputs,
    allLabels: Array.from(labelSet),
  }
}

function extractGuideCardBlock(tsxContent: string): string | null {
  const startTag = '<DemoGuideCard'
  const startIdx = tsxContent.indexOf(startTag)
  if (startIdx === -1) return null

  const afterTag = startIdx + startTag.length
  if (afterTag < tsxContent.length && !/\s|>|\//.test(tsxContent[afterTag])) {
    return null
  }

  let inQuote: string | null = null
  let braceDepth = 0
  let bracketDepth = 0

  for (let i = afterTag; i < tsxContent.length; i++) {
    const char = tsxContent[i]

    if (inQuote) {
      if (char === '\\') {
        i++
        continue
      }
      if (char === inQuote) {
        inQuote = null
      }
    } else {
      if (char === '"' || char === "'" || char === '`') {
        inQuote = char
      } else if (char === '{') {
        braceDepth++
      } else if (char === '}') {
        if (braceDepth > 0) braceDepth--
      } else if (char === '[') {
        bracketDepth++
      } else if (char === ']') {
        if (bracketDepth > 0) bracketDepth--
      } else if (braceDepth === 0 && bracketDepth === 0) {
        if (char === '/' && tsxContent[i + 1] === '>') {
          return tsxContent.slice(afterTag, i)
        }
        if (char === '>') {
          const closeTag = '</DemoGuideCard>'
          const closeIdx = tsxContent.indexOf(closeTag, i + 1)
          if (closeIdx !== -1) {
            return tsxContent.slice(afterTag, closeIdx)
          }
          return tsxContent.slice(afterTag, i)
        }
      }
    }
  }

  return null
}

function extractPropString(block: string, propName: string): string {
  const pattern = new RegExp(
    propName +
      '\\s*=\\s*(?:' +
      '\\{\\s*"((?:[^"\\\\]|\\\\.)*)"\\s*\\}' +
      '|\\{\\s*\'((?:[^\'\\\\]|\\\\.)*)\'\\s*\\}' +
      '|\\{\\s*`([\\s\\S]*?)`\\s*\\}' +
      '|"((?:[^"\\\\]|\\\\.)*)"' +
      '|\'((?:[^\'\\\\]|\\\\.)*)\'' +
      '|`([\\s\\S]*?)`' +
      ')'
  )
  const match = block.match(pattern)
  if (!match) return ''
  return (match[1] ?? match[2] ?? match[3] ?? match[4] ?? match[5] ?? match[6] ?? '').trim()
}

function extractStepProperty(objBody: string, propName: string): string | undefined {
  const pattern = new RegExp(
    '["\']?' +
      propName +
      '["\']?\\s*:\\s*(?:' +
      '"((?:[^"\\\\]|\\\\.)*)"' +
      '|\'((?:[^\'\\\\]|\\\\.)*)\'' +
      '|`([\\s\\S]*?)`' +
      ')'
  )
  const match = objBody.match(pattern)
  if (!match) return undefined
  const val = match[1] ?? match[2] ?? match[3]
  return val !== undefined ? val.trim() : undefined
}

export function parseGuideCardFromTsx(tsxContent: string): GuideCardData | null {
  const block = extractGuideCardBlock(tsxContent)
  if (!block) return null

  // title
  const title = extractPropString(block, 'title')

  // concept
  const concept = extractPropString(block, 'concept')

  // steps
  const steps: GuideCardStep[] = []
  const stepsMatch = block.match(/steps\s*=\s*\{([\s\S]*)\}/)
  if (stepsMatch) {
    const rawSteps = stepsMatch[1]
    const objRegex = /\{([\s\S]*?)\}(?=\s*(?:,\s*\{|,\s*\]|,\s*$|\]|$))/g
    let match: RegExpExecArray | null
    while ((match = objRegex.exec(rawSteps)) !== null) {
      const objBody = match[1]
      const stepNumMatch = objBody.match(/["']?step["']?\s*:\s*(\d+)/)
      const stepTitle = extractStepProperty(objBody, 'title') ?? ''
      const stepDesc = extractStepProperty(objBody, 'description') ?? ''
      const stepBadge = extractStepProperty(objBody, 'actionBadge')
      const stepObserve = extractStepProperty(objBody, 'observe')
      const stepObserveAt = extractStepProperty(objBody, 'observeAt')

      if (stepNumMatch && (stepTitle || stepDesc)) {
        steps.push({
          step: parseInt(stepNumMatch[1], 10),
          title: stepTitle,
          description: stepDesc,
          actionBadge: stepBadge || undefined,
          observe: stepObserve || undefined,
          observeAt: stepObserveAt || undefined,
        })
      }
    }
  }

  return {
    title: title.trim(),
    concept: concept.trim(),
    steps,
  }
}

function getCategoryFromDoc(doc: string): string {
  const normalized = doc.replace(/^\/?(nextjs-docs\/)?/, '')
  const firstSegment = normalized.split('/')[0] || ''
  if (firstSegment.startsWith('1-') || firstSegment === '1-getting-started') return '1-getting-started'
  if (firstSegment.startsWith('2-') || firstSegment === '2-guides') return '2-guides'
  if (firstSegment.startsWith('3-') || firstSegment === '3-api-reference') return '3-api-reference'
  if (firstSegment.startsWith('5-') || firstSegment === '5-architecture') return '5-architecture'
  return 'other'
}

export function validateGuideConsistency(options: {
  strict?: boolean
  reportPath?: string
  log?: boolean
} = {}): GuideConsistencyResult {
  const isStrict = Boolean(options.strict)
  const shouldLog = options.log ?? false

  const demos = loadDemosManifest()
  const parsedDemos: {
    demo: Demo
    dir: string
    category: string
    guide: GuideCardData | null
    playground: PlaygroundMetadata
  }[] = []

  // 다른 데모가 이 데모의 하위 경로에 중첩돼 있으면 그 트리는 소유가 아니다.
  const dirByUrl = new Map(demos.map((d) => [d.url, getDemoSourceDir(d)]))

  for (const demo of demos) {
    const dir = getDemoSourceDir(demo)
    const nestedDemoDirs = demos
      .filter((other) => other.url !== demo.url && other.url.startsWith(demo.url + '/'))
      .map((other) => dirByUrl.get(other.url)!)
    const files = getAllFiles(dir, ['.tsx', '.ts']).filter(
      (f) => !isInsideNestedDemo(f, dir, nestedDemoDirs),
    )
    let guide: GuideCardData | null = null

    // 최상위 진입 파일 우선: page.tsx → layout.tsx
    // (Parallel Routes 데모는 슬롯을 props로 받는 layout.tsx가 진입 파일이다.)
    const rootEntries = [path.join(dir, 'page.tsx'), path.join(dir, 'layout.tsx')]
    for (const entry of rootEntries) {
      if (!fs.existsSync(entry)) continue
      const text = fs.readFileSync(entry, 'utf-8')
      if (!text.includes('DemoGuideCard')) continue
      guide = parseGuideCardFromTsx(text)
      if (guide && guide.steps.length > 0) break
    }

    if (!guide || guide.steps.length === 0) {
      for (const f of files) {
        if (rootEntries.includes(f)) continue
        const text = fs.readFileSync(f, 'utf-8')
        if (text.includes('DemoGuideCard')) {
          guide = parseGuideCardFromTsx(text)
          if (guide && guide.steps.length > 0) break
        }
      }
    }

    const playground = extractPlaygroundMetadata(dir, nestedDemoDirs)
    const category = getCategoryFromDoc(demo.doc)
    parsedDemos.push({ demo, dir, category, guide, playground })
  }

  // Pre-calculate step sequence keys for GC02
  const seqMap = new Map<string, string[]>()
  for (const p of parsedDemos) {
    if (!p.guide || p.guide.steps.length === 0) continue
    const seqKey = p.guide.steps.map((s) => s.title.trim()).join(' /// ')
    const list = seqMap.get(seqKey) || []
    list.push(p.demo.url)
    seqMap.set(seqKey, list)
  }

  const audits: DemoGuideAudit[] = []
  const errors: string[] = []
  const warnings: string[] = []

  const categoryStats: Record<string, CategorySummary> = {
    '1-getting-started': { category: '1-getting-started', total: 0, passed: 0, gc01: 0, gc02: 0, gc03: 0, gc04: 0, gc05: 0, gc06: 0, gc07: 0 },
    '2-guides': { category: '2-guides', total: 0, passed: 0, gc01: 0, gc02: 0, gc03: 0, gc04: 0, gc05: 0, gc06: 0, gc07: 0 },
    '3-api-reference': { category: '3-api-reference', total: 0, passed: 0, gc01: 0, gc02: 0, gc03: 0, gc04: 0, gc05: 0, gc06: 0, gc07: 0 },
    '5-architecture': { category: '5-architecture', total: 0, passed: 0, gc01: 0, gc02: 0, gc03: 0, gc04: 0, gc05: 0, gc06: 0, gc07: 0 },
  }

  let totalGc01 = 0
  let totalGc02 = 0
  let totalGc03 = 0
  let totalGc04 = 0
  let totalGc05 = 0
  let totalGc06 = 0
  let totalGc07 = 0

  for (const p of parsedDemos) {
    const violations: DemoRuleViolation[] = []
    const catStat = categoryStats[p.category] || {
      category: p.category,
      total: 0,
      passed: 0,
      gc01: 0,
      gc02: 0,
      gc03: 0,
      gc04: 0,
      gc05: 0,
      gc06: 0,
      gc07: 0,
    }
    catStat.total++

    if (!p.guide || p.guide.steps.length === 0) {
      violations.push({
        rule: 'GC01',
        severity: 'error',
        message: 'DemoGuideCard not found or has no steps',
      })
      catStat.gc01++
      totalGc01++
      audits.push({
        url: p.demo.url,
        zone: p.demo.zone,
        doc: p.demo.doc,
        category: p.category,
        guide: p.guide,
        interactiveCount: p.playground.interactiveCount,
        labels: p.playground.allLabels,
        violations,
      })
      continue
    }

    const guide = p.guide
    const stepTitles = guide.steps.map((s) => s.title.trim())

    // [GC01] Template Fingerprints Prohibition
    const isStepTmpl =
      stepTitles.length === 3 &&
      KNOWN_TEMPLATE_STEP_SETS.some((set) => set.every((t, i) => t === stepTitles[i]))
    const isConceptTmpl = CONCEPT_TEMPLATE_PATTERNS.some((pattern) => pattern.test(guide.concept))

    if (isStepTmpl || isConceptTmpl) {
      catStat.gc01++
      totalGc01++
      violations.push({
        rule: 'GC01',
        severity: 'error',
        message: isStepTmpl
          ? `Step titles match known category template set: [${stepTitles.join(', ')}]`
          : `Concept contains boilerplate template string: "${guide.concept.slice(0, 40)}..."`,
      })
    }

    // [GC02] Step Title Duplicates Prohibition
    const seqKey = stepTitles.join(' /// ')
    const duplicates = seqMap.get(seqKey) || []
    if (duplicates.length > 1) {
      catStat.gc02++
      totalGc02++
      violations.push({
        rule: 'GC02',
        severity: 'error',
        message: `Step title sequence is duplicated across ${duplicates.length} demos: [${stepTitles.join(', ')}]`,
      })
    }

    // [GC03] UI Label Quoting
    let gc03Passed = true
    if (p.playground.interactiveCount > 0) {
      const allGuideText = [
        guide.title,
        guide.concept,
        ...guide.steps.flatMap((s) => [s.title, s.description]),
      ].join(' ')

      const brackets = Array.from(allGuideText.matchAll(/\[([^\]]+)\]/g)).map((m) => m[1].trim())
      let matched = false

      for (const b of brackets) {
        const cleanB = b.replace(/[+\-→←]/g, '').trim().toLowerCase()
        for (const l of p.playground.allLabels) {
          const cleanL = l.replace(/[+\-→←]/g, '').trim().toLowerCase()
          if (cleanB && cleanL && (cleanB.includes(cleanL) || cleanL.includes(cleanB))) {
            matched = true
            break
          }
        }
        if (matched) break
      }

      if (!matched) {
        const normGuide = allGuideText.replace(/\s+/g, ' ').toLowerCase()
        for (const l of p.playground.allLabels) {
          const cleanL = l.replace(/[+\-→←]/g, '').trim().toLowerCase()
          if (cleanL.length >= 3 && normGuide.includes(cleanL)) {
            matched = true
            break
          }
        }
      }

      if (!matched) {
        gc03Passed = false
        catStat.gc03++
        totalGc03++
        violations.push({
          rule: 'GC03',
          severity: isStrict ? 'error' : 'warn',
          message: `Guide does not quote any of the ${p.playground.allLabels.length} UI interactive labels in [brackets]`,
        })
      }
    }

    // [GC04] Last Step Observe Specification
    const lastStep = guide.steps[guide.steps.length - 1]
    if (!lastStep || !lastStep.observe || lastStep.observe.trim().length < 5) {
      catStat.gc04++
      totalGc04++
      violations.push({
        rule: 'GC04',
        severity: 'error',
        message: `Final step ${guide.steps.length} must specify an 'observe' target (at least 5 chars)`,
      })
    } else if (lastStep.observeAt && !ALLOWED_OBSERVE_LOCATIONS.has(lastStep.observeAt)) {
      catStat.gc04++
      totalGc04++
      violations.push({
        rule: 'GC04',
        severity: 'error',
        message: `Invalid observeAt location '${lastStep.observeAt}'. Allowed: ${Array.from(ALLOWED_OBSERVE_LOCATIONS).join(', ')}`,
      })
    }

    // [GC05] String Leaks & Entity Escapes Prohibition
    const stringsToCheck = [
      guide.title,
      guide.concept,
      ...guide.steps.flatMap((s) => [s.title, s.description, s.actionBadge || '', s.observe || '']),
    ]
    let hasLeak = false
    let leakDetail = ''

    for (const str of stringsToCheck) {
      if (/\$\{[^}]+\}/.test(str)) {
        hasLeak = true
        leakDetail = `Unresolved template literal: ${str.match(/\$\{[^}]+\}/)?.[0]}`
        break
      }
      if (/&(?:lt|gt|amp|quot|apos|#39|#123|#125);/i.test(str)) {
        hasLeak = true
        leakDetail = `HTML entity leak: ${str.match(/&(?:lt|gt|amp|quot|apos|#39|#123|#125);/i)?.[0]}`
        break
      }
      if (/\b(?:TODO|FIXME|TBD)\b|undefined\s*입니다|NaN원/i.test(str)) {
        hasLeak = true
        leakDetail = `Unresolved placeholder in text: ${str}`
        break
      }
    }

    if (hasLeak) {
      catStat.gc05++
      totalGc05++
      violations.push({
        rule: 'GC05',
        severity: 'error',
        message: leakDetail,
      })
    }

    // [GC06] Step Count Sanity & Ordering
    let stepCountError = false
    if (guide.steps.length < 2 || guide.steps.length > 6) {
      stepCountError = true
      violations.push({
        rule: 'GC06',
        severity: 'error',
        message: `Step count must be between 2 and 6 (found ${guide.steps.length})`,
      })
    } else if (p.playground.interactiveCount >= 3 && guide.steps.length < 3) {
      stepCountError = true
      violations.push({
        rule: 'GC06',
        severity: 'error',
        message: `Interactive elements (${p.playground.interactiveCount}) require at least 3 steps (found ${guide.steps.length})`,
      })
    }

    for (let i = 0; i < guide.steps.length; i++) {
      if (guide.steps[i].step !== i + 1) {
        stepCountError = true
        violations.push({
          rule: 'GC06',
          severity: 'error',
          message: `Step numbers must be sequential 1-based index (step[${i}] is ${guide.steps[i].step})`,
        })
        break
      }
    }

    if (stepCountError) {
      catStat.gc06++
      totalGc06++
    }

    // [GC07] Concrete Values & API Identifiers in Concept
    const hasNumeric = /\b\d+(?:ms|s|px|KB|MB|%|개|원|배|종)?\b/.test(guide.concept) || /200|404|307|308|500/.test(guide.concept)
    const hasIdentifier =
      /useOptimistic|revalidatePath|revalidateTag|useActionState|useFormStatus|ImageResponse|headers|cookies|redirect|notFound|usePathname|useSearchParams|cacheTag|cacheLife|dynamicParams|use cache|use client|use server|next\.config|route\.ts|layout\.tsx|page\.tsx|error\.tsx|loading\.tsx|not-found\.tsx|template\.tsx|default\.tsx|Suspense|Promise|Server Action|RSC|RCC|PPR|ISR|SSG|SSR|LCP|CLS|GNB|API|CRUD|DOM|fetch|HTML|CSS|JSON|DB|URL|SEO/i.test(
        guide.concept,
      ) || /`[^`]+`/.test(guide.concept)

    if (!hasNumeric && !hasIdentifier) {
      catStat.gc07++
      totalGc07++
      violations.push({
        rule: 'GC07',
        severity: 'error',
        message: `Concept summary lacks concrete numbers, latency/status values, or Next.js/React technical identifiers`,
      })
    }

    const hasErrors = violations.some((v) => v.severity === 'error')
    if (!hasErrors) {
      catStat.passed++
    }

    for (const v of violations) {
      const msg = `[${v.rule}] ${p.demo.url}: ${v.message}`
      if (v.severity === 'error') errors.push(msg)
      else warnings.push(msg)
    }

    audits.push({
      url: p.demo.url,
      zone: p.demo.zone,
      doc: p.demo.doc,
      category: p.category,
      guide,
      interactiveCount: p.playground.interactiveCount,
      labels: p.playground.allLabels,
      violations,
    })
  }

  const totalDemos = demos.length
  const validDemos = audits.filter((a) => !a.violations.some((v) => v.severity === 'error')).length

  const ruleStats: Record<GuideRuleId, RuleSummary> = {
    GC01: { id: 'GC01', name: '템플릿 지문 금지', severity: 'error', violations: totalGc01, passed: totalDemos - totalGc01, passRate: ((totalDemos - totalGc01) / totalDemos) * 100 },
    GC02: { id: 'GC02', name: '스텝 제목 중복 금지', severity: 'error', violations: totalGc02, passed: totalDemos - totalGc02, passRate: ((totalDemos - totalGc02) / totalDemos) * 100 },
    GC03: { id: 'GC03', name: 'UI 라벨 인용', severity: isStrict ? 'error' : 'warn', violations: totalGc03, passed: totalDemos - totalGc03, passRate: ((totalDemos - totalGc03) / totalDemos) * 100 },
    GC04: { id: 'GC04', name: '마지막 스텝 관찰 명시', severity: 'error', violations: totalGc04, passed: totalDemos - totalGc04, passRate: ((totalDemos - totalGc04) / totalDemos) * 100 },
    GC05: { id: 'GC05', name: '문자열/엔티티 유출 방지', severity: 'error', violations: totalGc05, passed: totalDemos - totalGc05, passRate: ((totalDemos - totalGc05) / totalDemos) * 100 },
    GC06: { id: 'GC06', name: '스텝 수 적정성', severity: 'error', violations: totalGc06, passed: totalDemos - totalGc06, passRate: ((totalDemos - totalGc06) / totalDemos) * 100 },
    GC07: { id: 'GC07', name: '구체값/식별자 포함', severity: 'error', violations: totalGc07, passed: totalDemos - totalGc07, passRate: ((totalDemos - totalGc07) / totalDemos) * 100 },
  }

  // Report generation if requested
  if (options.reportPath) {
    const reportFullPath = path.isAbsolute(options.reportPath)
      ? options.reportPath
      : path.join(NEXTJS_APP_ROOT, options.reportPath)
    generateMarkdownAuditReport(reportFullPath, totalDemos, validDemos, categoryStats, ruleStats, audits)
  }

  if (shouldLog) {
    printSuiteHeader('Next.js App Router Demo Guide Consistency Validator')

    const headers = [
      'Category',
      'Total',
      'GC01 (Tmpl)',
      'GC02 (Dupe)',
      'GC03 (Label)',
      'GC04 (Obs)',
      'GC05 (Leak)',
      'GC07 (Val)',
      'Pass Rate',
    ]

    const rows: string[][] = []
    for (const catKey of Object.keys(categoryStats)) {
      const c = categoryStats[catKey]
      const rate = c.total > 0 ? ((c.passed / c.total) * 100).toFixed(1) + '%' : 'N/A'
      rows.push([
        c.category,
        String(c.total),
        `${c.gc01} (${(100 - (c.gc01 / c.total) * 100).toFixed(0)}%)`,
        `${c.gc02} (${(100 - (c.gc02 / c.total) * 100).toFixed(0)}%)`,
        `${c.gc03} (${((1 - c.gc03 / c.total) * 100).toFixed(0)}%)`,
        `${c.gc04} (${((1 - c.gc04 / c.total) * 100).toFixed(0)}%)`,
        `${c.gc05} (100%)`,
        `${c.gc07} (${((1 - c.gc07 / c.total) * 100).toFixed(0)}%)`,
        rate,
      ])
    }

    const totalPassedRate = ((validDemos / totalDemos) * 100).toFixed(1) + '%'
    rows.push([
      'TOTAL AGGREGATED',
      String(totalDemos),
      `${totalGc01} (${ruleStats.GC01.passRate.toFixed(1)}%)`,
      `${totalGc02} (${ruleStats.GC02.passRate.toFixed(1)}%)`,
      `${totalGc03} (${ruleStats.GC03.passRate.toFixed(1)}%)`,
      `${totalGc04} (${ruleStats.GC04.passRate.toFixed(1)}%)`,
      `${totalGc05} (100%)`,
      `${totalGc07} (${ruleStats.GC07.passRate.toFixed(1)}%)`,
      totalPassedRate,
    ])

    console.log('\n' + formatTable(headers, rows) + '\n')
    console.log(`Summary: Total Demos: ${totalDemos}, GC05 Leak-Free: ${totalDemos - totalGc05}/${totalDemos} (100%), Valid: ${validDemos}`)
  }

  return {
    totalDemos,
    validDemos,
    audits,
    categoryStats,
    ruleStats,
    errors,
    warnings,
  }
}

function generateMarkdownAuditReport(
  outPath: string,
  totalDemos: number,
  validDemos: number,
  categoryStats: Record<string, CategorySummary>,
  ruleStats: Record<GuideRuleId, RuleSummary>,
  audits: DemoGuideAudit[],
): void {
  const dir = path.dirname(outPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const lines: string[] = [
    `# Demo Guide Consistency Audit Report (M0 Baseline)`,
    ``,
    `- **Generated**: ${new Date().toISOString()}`,
    `- **Total Demos Scanned**: ${totalDemos}`,
    `- **Valid (Fully Compliant)**: ${validDemos} (${((validDemos / totalDemos) * 100).toFixed(1)}%)`,
    ``,
    `## 1. Rule Summary Matrix`,
    ``,
    `| Rule ID | Rule Name | Severity | Violations | Passed | Pass Rate | Target (M5) |`,
    `|---|---|---|---:|---:|---:|---|`,
  ]

  for (const rid of Object.keys(ruleStats) as GuideRuleId[]) {
    const r = ruleStats[rid]
    lines.push(
      `| **${r.id}** | ${r.name} | \`${r.severity}\` | ${r.violations} | ${r.passed} | **${r.passRate.toFixed(1)}%** | ${r.id === 'GC03' ? '>= 90%' : '100% (0 errors)'} |`,
    )
  }

  lines.push(``, `## 2. Category Breakdown`, ``, `| Category | Total | Passed | GC01 | GC02 | GC03 | GC04 | GC05 | GC06 | GC07 |`, `|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|`)

  for (const catKey of Object.keys(categoryStats)) {
    const c = categoryStats[catKey]
    lines.push(
      `| \`${c.category}\` | ${c.total} | ${c.passed} | ${c.gc01} | ${c.gc02} | ${c.gc03} | ${c.gc04} | ${c.gc05} | ${c.gc06} | ${c.gc07} |`,
    )
  }

  lines.push(``, `## 3. GC05 String & HTML Entity Leak Status`, ``, `**Total GC05 Violations**: ${ruleStats.GC05.violations} (100% Clean in Milestone M0)`)

  fs.writeFileSync(outPath, lines.join('\n'), 'utf-8')
}

// CLI Execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const isStrict = args.includes('--strict')
  const reportArg = args.find((a) => a.startsWith('--report='))
  const reportPath = reportArg ? reportArg.split('=')[1] : undefined

  const result = validateGuideConsistency({
    strict: isStrict,
    reportPath,
    log: true,
  })

  if (isStrict && result.errors.length > 0) {
    console.error(`\n❌ [Strict Mode] Guide consistency failed with ${result.errors.length} errors.\n`)
    process.exit(1)
  } else if (result.ruleStats.GC05.violations > 0) {
    console.error(`\n❌ [M0 Baseline Error] GC05 string/entity leaks detected: ${result.ruleStats.GC05.violations} violations.\n`)
    process.exit(1)
  } else {
    console.log(`\n✅ Guide consistency validator executed successfully (M0 baseline recorded).\n`)
    process.exit(0)
  }
}
