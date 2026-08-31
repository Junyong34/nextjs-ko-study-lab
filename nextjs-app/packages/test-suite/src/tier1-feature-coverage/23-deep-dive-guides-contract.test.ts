import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { NEXTJS_APP_ROOT } from '../utils/test-helpers.ts'

const homeRoot = path.join(NEXTJS_APP_ROOT, 'apps/shell/src/components/home')
const sectionPath = path.join(homeRoot, 'DeepDiveGuidesSection.tsx')
const homeIndexPath = path.join(homeRoot, 'index.ts')
const homePagePath = path.join(NEXTJS_APP_ROOT, 'apps/shell/src/app/page.tsx')

function readSource(filePath: string): string {
  assert.ok(fs.existsSync(filePath), `${path.basename(filePath)} must exist`)
  return fs.readFileSync(filePath, 'utf-8')
}

describe('Tier 1: Deep dive guides home contract', () => {
  it('composes the guide book section after the roadmap and supplies U2 data', () => {
    const page = readSource(homePagePath)
    const index = readSource(homeIndexPath)

    assert.match(index, /export \{ DeepDiveGuidesSection \} from '\.\/DeepDiveGuidesSection'/)
    assert.match(page, /import \{[^}]*DeepDiveGuidesSection[^}]*\} from '@\/components\/home'/)
    assert.match(page, /<RoadmapStepCards\s*\/>[\s\S]*<DeepDiveGuidesSection guideBooks=\{guideBooks\}\s*\/>/)
    assert.match(page, /\{ id: 'deep-dive-guides', text: '더 깊이 파고들기', level: 2 \}/)
  })

  it('renders one group link per book with guide and representative demo metadata', () => {
    const source = readSource(sectionPath)

    assert.match(source, /<section id="deep-dive-guides" className="[^"]*scroll-mt-/)
    assert.match(source, /href="\/demo\?category=Guides"/)
    assert.match(source, /가이드 데모 전체 보기/)
    assert.match(source, /<Link[^>]*href=\{book\.guideUrl\}[^>]*className="group[^"]*"/)
    assert.match(source, /<PerspectiveBook[^>]*tone=\{[^}]*\}[^>]*trigger="group"/)
    assert.match(source, /<PerspectiveBookHeader>[\s\S]*\{book\.category\}[\s\S]*데모 \{book\.demoCount\}개/)
    assert.match(source, /<PerspectiveBookTitle[^>]*>[\s\S]*\{book\.guideTitle\}/)
    assert.match(source, /<PerspectiveBookDescription[^>]*>[\s\S]*\{book\.demoTitle\}/)
    assert.match(source, /\{book\.demoPath\}/)
    assert.doesNotMatch(source, /status/i)
    assert.doesNotMatch(source, /href="\/guides"/)
  })

  it('uses the shell favicon as a decorative plain image and preserves overflow and focus feedback', () => {
    const source = readSource(sectionPath)

    assert.match(source, /<img src="\/icon\.svg" alt="" aria-hidden/)
    assert.doesNotMatch(source, /next\/image/)
    assert.match(source, /overflow-x-auto/)
    assert.match(source, /pb-\d+/)
    assert.match(source, /trigger="group"/)
    assert.doesNotMatch(source, /#[0-9a-f]{3,8}/i)
  })
})
