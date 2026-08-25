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
  extractPlaygroundMetadata,
} from './guide-consistency-validator.ts'

const manifest = loadDemosManifest()
const m4Demos = manifest.filter((d) => {
  const norm = d.doc.replace(/^\/?(nextjs-docs\/)?/, '')
  const cat = norm.split('/')[0]
  return cat === '2-guides' || cat === '5-architecture'
})

console.log(`Auditing all ${m4Demos.length} M4 demos in detail...\n`)

const summary = {
  total: m4Demos.length,
  perfect: 0,
  flagged: 0,
  details: [] as any[]
}

for (const demo of m4Demos) {
  const dir = getDemoSourceDir(demo)
  const files = getAllFiles(dir, ['.tsx', '.ts'])

  let guide: any = null
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

  const playground = extractPlaygroundMetadata(dir)
  const issues: string[] = []

  if (!guide) {
    issues.push('Missing DemoGuideCard')
  } else {
    // Check steps
    for (const s of guide.steps) {
      // Check brackets
      const brackets = Array.from((s.title + ' ' + s.description).matchAll(/\[([^\]]+)\]/g)).map(m => m[1].trim())
      for (const b of brackets) {
        // Check if bracket contains concatenated ternary
        if (b.includes('?') || (b.includes(' ') && b.length > 25 && /확인|완료|성공|처리 중/.test(b) && /클릭|설치|구매|로그아웃|접기|펼치기/.test(b))) {
          issues.push(`Suspicious concatenated/long bracket label: "[${b}]" in step ${s.step}`)
        }
      }
    }

    // Check last step observe
    const lastStep = guide.steps[guide.steps.length - 1]
    if (!lastStep.observe || lastStep.observe.trim().length < 5) {
      issues.push(`Last step missing observe`)
    }
    if (lastStep.observeAt && !['playground', 'verification', 'devtools', 'network', 'console'].includes(lastStep.observeAt)) {
      issues.push(`Invalid observeAt: ${lastStep.observeAt}`)
    }
  }

  if (issues.length > 0) {
    summary.flagged++
    summary.details.push({ url: demo.url, issues })
  } else {
    summary.perfect++
  }
}

console.log(`Audit Summary:`)
console.log(`Total: ${summary.total}`)
console.log(`Clean: ${summary.perfect}`)
console.log(`Flagged: ${summary.flagged}`)
console.log(`\nFlagged Items:`)
console.log(JSON.stringify(summary.details, null, 2))
