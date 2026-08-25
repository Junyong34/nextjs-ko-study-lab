import fs from 'node:fs'
import path from 'node:path'
import {
  loadDemosManifest,
  getDemoSourceDir,
  getAllFiles,
  NEXTJS_APP_ROOT,
} from '../utils/test-helpers.ts'
import {
  findJsxElements,
  parseGuideCardFromTsx,
} from './guide-consistency-validator.ts'

const manifest = loadDemosManifest()
const m4Demos = manifest.filter((d) => {
  const norm = d.doc.replace(/^\/?(nextjs-docs\/)?/, '')
  const cat = norm.split('/')[0]
  return cat === '2-guides' || cat === '5-architecture'
})

interface LabelCheckResult {
  url: string
  file: string
  buttonJsx: string
  idleLabel: string
  activeLabel?: string
  guideQuotedText: string[]
  isIdleQuoted: boolean
  isConcatenatedQuoted: boolean
  isActiveOnlyQuoted: boolean
}

const checkResults: LabelCheckResult[] = []

for (const demo of m4Demos) {
  const dir = getDemoSourceDir(demo)
  const files = getAllFiles(dir, ['.tsx', '.ts']).filter(
    (f) => !f.includes('VerificationFooter') && !f.includes('DemoGuideCard')
  )

  let guide: any = null
  for (const f of getAllFiles(dir, ['.tsx'])) {
    const raw = fs.readFileSync(f, 'utf-8')
    const g = parseGuideCardFromTsx(raw)
    if (g) {
      guide = g
      break
    }
  }

  const guideTitles = guide ? guide.steps.map((s: any) => s.title) : []
  const guideFullText = guide
    ? [guide.title, guide.concept, ...guide.steps.flatMap((s: any) => [s.title, s.description])].join(' ')
    : ''

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8')
    const buttons = findJsxElements(raw, 'button')
    for (const b of buttons) {
      const inner = b.inner.trim()
      // Check for ternary
      const ternaryMatch = inner.match(/\{(?:\s*[\w$.]+\s*(?:===|!==|==|!=)?\s*[\w$.'"]*\s*)\?\s*(['"`])([\s\S]*?)\1\s*:\s*(['"`])([\s\S]*?)\3\s*\}/)
      if (ternaryMatch) {
        const branchA = ternaryMatch[2].trim()
        const branchB = ternaryMatch[4].trim()

        // Determine which is idle based on variable name or state initializer
        // Usually isPending / loading / pending / isDraft / isOpen / added / installed / sent / isPlaying
        let activeLabel = branchA
        let idleLabel = branchB
        if (inner.includes('isOpen ?')) {
          // isOpen is true initially in children-slot
          idleLabel = branchA // '슬롯 접기'
          activeLabel = branchB // '슬롯 펼치기'
        }

        const concatA_B = `${branchA} ${branchB}`
        const concatB_A = `${branchB} ${branchA}`

        const isConcatenated = guideFullText.includes(concatA_B) || guideFullText.includes(concatB_A)
        const isIdleQuoted = guideFullText.includes(idleLabel)
        const isActiveOnly = guideFullText.includes(activeLabel) && !isIdleQuoted && !isConcatenated

        checkResults.push({
          url: demo.url,
          file: path.relative(NEXTJS_APP_ROOT, file),
          buttonJsx: inner,
          idleLabel,
          activeLabel,
          guideQuotedText: guideTitles,
          isIdleQuoted,
          isConcatenatedQuoted: isConcatenated,
          isActiveOnlyQuoted: isActiveOnly,
        })
      }
    }
  }
}

console.log(`\n============================================================`)
console.log(`  ALL TERNARY BUTTONS ANALYSIS (${checkResults.length} FOUND)`)
console.log(`============================================================\n`)

for (const r of checkResults) {
  console.log(`URL: ${r.url}`)
  console.log(`  File: ${r.file}`)
  console.log(`  Button: ${r.buttonJsx.replace(/\s+/g, ' ')}`)
  console.log(`  Idle Label: "${r.idleLabel}" | Active Label: "${r.activeLabel}"`)
  console.log(`  Concatenated Leaked in Guide? ${r.isConcatenatedQuoted ? '🚨 YES (BUG)' : '✅ NO'}`)
  console.log(`  Idle Quoted in Guide? ${r.isIdleQuoted ? '✅ YES' : '❌ NO'}`)
  console.log(`  Guide Step Titles:`, r.guideQuotedText)
  console.log(`------------------------------------------------------------`)
}
