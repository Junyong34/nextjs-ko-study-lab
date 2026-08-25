import fs from 'node:fs'
import path from 'node:path'
import {
  loadDemosManifest,
  getDemoSourceDir,
  getAllFiles,
  NEXTJS_APP_ROOT,
  type Demo,
} from '../utils/test-helpers.ts'
import {
  findJsxElements,
  parseGuideCardFromTsx,
  extractPlaygroundMetadata,
  type GuideCardData,
} from './guide-consistency-validator.ts'

interface TernaryLabelCheck {
  demoUrl: string
  file: string
  rawTernary: string
  trueBranch: string
  falseBranch: string
  quotedInGuide: string[]
  status: 'CORRECT_IDLE' | 'CORRECT_BOTH_DISTINGUISHED' | 'FLAGGED_CONCATENATED' | 'FLAGGED_PENDING_ONLY' | 'NO_QUOTE'
}

interface DemoVerificationReport {
  url: string
  doc: string
  category: string
  dir: string
  guide: GuideCardData | null
  interactiveCount: number
  buttons: string[]
  inputs: string[]
  links: string[]
  allLabels: string[]
  brackets: string[]
  matchedBrackets: { bracket: string; matchedLabel: string; type: string }[]
  unmatchedBrackets: string[]
  ternaryChecks: TernaryLabelCheck[]
  observe: { text: string; at?: string; valid: boolean; issues: string[] }
  defects: string[]
}

function extractTernaryButtonLabels(cleanTsx: string): { raw: string; trueBranch: string; falseBranch: string }[] {
  const results: { raw: string; trueBranch: string; falseBranch: string }[] = []
  // Matches {isPending ? 'A' : 'B'} or {loading ? "A" : "B"} or similar inside JSX
  const ternaryRegex = /\{(?:\s*[\w$.]+\s*(?:===|!==|==|!=)?\s*[\w$.'"]*\s*)\?\s*(['"`])([\s\S]*?)\1\s*:\s*(['"`])([\s\S]*?)\3\s*\}/g
  let match: RegExpExecArray | null
  while ((match = ternaryRegex.exec(cleanTsx)) !== null) {
    results.push({
      raw: match[0],
      trueBranch: match[2].trim(),
      falseBranch: match[4].trim(),
    })
  }
  return results
}

function runOracle() {
  const manifest = loadDemosManifest()
  const m4Demos = manifest.filter((d) => {
    const norm = d.doc.replace(/^\/?(nextjs-docs\/)?/, '')
    const cat = norm.split('/')[0]
    return cat === '2-guides' || cat === '5-architecture'
  })

  console.log(`\n============================================================`)
  console.log(`  M4 EMPIRICAL CHALLENGER ADVERSARIAL ORACLE (81 DEMOS)`)
  console.log(`============================================================\n`)
  console.log(`Targeting ${m4Demos.length} demos across 2-guides (77) and 5-architecture (4)...`)

  const reports: DemoVerificationReport[] = []
  let totalDefects = 0
  let totalTernaryChecked = 0
  let concatenatedTernaryBugs = 0
  let missingGuideCards = 0
  let brokenObserveTargets = 0

  for (const demo of m4Demos) {
    const dir = getDemoSourceDir(demo)
    const files = getAllFiles(dir, ['.tsx', '.ts'])

    let guide: GuideCardData | null = null
    const rootEntries = [path.join(dir, 'page.tsx'), path.join(dir, 'layout.tsx')]
    for (const entry of rootEntries) {
      if (fs.existsSync(entry)) {
        const text = fs.readFileSync(entry, 'utf-8')
        if (text.includes('DemoGuideCard')) {
          guide = parseGuideCardFromTsx(text)
          if (guide && guide.steps.length > 0) break
        }
      }
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

    const playground = extractPlaygroundMetadata(dir)
    const normDoc = demo.doc.replace(/^\/?(nextjs-docs\/)?/, '')
    const category = normDoc.split('/')[0]

    const defects: string[] = []

    if (!guide) {
      defects.push('Missing DemoGuideCard')
      missingGuideCards++
      reports.push({
        url: demo.url,
        doc: demo.doc,
        category,
        dir,
        guide: null,
        interactiveCount: playground.interactiveCount,
        buttons: playground.buttons,
        inputs: playground.inputs,
        links: playground.links,
        allLabels: playground.allLabels,
        brackets: [],
        matchedBrackets: [],
        unmatchedBrackets: [],
        ternaryChecks: [],
        observe: { text: '', valid: false, issues: ['No guide card'] },
        defects,
      })
      totalDefects += defects.length
      continue
    }

    // 1. Quoted Bracket Extraction
    const guideText = [
      guide.title,
      guide.concept,
      ...guide.steps.flatMap((s) => [s.title, s.description, s.actionBadge || '', s.observe || '']),
    ].join(' ')

    const bracketMatches = Array.from(guideText.matchAll(/\[([^\]]+)\]/g)).map((m) => m[1].trim())
    const matchedBrackets: { bracket: string; matchedLabel: string; type: string }[] = []
    const unmatchedBrackets: string[] = []

    // Also collect playground labels plus file names / tabs / states
    const playgroundCleanLabels = playground.allLabels.map((l) => l.trim().toLowerCase())

    for (const b of bracketMatches) {
      const cleanB = b.replace(/[+\-→←]/g, '').trim().toLowerCase()
      // Check if bracket is matched with button/input/link/label
      let matched = false
      for (const l of playground.allLabels) {
        const cleanL = l.replace(/[+\-→←]/g, '').trim().toLowerCase()
        if (cleanB && cleanL && (cleanB === cleanL || cleanB.includes(cleanL) || cleanL.includes(cleanB))) {
          matchedBrackets.push({ bracket: b, matchedLabel: l, type: 'exact/sub-label' })
          matched = true
          break
        }
      }
      if (!matched) {
        // Check if it's a technical keyword / file convention / badge / query / state
        const isTechnicalOrContext =
          /^(auto|full|false|default|loading|isPending|optimistic|server|client|layout\.tsx|page\.tsx|route\.ts|error\.tsx|GET|POST|PUT|DELETE|\d+ms|\d+개|\d+원|전체|전자기기|의류|도서|1단계|2단계|3단계|검증|완료|성공|실패|대기|재시도|초기화|상태|패널|DevTools|Network|캐시|동기화|낙관적|스트리밍|SSG|ISR|SSR|PPR|CSR|RSC|RCC|API|RBAC|AUTH|PWA|OG|SKU|ID|URL|HTTP|\/.*)/i.test(
            b,
          )
        if (isTechnicalOrContext) {
          matchedBrackets.push({ bracket: b, matchedLabel: '(technical/domain term)', type: 'domain-term' })
        } else {
          unmatchedBrackets.push(b)
        }
      }
    }

    // 2. Ternary Expressions Checks in Playground TSX files
    const ternaryChecks: TernaryLabelCheck[] = []
    for (const file of files) {
      if (file.includes('VerificationFooter') || file.includes('DemoGuideCard')) continue
      const raw = fs.readFileSync(file, 'utf-8')
      const ternaries = extractTernaryButtonLabels(raw)
      for (const t of ternaries) {
        totalTernaryChecked++
        // Check if guide text references t.raw or concatenated
        const hasTrue = guideText.includes(t.trueBranch)
        const hasFalse = guideText.includes(t.falseBranch)
        const quoted: string[] = []
        if (hasTrue) quoted.push(t.trueBranch)
        if (hasFalse) quoted.push(t.falseBranch)

        // Check if concatenated e.g. "A B" in brackets
        const concat1 = `${t.trueBranch} ${t.falseBranch}`
        const concat2 = `${t.falseBranch} ${t.trueBranch}`
        const isConcatenatedInGuide =
          guideText.includes(concat1) ||
          guideText.includes(concat2) ||
          bracketMatches.some((b) => b.includes(t.trueBranch) && b.includes(t.falseBranch))

        let status: TernaryLabelCheck['status'] = 'NO_QUOTE'
        if (isConcatenatedInGuide) {
          status = 'FLAGGED_CONCATENATED'
          concatenatedTernaryBugs++
          defects.push(`Ternary concatenated label leak: "${concat1}" found in guide text`)
        } else if (hasFalse && hasTrue) {
          status = 'CORRECT_BOTH_DISTINGUISHED'
        } else if (hasFalse) {
          status = 'CORRECT_IDLE'
        } else if (hasTrue) {
          // If only true (pending) is quoted in click step, it might be confusing
          status = 'FLAGGED_PENDING_ONLY'
        }

        ternaryChecks.push({
          demoUrl: demo.url,
          file: path.relative(NEXTJS_APP_ROOT, file),
          rawTernary: t.raw,
          trueBranch: t.trueBranch,
          falseBranch: t.falseBranch,
          quotedInGuide: quoted,
          status,
        })
      }
    }

    // 3. Observe Target Validation
    const lastStep = guide.steps[guide.steps.length - 1]
    const observeIssues: string[] = []
    if (!lastStep.observe || lastStep.observe.trim().length < 5) {
      observeIssues.push('Missing or too short observe target on final step (<5 chars)')
      brokenObserveTargets++
      defects.push('GC04 violation: final step observe is missing or < 5 chars')
    }
    if (lastStep.observeAt && !['playground', 'verification', 'devtools', 'network', 'console'].includes(lastStep.observeAt)) {
      observeIssues.push(`Invalid observeAt: ${lastStep.observeAt}`)
      defects.push(`GC04 violation: invalid observeAt '${lastStep.observeAt}'`)
    }

    // 4. Critical Concept Error #2 Check if url is guides/server-actions/start-transition
    if (demo.url.includes('start-transition')) {
      const isUseActionStateMentionedInAction = /useActionState|useFormStatus|<form/i.test(guide.concept)
      if (isUseActionStateMentionedInAction) {
        defects.push('Critical Concept Error #2: start-transition concept mistakenly references useActionState/useFormStatus/<form>')
      }
      if (!guide.concept.includes('startTransition') || !guide.concept.includes('600ms')) {
        defects.push('Critical Concept Error #2: start-transition does not document programmatic startTransition or 600ms latency')
      }
    }

    // 5. String leaks check
    for (const s of guide.steps) {
      if (/\$\{[^}]+\}/.test(s.title) || /\$\{[^}]+\}/.test(s.description)) {
        defects.push(`GC05 violation: template literal leak in step ${s.step}`)
      }
      if (/&(?:lt|gt|amp|quot|apos);/i.test(s.title) || /&(?:lt|gt|amp|quot|apos);/i.test(s.description)) {
        defects.push(`GC05 violation: HTML entity leak in step ${s.step}`)
      }
    }

    totalDefects += defects.length

    reports.push({
      url: demo.url,
      doc: demo.doc,
      category,
      dir,
      guide,
      interactiveCount: playground.interactiveCount,
      buttons: playground.buttons,
      inputs: playground.inputs,
      links: playground.links,
      allLabels: playground.allLabels,
      brackets: bracketMatches,
      matchedBrackets,
      unmatchedBrackets,
      ternaryChecks,
      observe: {
        text: lastStep?.observe || '',
        at: lastStep?.observeAt,
        valid: observeIssues.length === 0,
        issues: observeIssues,
      },
      defects,
    })
  }

  // Print Summary Table
  console.log(`Audit Results for 81 M4 Demos:`)
  console.log(`----------------------------------------------------------------------------------------------------`)
  console.log(`Total M4 Demos Audited:         ${m4Demos.length}`)
  console.log(`Total Deficiencies / Defects:   ${totalDefects}`)
  console.log(`Missing Guide Cards:            ${missingGuideCards}`)
  console.log(`Concatenated Ternary Bugs:      ${concatenatedTernaryBugs}`)
  console.log(`Broken Observe Targets:         ${brokenObserveTargets}`)
  console.log(`Total Ternary Operators Scanned:${totalTernaryChecked}`)
  console.log(`----------------------------------------------------------------------------------------------------`)

  const defectiveDemos = reports.filter((r) => r.defects.length > 0)
  if (defectiveDemos.length > 0) {
    console.log(`\n❌ Defective Demos (${defectiveDemos.length}):`)
    for (const d of defectiveDemos) {
      console.log(`  - [${d.url}]: ${d.defects.join('; ')}`)
    }
  } else {
    console.log(`\n✅ ALL 81 M4 DEMOS PASSED 100% EMPIRICAL SCRUTINY!`)
  }

  // Check specific M4 samples
  console.log(`\n--- Selected Sample Demos In-Depth Inspection ---`)
  const samples = [
    'start-transition',
    'optimistic-cart',
    'server-client-components',
    'micro-frontends',
    'monorepo-structure',
    'analytics-provider',
    'i18n-routing',
    'middleware-guard',
  ]
  for (const sampleKey of samples) {
    const report = reports.find((r) => r.url.includes(sampleKey))
    if (report && report.guide) {
      console.log(`\nDemo: ${report.url}`)
      console.log(`  Concept: ${report.guide.concept.slice(0, 100)}...`)
      console.log(`  Interactive Elements (${report.interactiveCount}): buttons=[${report.buttons.slice(0, 4).join(', ')}] inputs=[${report.inputs.join(', ')}]`)
      console.log(`  Steps Count: ${report.guide.steps.length}`)
      for (const s of report.guide.steps) {
        console.log(`    Step ${s.step}: [${s.actionBadge || 'N/A'}] ${s.title}`)
        if (s.observe) console.log(`      Observe (${s.observeAt || 'playground'}): ${s.observe}`)
      }
    }
  }

  return { reports, totalDefects }
}

runOracle()
