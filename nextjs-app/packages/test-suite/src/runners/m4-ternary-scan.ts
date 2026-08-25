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

console.log(`Checking all ${m4Demos.length} M4 demos for all JSX buttons and ternary expressions...`)

for (const demo of m4Demos) {
  const dir = getDemoSourceDir(demo)
  const files = getAllFiles(dir, ['.tsx', '.ts']).filter(
    (f) => !f.includes('VerificationFooter') && !f.includes('DemoGuideCard')
  )

  let guideText = ''
  for (const f of getAllFiles(dir, ['.tsx'])) {
    const raw = fs.readFileSync(f, 'utf-8')
    const g = parseGuideCardFromTsx(raw)
    if (g) {
      guideText = [g.title, g.concept, ...g.steps.map(s => `${s.step}. [${s.actionBadge || ''}] ${s.title} -> ${s.description} (obs: ${s.observe || ''})`)].join('\n')
      break
    }
  }

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8')
    // Look at all buttons
    const buttons = findJsxElements(raw, 'button')
    for (const b of buttons) {
      const inner = b.inner.trim()
      if (inner.includes('?') && inner.includes(':')) {
        console.log(`\n[Ternary Button Found] ${demo.url} in ${path.basename(file)}:`)
        console.log(`  Button JSX: <button ...>${inner}</button>`)
        console.log(`  Guide summary:\n${guideText}`)
      }
    }
  }
}
