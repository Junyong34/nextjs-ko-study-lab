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

const results: any[] = []

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

  const guideText = guide ? [guide.title, guide.concept, ...guide.steps.flatMap((s: any) => [s.title, s.description, s.actionBadge || '', s.observe || ''])].join(' ') : ''

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8')
    const buttons = findJsxElements(raw, 'button')
    for (const b of buttons) {
      const inner = b.inner.trim()
      if (inner.includes('?') && inner.includes(':')) {
        results.push({
          url: demo.url,
          file: path.relative(NEXTJS_APP_ROOT, file),
          tag: 'button',
          jsx: inner,
          steps: guide ? guide.steps.map((s: any) => ({ step: s.step, title: s.title, desc: s.description })) : []
        })
      }
    }
  }
}

console.log(JSON.stringify(results, null, 2))
