import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import {
  NEXTJS_APP_ROOT,
  loadDemosManifest,
  getDemoSourceDir,
  getAllFiles,
  type Demo,
} from '../utils/test-helpers.ts'
import { parseGuideCardFromTsx } from './guide-consistency-validator.ts'

const __filename = fileURLToPath(import.meta.url)

interface DemoAuditDetail {
  url: string
  zone: string
  doc: string
  guideFile: string
  stepsCount: number
  concatenatedLabels: string[]
  unmatchedBrackets: string[]
  missingObserve: boolean
  observeTarget: string
}

export function runM2AdversarialUiLabelsAudit() {
  console.log('============================================================')
  console.log('   CHALLENGER 2: Milestone M2 UI Label & Interaction Audit  ')
  console.log('   Scope: 3-api-reference (file-conventions, components, directives - 62 Demos)')
  console.log('============================================================\n')

  const manifest = loadDemosManifest()
  const m2Demos = manifest.filter(d => {
    const doc = d.doc || ''
    return doc.startsWith('3-api-reference/3.1-file-conventions') ||
           doc.startsWith('3-api-reference/3.2-components') ||
           doc.startsWith('3-api-reference/3.4-directives')
  })

  console.log(`Found ${m2Demos.length} M2 demos in manifest.\n`)

  let passCount = 0
  let failCount = 0
  const findings: { demo: string; issue: string }[] = []
  const auditDetails: DemoAuditDetail[] = []

  for (let i = 0; i < m2Demos.length; i++) {
    const demo = m2Demos[i]
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
      findings.push({ demo: demo.url, issue: 'No DemoGuideCard found' })
      failCount++
      continue
    }

    const playgroundFiles = files.map(f => {
      let raw = fs.readFileSync(f, 'utf-8')
      let clean = raw
        .replace(/<DemoGuideCard[\s\S]*?(?:\/>|<\/DemoGuideCard>)/g, '')
        .replace(/<DemoDeepDiveCard[\s\S]*?(?:\/>|<\/DemoDeepDiveCard>)/g, '')
      return { path: f, raw, clean }
    })

    const fullClean = playgroundFiles.map(f => f.clean).join('\n')

    const concatenatedLabels: string[] = []
    const unmatchedBrackets: string[] = []

    guide.steps.forEach(s => {
      const fullText = `${s.title} ${s.description}`
      const brackets = Array.from(fullText.matchAll(/\[([^\]]+)\]/g)).map(m => m[1].trim())

      brackets.forEach(b => {
        // Check ternary concatenation
        if (b.includes('...') && (b.includes('검증') || b.includes('처리') || b.includes('조회') || b.includes('로딩') || b.includes('진행'))) {
          concatenatedLabels.push(`Step ${s.step}: [${b}]`)
        }
      })
    })

    const lastStep = guide.steps[guide.steps.length - 1]
    const missingObserve = !lastStep || !lastStep.observe || lastStep.observe.trim().length < 5
    const observeTarget = lastStep?.observe || ''

    if (concatenatedLabels.length > 0) {
      concatenatedLabels.forEach(cl => {
        findings.push({
          demo: demo.url,
          issue: `Concatenated ternary label detected (${cl}). Idle button label should be quoted instead of concatenated ternary string.`,
        })
      })
      failCount++
    } else {
      passCount++
    }

    auditDetails.push({
      url: demo.url,
      zone: demo.zone,
      doc: demo.doc,
      guideFile: path.relative(NEXTJS_APP_ROOT, guideFile),
      stepsCount: guide.steps.length,
      concatenatedLabels,
      unmatchedBrackets,
      missingObserve,
      observeTarget,
    })
  }

  console.log('------------------------------------------------------------')
  console.log(`Audited: ${m2Demos.length} demos`)
  console.log(`Passed: ${passCount}`)
  console.log(`Flagged with issues: ${failCount}`)
  console.log('------------------------------------------------------------\n')

  if (findings.length > 0) {
    console.log('Discrepancies found:')
    findings.forEach(f => {
      console.log(`  ❌ [${f.demo}] ${f.issue}`)
    })
    console.log('\nVERDICT: REJECT')
    console.log('Issues must be addressed.\n')
  } else {
    console.log('VERDICT: APPROVE\n')
  }

  return {
    total: m2Demos.length,
    passed: passCount,
    failed: failCount,
    findings,
    auditDetails,
    verdict: failCount === 0 ? ('APPROVE' as const) : ('REJECT' as const),
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = runM2AdversarialUiLabelsAudit()
  if (result.verdict !== 'APPROVE') {
    process.exit(1)
  }
  process.exit(0)
}
