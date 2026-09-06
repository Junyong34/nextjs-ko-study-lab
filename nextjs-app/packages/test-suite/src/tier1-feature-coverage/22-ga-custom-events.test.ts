import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { NEXTJS_APP_ROOT } from '../utils/test-helpers.ts'

describe('Tier 1: Feature 22 - GA4 Custom Events Contract', () => {
  const shellSrc = path.join(NEXTJS_APP_ROOT, 'apps/shell/src')
  const docsRenderSrc = path.join(NEXTJS_APP_ROOT, 'packages/docs-render/src')

  describe('22.1 AnalyticsEvent Type Definitions', () => {
    const analyticsPath = path.join(shellSrc, 'lib/analytics.ts')

    it('analytics.ts exists and exports AnalyticsEvent type and trackEvent function', () => {
      assert.ok(fs.existsSync(analyticsPath), 'analytics.ts must exist')
      const content = fs.readFileSync(analyticsPath, 'utf-8')
      assert.match(content, /export type AnalyticsEvent =/, 'Must export AnalyticsEvent')
      assert.match(content, /export function trackEvent\(/, 'Must export trackEvent')
    })

    it('defines learning_complete event with doc_id and chapter parameters', () => {
      const content = fs.readFileSync(analyticsPath, 'utf-8')
      assert.match(content, /name:\s*'learning_complete'/)
      assert.match(content, /params:\s*\{[^}]*doc_id:\s*string[^}]*chapter:\s*string[^}]*\}/s)
    })

    it('defines demo_click event with demo_type and from_doc parameters', () => {
      const content = fs.readFileSync(analyticsPath, 'utf-8')
      assert.match(content, /name:\s*'demo_click'/)
      assert.match(content, /params:\s*\{[^}]*demo_type:\s*string[^}]*from_doc:\s*string[^}]*\}/s)
    })

    it('defines github_star_click event with open_modal and go_to_repo actions', () => {
      const content = fs.readFileSync(analyticsPath, 'utf-8')
      assert.match(content, /name:\s*'github_star_click'/)
      assert.match(content, /action:\s*['"]open_modal['"]\s*\|\s*['"]go_to_repo['"]/)
    })
  })

  describe('22.2 learning_complete Event Trigger', () => {
    const providerPath = path.join(shellSrc, 'components/learning-progress/LearningProgressProvider.tsx')

    it('triggers learning_complete when a document is toggled to completed', () => {
      assert.ok(fs.existsSync(providerPath), 'LearningProgressProvider.tsx must exist')
      const content = fs.readFileSync(providerPath, 'utf-8')
      assert.match(content, /!wasCompleted\s*&&\s*kind\s*===\s*'document'/)
      assert.match(content, /trackEvent\(\{\s*name:\s*'learning_complete'/)
      assert.match(content, /doc_id:\s*key/)
      assert.match(content, /chapter/)
    })
  })

  describe('22.3 demo_click DOM Contract & Delegation', () => {
    const docDemoListPath = path.join(docsRenderSrc, 'demo/DocDemoList.tsx')
    const demoLinkCardPath = path.join(docsRenderSrc, 'demo/DemoLinkCard.tsx')
    const markdownRendererPath = path.join(docsRenderSrc, 'markdown/MarkdownRenderer.tsx')
    const trackerPath = path.join(shellSrc, 'components/analytics/DemoClickTracker.tsx')
    const pagePath = path.join(shellSrc, 'app/[...slug]/page.tsx')

    it('DocDemoList anchor provides data-analytics, data-demo-type, and data-from-doc attributes', () => {
      assert.ok(fs.existsSync(docDemoListPath), 'DocDemoList.tsx must exist')
      const content = fs.readFileSync(docDemoListPath, 'utf-8')
      assert.match(content, /data-analytics="demo_click"/)
      assert.match(content, /data-demo-type=\{demo\.zone\s*\|\|\s*'unknown'\}/)
      assert.match(content, /data-from-doc=\{docPath\s*\|\|\s*''\}/)
    })

    it('DemoLinkCard anchor provides data-analytics, data-demo-type, and data-from-doc attributes', () => {
      assert.ok(fs.existsSync(demoLinkCardPath), 'DemoLinkCard.tsx must exist')
      const content = fs.readFileSync(demoLinkCardPath, 'utf-8')
      assert.match(content, /data-analytics="demo_click"/)
      assert.match(content, /data-demo-type=\{zone\s*\|\|\s*'unknown'\}/)
      assert.match(content, /data-from-doc=\{docPath\s*\|\|\s*''\}/)
    })

    it('MarkdownRenderer passes zone and docPath to DemoLinkCard and DocDemoList', () => {
      assert.ok(fs.existsSync(markdownRendererPath), 'MarkdownRenderer.tsx must exist')
      const content = fs.readFileSync(markdownRendererPath, 'utf-8')
      assert.match(content, /<DemoLinkCard[^>]*zone=\{matchedDemo\?\.zone\}[^>]*docPath=\{docPath\}/s)
      assert.match(content, /<DocDemoList[^>]*docPath=\{docPath\}/s)
    })

    it('DemoClickTracker captures [data-analytics="demo_click"] and calls trackEvent', () => {
      assert.ok(fs.existsSync(trackerPath), 'DemoClickTracker.tsx must exist')
      const content = fs.readFileSync(trackerPath, 'utf-8')
      assert.match(content, /target\.closest\('\[data-analytics="demo_click"\]'\)/)
      assert.match(content, /trackEvent\(\{\s*name:\s*'demo_click'/)
      assert.match(content, /demo_type:/)
      assert.match(content, /from_doc:/)
    })

    it('Shell [...slug]/page.tsx mounts DemoClickTracker', () => {
      assert.ok(fs.existsSync(pagePath), '[...slug]/page.tsx must exist')
      const content = fs.readFileSync(pagePath, 'utf-8')
      assert.match(content, /import\s*\{\s*DemoClickTracker\s*\}\s*from\s*'@\/components\/analytics\/DemoClickTracker'/)
      assert.match(content, /<DemoClickTracker\s*\/>/)
    })
  })

  describe('22.4 github_star_click Event Trigger', () => {
    const starProviderPath = path.join(shellSrc, 'components/github-star/GithubStarProvider.tsx')

    it('fires github_star_click with open_modal when prompt is displayed', () => {
      assert.ok(fs.existsSync(starProviderPath), 'GithubStarProvider.tsx must exist')
      const content = fs.readFileSync(starProviderPath, 'utf-8')
      assert.match(content, /trackEvent\(\{\s*name:\s*'github_star_click',\s*params:\s*\{\s*action:\s*'open_modal'\s*\},?\s*\}\)/)
    })

    it('fires github_star_click with go_to_repo when user clicks through to GitHub', () => {
      const content = fs.readFileSync(starProviderPath, 'utf-8')
      assert.match(content, /trackEvent\(\{\s*name:\s*'github_star_click',\s*params:\s*\{\s*action:\s*'go_to_repo'\s*\},?\s*\}\)/)
    })
  })
})
