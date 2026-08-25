import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  NEXTJS_APP_ROOT,
  loadDemosManifest,
  getDemoSourceDir,
  getAllFiles,
  type Demo,
} from '../utils/test-helpers.ts'
import { parseGuideCardFromTsx } from './guide-consistency-validator.ts'

const __filename = fileURLToPath(import.meta.url)

export interface M3DemoAuditDetail {
  id: string
  url: string
  zone: string
  doc: string
  guideFile: string
  stepsCount: number
  quotedTokens: string[]
  extractedUiLabels: string[]
  extractedTernaries: { raw: string; pendingBranch: string; idleBranch: string }[]
  concatenatedLabels: string[]
  missingOrMismatchedLabels: string[]
  missingObserve: boolean
  observeTarget: string
  observeAt?: string
  leaks: string[]
  status: 'PASS' | 'WARN' | 'FAIL'
  issues: string[]
}

export function getM3Demos(manifest: Demo[]) {
  const m2Docs = [
    '3-api-reference/3.1-file-conventions',
    '3-api-reference/3.2-components',
    '3-api-reference/3.4-directives',
  ]
  // 75 M3 demos: non-M2 3-api-reference plus edge, functions, config
  return manifest.filter(d => {
    const doc = d.doc || ''
    if (m2Docs.some(m2 => doc.startsWith(m2))) {
      // Except if it's runtime/server-runtime in M3 scope or proxy in file-conventions
      if (d.url === 'functions/server-runtime/edge-vs-nodejs') return true
      return false
    }
    if (doc.startsWith('3-api-reference')) return true
    if (doc === '2-guides/css-in-js.md' && d.url.startsWith('functions/')) return true
    return false
  })
}

// Helper to extract button labels, input placeholders, tabs, and ternaries from JSX/TSX
function extractInteractiveUiElements(content: string) {
  const labels = new Set<string>()
  const ternaries: { raw: string; pendingBranch: string; idleBranch: string }[] = []

  // Extract ternary strings: e.g. {isLoading ? '로딩 중...' : '데이터 가져오기'}
  const ternaryRegex = /\{(?:\w+\s*\?\s*['"`]([^'"`]+)['"`]\s*:\s*['"`]([^'"`]+)['"`])\}/g
  let match
  while ((match = ternaryRegex.exec(content)) !== null) {
    const [raw, branch1, branch2] = match
    ternaries.push({ raw, pendingBranch: branch1.trim(), idleBranch: branch2.trim() })
    labels.add(branch1.trim())
    labels.add(branch2.trim())
  }

  // Extract <button ...>text</button>
  const buttonRegex = /<button[^>]*>([\s\S]*?)<\/button>/gi
  while ((match = buttonRegex.exec(content)) !== null) {
    const rawInner = match[1]
    // Clean JSX braces and tags
    const cleaned = rawInner
      .replace(/<[^>]+>/g, '')
      .replace(/\{[^}]*\?[^:]*:\s*['"`]([^'"`]+)['"`]\}/g, '$1') // replace ternary with branch2
      .replace(/\{['"`]([^'"`]+)['"`]\}/g, '$1')
      .replace(/\{[^}]+\}/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (cleaned && cleaned.length < 50) {
      labels.add(cleaned)
    }
  }

  // Extract placeholders: placeholder="..."
  const placeholderRegex = /placeholder\s*=\s*["']([^"']+)["']/gi
  while ((match = placeholderRegex.exec(content)) !== null) {
    const val = match[1].trim()
    if (val) labels.add(val)
  }

  // Extract input values or labels: value="..."
  const valueRegex = /value\s*=\s*["']([^"']+)["']/gi
  while ((match = valueRegex.exec(content)) !== null) {
    const val = match[1].trim()
    if (val && val.length < 30) labels.add(val)
  }

  // Extract Tab / Option names in arrays, e.g. ['tab1', 'tab2'] or labels
  const tabArrayRegex = /\[\s*(['"`][^'"`]+['"`](?:\s*,\s*['"`][^'"`]+['"`])*)\]/g
  while ((match = tabArrayRegex.exec(content)) !== null) {
    const items = match[1].split(',').map(s => s.replace(/['"`\s]/g, '').trim())
    items.forEach(it => {
      if (it && it.length < 40 && !it.includes('/') && !it.includes('http')) {
        labels.add(it)
      }
    })
  }

  // Extract labels: label: '...' or label="..."
  const labelPropRegex = /label\s*[:=]\s*["']([^"']+)["']/gi
  while ((match = labelPropRegex.exec(content)) !== null) {
    const val = match[1].trim()
    if (val && val.length < 40) labels.add(val)
  }

  // Extract text in headings or bold or span inside interactive components
  const textElemRegex = /<(?:span|strong|p|h\d|div)[^>]*class(?:Name)?=["'][^"']*(?:font-|text-|badge|tab|pill|btn)[^"']*["'][^>]*>([^<]+)<\/(?:span|strong|p|h\d|div)>/gi
  while ((match = textElemRegex.exec(content)) !== null) {
    const val = match[1].trim()
    if (val && val.length < 40 && !val.includes('{')) {
      labels.add(val)
    }
  }

  return { labels: Array.from(labels), ternaries }
}

export function runM3AdversarialUiLabelsAudit() {
  console.log('============================================================')
  console.log('   CHALLENGER 2: Milestone M3 UI Label & Interaction Audit  ')
  console.log('   Scope: 3-api-reference Part 2 (functions, config, edge, proxy - 75 Demos)')
  console.log('============================================================\n')

  const manifest = loadDemosManifest()
  const m3Demos = getM3Demos(manifest)

  console.log(`Found ${m3Demos.length} M3 demos in manifest.\n`)

  let passCount = 0
  let failCount = 0
  let warnCount = 0
  const findings: { demo: string; issue: string; severity: 'ERROR' | 'WARN' }[] = []
  const auditDetails: M3DemoAuditDetail[] = []

  for (const demo of m3Demos) {
    const dir = getDemoSourceDir(demo)
    const nestedDemoDirs = manifest
      .filter(other => other.url !== demo.url && other.url.startsWith(demo.url + '/'))
      .map(other => getDemoSourceDir(other))

    const files = getAllFiles(dir, ['.tsx', '.ts']).filter(
      f => !nestedDemoDirs.some(n => f.startsWith(n + path.sep))
    )
    const rootEntries = [path.join(dir, 'page.tsx'), path.join(dir, 'layout.tsx')]

    let guide = null
    let guideFile = ''
    for (const entry of rootEntries) {
      if (fs.existsSync(entry)) {
        const content = fs.readFileSync(entry, 'utf-8')
        if (content.includes('DemoGuideCard')) {
          guide = parseGuideCardFromTsx(content)
          if (guide && guide.steps.length > 0) {
            guideFile = entry
            break
          }
        }
      }
    }

    if (!guide) {
      for (const f of files) {
        if (rootEntries.includes(f)) continue
        const content = fs.readFileSync(f, 'utf-8')
        if (content.includes('DemoGuideCard')) {
          guide = parseGuideCardFromTsx(content)
          if (guide && guide.steps.length > 0) {
            guideFile = f
            break
          }
        }
      }
    }

    if (!guide) {
      findings.push({ demo: demo.url, issue: 'No DemoGuideCard found', severity: 'ERROR' })
      failCount++
      continue
    }

    // Inspect playground components (excluding GuideCard and DeepDiveCard)
    const playgroundFiles = files.map(f => {
      let raw = fs.readFileSync(f, 'utf-8')
      let clean = raw
        .replace(/<DemoGuideCard[\s\S]*?(?:\/>|<\/DemoGuideCard>)/g, '')
        .replace(/<DemoDeepDiveCard[\s\S]*?(?:\/>|<\/DemoDeepDiveCard>)/g, '')
      return { path: f, raw, clean }
    })

    const fullClean = playgroundFiles.map(f => f.clean).join('\n')
    const fullRaw = playgroundFiles.map(f => f.raw).join('\n')

    const { labels: extractedUiLabels, ternaries: extractedTernaries } = extractInteractiveUiElements(fullClean)

    const quotedTokens: string[] = []
    const concatenatedLabels: string[] = []
    const missingOrMismatchedLabels: string[] = []
    const leaks: string[] = []
    const issues: string[] = []

    // 1. Check template literal / HTML entity leaks in guide
    const guideRawText = JSON.stringify(guide)
    const leakMatches = guideRawText.match(/(\$\{[^}]+\}|&lt;|&gt;|&amp;)/g)
    if (leakMatches) {
      leaks.push(...leakMatches)
      issues.push(`String leak detected in guide: ${leakMatches.join(', ')}`)
      findings.push({ demo: demo.url, issue: `String leak in guide: ${leakMatches.join(', ')}`, severity: 'ERROR' })
    }

    // 2. Step-by-step verification
    guide.steps.forEach(s => {
      const fullText = `${s.title} ${s.description}`
      // Extract bracketed tokens: [token]
      const brackets = Array.from(fullText.matchAll(/\[([^\]]+)\]/g)).map(m => m[1].trim())
      brackets.forEach(b => quotedTokens.push(b))

      brackets.forEach(b => {
        // Check ternary concatenation
        // e.g. [처리 중... 버튼이름], [요청 중... 조회], [A B] where A is pending and B is idle
        if (b.includes('...') && (
          b.includes('검증') ||
          b.includes('처리') ||
          b.includes('조회') ||
          b.includes('로딩') ||
          b.includes('진행') ||
          b.includes('실행') ||
          b.includes('전송') ||
          b.includes('생성') ||
          b.includes('발급') ||
          b.includes('삭제') ||
          b.includes('갱신')
        )) {
          concatenatedLabels.push(`Step ${s.step}: [${b}]`)
          issues.push(`Concatenated ternary label detected: Step ${s.step} [${b}]`)
          findings.push({
            demo: demo.url,
            issue: `Concatenated ternary label detected in Step ${s.step} [${b}]. Idle state button label should be used.`,
            severity: 'ERROR',
          })
        }

        // Check if quoted token refers to a button/tab/input in playground
        // If it looks like an action/button/tab quote, verify existence
        const isActionOrTarget = s.title.includes(`[${b}]`)
        if (isActionOrTarget && b.length > 1) {
          // Check if token or substring exists in fullClean or in extractedUiLabels
          const cleanToken = b.replace(/^[+-\s]+/, '').trim()
          const exists = fullClean.includes(b) || fullClean.includes(cleanToken) ||
            extractedUiLabels.some(l => l.includes(b) || l.includes(cleanToken) || b.includes(l))

          if (!exists) {
            // Check if it's a generic concept/state badge or file name
            const isConceptOrState = ['Playground', '결과', '검증', '초기 상태', '상태', '콘솔', '헤더', '쿠키'].some(c => b.includes(c))
            const isCodeOrFile = b.includes('.ts') || b.includes('.tsx') || b.includes('/') || b.includes('()')
            if (!isConceptOrState && !isCodeOrFile && b.length > 2) {
              // Potential mismatch
              missingOrMismatchedLabels.push(`[${b}] in Step ${s.step}`)
            }
          }
        }
      })
    })

    // 3. Check ternaries in components to ensure idle state branch is what's cited
    extractedTernaries.forEach(t => {
      // If pendingBranch is cited instead of idleBranch in title
      guide.steps.forEach(s => {
        if (s.title.includes(`[${t.pendingBranch}]`) && !s.title.includes(`[${t.idleBranch}]`)) {
          issues.push(`Step ${s.step} quotes pending state [${t.pendingBranch}] instead of idle state [${t.idleBranch}]`)
          findings.push({
            demo: demo.url,
            issue: `Step ${s.step} quotes pending ternary branch [${t.pendingBranch}] instead of idle branch [${t.idleBranch}]`,
            severity: 'ERROR',
          })
        }
      })
    })

    // 4. Check observe & observeAt in last step
    const lastStep = guide.steps[guide.steps.length - 1]
    const missingObserve = !lastStep || !lastStep.observe || lastStep.observe.trim().length < 5
    const observeTarget = lastStep?.observe || ''
    const observeAt = lastStep?.observeAt

    if (missingObserve) {
      issues.push('Missing or empty observe in last step')
      findings.push({
        demo: demo.url,
        issue: 'Missing or too short observe field in last step',
        severity: 'ERROR',
      })
    }

    if (observeAt && !['playground', 'verification', 'devtools', 'network', 'console'].includes(observeAt)) {
      issues.push(`Invalid observeAt value: ${observeAt}`)
      findings.push({
        demo: demo.url,
        issue: `Invalid observeAt value: ${observeAt}`,
        severity: 'ERROR',
      })
    }

    const hasErrors = issues.some(iss => !iss.startsWith('WARN'))
    const status: 'PASS' | 'WARN' | 'FAIL' = hasErrors ? 'FAIL' : (missingOrMismatchedLabels.length > 0 ? 'WARN' : 'PASS')

    if (status === 'FAIL') {
      failCount++
    } else if (status === 'WARN') {
      warnCount++
      passCount++
    } else {
      passCount++
    }

    auditDetails.push({
      id: demo.url,
      url: demo.url,
      zone: demo.zone,
      doc: demo.doc,
      guideFile: path.relative(NEXTJS_APP_ROOT, guideFile),
      stepsCount: guide.steps.length,
      quotedTokens,
      extractedUiLabels,
      extractedTernaries,
      concatenatedLabels,
      missingOrMismatchedLabels,
      missingObserve,
      observeTarget,
      observeAt,
      leaks,
      status,
      issues,
    })
  }

  console.log('------------------------------------------------------------')
  console.log(`Audited: ${m3Demos.length} demos`)
  console.log(`Passed cleanly: ${passCount - warnCount}`)
  console.log(`Passed with warnings: ${warnCount}`)
  console.log(`Flagged with errors: ${failCount}`)
  console.log('------------------------------------------------------------\n')

  if (findings.filter(f => f.severity === 'ERROR').length > 0) {
    console.log('Errors found:')
    findings.filter(f => f.severity === 'ERROR').forEach(f => {
      console.log(`  ❌ [${f.demo}] ${f.issue}`)
    })
    console.log('\nVERDICT: REJECT\n')
  } else {
    console.log('VERDICT: APPROVE\n')
  }

  return {
    total: m3Demos.length,
    passed: passCount,
    failed: failCount,
    warned: warnCount,
    findings,
    auditDetails,
    verdict: failCount === 0 ? ('APPROVE' as const) : ('REJECT' as const),
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = runM3AdversarialUiLabelsAudit()
  if (result.verdict !== 'APPROVE') {
    process.exit(1)
  }
  process.exit(0)
}
